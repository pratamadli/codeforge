# Cache, queue, payload, dan cara menjawab optimasi

## 8.6 Caching: contoh konkret

Pola paling umum **cache-aside**: cek cache dulu, jika kosong ambil dari DB lalu simpan.

```php
$stats = Cache::remember("dashboard:{$user->id}", 60, fn () => $this->buildStats($user));
Cache::forget("dashboard:{$user->id}");
```

```js
async function getProduct(id) {
  const key = `product:${id}`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  const product = await Product.findById(id).lean();
  await redis.set(key, JSON.stringify(product), "EX", 60);
  return product;
}
```

| Pertanyaan | Jawaban praktis |
| --- | --- |
| Layak di-cache? | Sering dibaca, jarang berubah, mahal dihitung: katalog, konfigurasi, ringkasan, agregasi. |
| Jangan? | Saldo, stok akhir saat checkout, data unik per request, hasil yang murah. |
| Cegah data basi? | TTL pendek + invalidasi eksplisit. Data kritis: baca langsung. |
| Cache stampede? | Banyak request menyerbu DB saat cache habis bersamaan. Mitigasi: TTL jitter, lock saat isi ulang, refresh lebih awal. |
| Desain key? | `entitas:id:versi`. Satu perubahan versi bisa membuang cache terkait. |
| Driver? | Redis, bukan file, untuk multi-server. |

Lapisan lain: HTTP/CDN (`Cache-Control`, ETag 304); `config:cache` / `route:cache` di Laravel; memoization in-memory untuk data statis kecil; tabel ringkasan dihitung job terjadwal.

Jangan pakai cache untuk menutupi query buruk. Cache tanpa rencana invalidasi = bug yang sulit dilacak.

## 8.7 Pekerjaan berat keluar dari request

Pengguna tidak perlu menunggu email atau PDF. Balas cepat, kerjakan di queue.

```js
app.post("/orders", async (req, res) => {
  const order = await createOrder(req.body);
  await invoiceQueue.add("send-invoice", { orderId: order.id }, {
    attempts: 5,
    backoff: { type: "exponential", delay: 1000 },
    jobId: `invoice:${order.id}`,
  });
  res.status(201).json(order);
});
```

Padanan Laravel: `SendInvoice::dispatch(...)->afterCommit()` (bab 7.5). Prinsip sama: respons cepat, worker, job idempoten, retry + backoff.

## 8.8 Optimasi di level aplikasi

| Area | Laravel | Node / Express |
| --- | --- | --- |
| Mode produksi | `APP_DEBUG=false`, `php artisan optimize`, `composer install --no-dev --optimize-autoloader` | `NODE_ENV=production`, dependensi produksi, build/minify |
| Runtime | OPcache, pertimbangkan Octane | Banyak proses (cluster/PM2/replika) |
| Kapasitas | Worker PHP-FPM sesuai RAM/CPU | Jangan blokir event loop; ukur *event loop lag* |
| Query | Eager loading, `preventLazyLoading`, `select`, `chunk` | `lean()`, projection, `Promise.all` |
| CPU berat | Queue + worker | `worker_threads` atau queue |
| Paralel | Antar-request: banyak proses PHP | `Promise.all` untuk I/O independen dalam satu request |
| JSON | API Resource hanya field perlu | Field seperlunya, `fast-json-stringify` jika payload besar |
| Logging | Level error/warning, jangan berlebihan | Logger async (pino), bukan `console.log` di jalur panas |
| Session/cache | Redis, bukan file | Redis, bukan memori proses |
| HTTP keluar | `Http::timeout(5)->retry(3, 200)` | Timeout + retry + keep-alive agent |
| Memori | Hati-hati static/singleton di Octane | Stream data besar, bersihkan listener/timer |

```js
const [user, orders, stats] = await Promise.all([
  getUser(id),
  getOrders(id),
  getStats(id),
]); // ~120 ms, bukan 300 ms
```

Laravel: kemenangan terbesar hampir selalu query + eager loading, lalu OPcache dan queue. Node: selain query, jaga event loop bebas dan manfaatkan paralelisme I/O.

## 8.9 Payload dan jaringan

- Pagination dan pilih field. Respons 1,8 MB → 40 KB sering lompatan terbesar di mobile.
- Kompresi gzip/brotli (Nginx/CDN).
- HTTP cache: `Cache-Control` publik, ETag (304).
- CDN untuk aset statis dan GET publik.
- Kurangi API chatty: gabungkan panggilan kecil.
- HTTP/2 dan keep-alive.
- Gambar: resize di server/CDN, WebP/AVIF, jangan kirim asli ke thumbnail.

## 8.10 Optimasi data (lebih luas dari query)

| Teknik | Penjelasan |
| --- | --- |
| Desain skema | Tipe tepat, index sesuai akses, denormalisasi terukur (`orders_count`, snapshot harga). |
| Tabel ringkasan | Agregasi mahal di job terjadwal; dashboard baca tabel kecil. |
| Read replica | Listing/laporan ke replica. Waspada replication lag: baca-setelah-tulis dari primary. |
| Pisahkan analitik | Jangan pakai DB utama untuk laporan berat jam sibuk. |
| Arsip / retensi | Partisi per tanggal, arsip lama, TTL index Mongo (log, OTP, session). |
| Pencarian teks | Meilisearch / Typesense / Elasticsearch (Scout), bukan `LIKE '%kata%'`. |
| Import/export besar | Batch 500–1000, transaksi per batch, queue, upsert, stream file. |
| Connection pooling | Total = instance × ukuran pool. PHP buka koneksi per request → PgBouncer / ProxySQL / RDS Proxy. |
| Transaksi singkat | Jangan panggil API di dalamnya; urutan akses tabel konsisten (hindari deadlock). |

## 8.11 Studi kasus: endpoint daftar order lambat

Angka di bawah **ilustrasi** untuk melatih cara bercerita. Saat interview, ganti dengan kasus nyata.

Situasi: `GET /api/orders` p95 2,4 detik jam sibuk.

| Tahap | Temuan / perubahan | p95 |
| --- | --- | --- |
| 1. Ukur | APM: 2,0 dtk DB, 0,3 serialisasi. Telescope: 103 query/request. | 2,4 dtk |
| 2. Hilangkan N+1 | `with()` + `withCount()`: 103 → 3 query. | 0,9 dtk |
| 3. Tambah index | EXPLAIN scan 1,2 juta baris → index `(status, created_at)` ≈ 20 baris. | 0,25 dtk |
| 4. Kecilkan payload | Pilih kolom, Resource ramping, cursor pagination. 1,8 MB → 40 KB. | 0,14 dtk |
| 5. Cache data panas | Ringkasan di-cache 60 detik. | 0,02 dtk (hit) |

Pencegahan: `preventLazyLoading` di dev/test, alert p95, slow query log, k6 sebelum rilis, review query di code review.

Versi Express/Mongoose: masalah sama. Perbaikan: `populate`/`$in` + `lean()`, index ESR, projection + cursor, Redis. Tambahan khas Node: serialisasi data besar jangan blokir event loop.

## 8.12 Cara menjawab di interview

Tujuh tuas:

1. **Ukur** — p95, APM, slow query, EXPLAIN.
2. **Query / DB** — N+1, index, pilih kolom, pagination, bulk.
3. **Cache** — apa, TTL, invalidasi.
4. **Queue** — kerja berat keluar dari request.
5. **Payload** — kecilkan, kompresi, HTTP cache, CDN.
6. **Paralelkan** — `Promise.all`, banyak worker, hindari blocking.
7. **Skala** — stateless, horizontal, read replica — **terakhir**.

Contoh jawaban:

*"Saya selalu mulai dari mengukur, bukan menebak. Endpoint daftar order p95 2,4 detik, sebagian besar di database, 100+ query karena N+1. Eager loading turun ke 3 query, index gabungan setelah EXPLAIN full scan, payload dikecilkan dengan kolom + cursor pagination, ringkasan di-cache 60 detik. p95 sekitar 140 ms. Pencegahan: alert p95 dan tolak lazy loading di dev. Scale horizontal baru setelah bottleneck query dan aplikasi selesai."*

| Lanjutan | Jawaban konkret |
| --- | --- |
| Tahu bagian mana yang lambat? | p95 APM, breakdown, slow query, jumlah query, EXPLAIN. |
| Mengapa p95, bukan rata-rata? | Rata-rata menyembunyikan pengguna yang sangat lambat. |
| Sudah ada index tapi masih lambat? | EXPLAIN apakah terpakai, non-sargable, urutan kolom, selektivitas, terlalu banyak data, lock. |
| Kapan tidak cache? | Harus akurat real-time, unik per request, murah, atau query buruk belum diperbaiki. |
| Cache basi? | TTL pendek, invalidasi eksplisit, baca sumber untuk data kritis. |
| Optimasi tanpa menambah server? | Query, index, cache, payload, queue. Server baru jika itu selesai. |
| Kapan scale horizontal? | Setelah aplikasi/DB beres dan app stateless. |
| Risiko optimasi? | Kompleksitas, data basi, prematur. Ukur dampak, perubahan kecil. |
| Beda Node vs Laravel? | Database hampir sama. Node: event loop + paralel I/O. Laravel: eager loading, OPcache/Octane, queue. |

Siapkan **2 cerita nyata**: gejala → alat → akar masalah → perubahan → angka sebelum/sesudah → pencegahan. Jika belum punya angka persis, perkirakan jujur ("sekitar") — jangan mengarang.

## Tips menjawab

Kerangka 7 tuas + satu cerita berangka. Interviewer menilai pemahaman dari cerita, bukan daftar alat.

## Sudut pandang senior

Scale horizontal untuk query buruk hanya memperbesar biaya. Perbaiki N+1 dan index dulu.

## Kesalahan umum

- Daftar alat tanpa cerita ("Redis, index, queue").
- Optimasi prematur.
- Index sembarangan tanpa EXPLAIN.
- Mengklaim hasil tanpa angka.
