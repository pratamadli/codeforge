# Optimasi backend: ukur, N+1, index, pagination

Saat ditanya "bagaimana kamu mengoptimasi backend?", jawaban "saya pakai cache dan index" terdengar hafalan. Jawaban kuat: **gejala terukur → penyebab ditemukan → perubahan konkret → hasil berangka**.

## 8.1 Ukur dulu, jangan menebak

| Metrik | Artinya | Catatan |
| --- | --- | --- |
| Latency p50 / p95 / p99 | 50% / 95% / 99% request lebih cepat dari angka ini | Pakai p95/p99, bukan rata-rata — rata-rata menyembunyikan yang sangat lambat |
| Throughput (RPS) | Request per detik | Naik/turun saat beban berubah |
| Error rate | Persentase 5xx / timeout | Optimasi tidak boleh menaikkan error |
| Saturation | CPU, memori, koneksi DB, antrean | Yang penuh = calon bottleneck |

Alur kerja yang selalu sama:

1. Reproduksi dan ukur: endpoint mana, berapa p95, kapan (jam sibuk? data tertentu?).
2. Temukan bottleneck: aplikasi, database, jaringan, atau API eksternal? Mayoritas di database dan I/O.
3. Perbaiki yang terbesar dulu (satu perubahan per langkah).
4. Ukur lagi. Tambah pencegahan (alert, tes beban, aturan kode).

| Kebutuhan | Laravel | Node / Express |
| --- | --- | --- |
| Melihat query | Telescope, Debugbar, Clockwork, `DB::listen`, `->toSql()` | Mongoose debug, slow query log |
| Profil aplikasi | Blackfire, Xdebug, Pulse | `clinic.js`, `node --prof`, `--inspect` |
| APM produksi | New Relic, Datadog, Sentry, Nightwatch/Pulse | New Relic, Datadog, Sentry, OpenTelemetry |
| Ukur bagian kode | `Benchmark::measure`, log durasi | `console.time` / `performance.now()`, pino |
| Uji beban | k6, JMeter, Locust | k6, autocannon, Artillery |
| Rencana query | `EXPLAIN` / `EXPLAIN ANALYZE`, `->explain()` | `explain('executionStats')` (Mongo) |

## 8.2 Peta cepat: gejala → penyebab → perbaikan

| Gejala | Penyebab yang sering | Perbaikan konkret |
| --- | --- | --- |
| Endpoint lambat, ratusan query | N+1 | Eager loading (`with`, `populate`, `$in`) |
| Satu query lambat, DB CPU tinggi | Index tidak ada / tidak terpakai | Index sesuai query, cek EXPLAIN |
| Halaman 1 cepat, halaman 5000 lambat | Offset pagination besar | Cursor / keyset pagination |
| Respons besar, JSON berat | Semua kolom/relasi | Pilih kolom, API Resource ramping, pagination, kompresi |
| Data yang sama dihitung berulang | Tidak ada cache | Cache-aside + TTL + invalidasi |
| Request lama saat email/PDF | Kerja berat di request | Queue + worker |
| Semua request melambat (Node) | Event loop terblokir | Worker thread, queue, hindari `*Sync` |
| Memori naik terus | Kebocoran / muat data besar | Stream/chunk, `lean()`, bersihkan listener |
| `too many connections` | Pool terlalu besar / koneksi per request | Atur pool, connection pooler |
| Lambat hanya saat ramai | Lock, transaksi panjang, deadlock | Perpendek transaksi, urutan akses konsisten, retry |
| Lambat karena API pihak ketiga | Tunggu sinkron | Timeout, retry + backoff, cache, queue |

## 8.3 N+1 query

N+1: ambil daftar (1 query), lalu di loop ambil relasi tiap baris (N query). 50 order + user + items ≈ 101 query, padahal cukup 2–3.

```php
// BURUK: 1 + 50 + 50
$orders = Order::latest()->take(50)->get();
foreach ($orders as $o) {
    echo $o->user->name;
    echo $o->items->count();
}
// BAIK: 2 query
$orders = Order::with('user:id,name')->withCount('items')->latest()->take(50)->get();
Model::preventLazyLoading(! app()->isProduction());
```

```js
// BURUK (Mongoose)
const orders = await Order.find({ status: "paid" }).limit(50);
for (const o of orders) o.user = await User.findById(o.userId);

// BAIK: populate + lean
const orders = await Order.find({ status: "paid" }).limit(50)
  .populate("userId", "name").lean();
```

Cara cerita di interview: *"Saya lihat jumlah query di Telescope/APM. 103 query untuk satu endpoint — tanda N+1. Ganti eager loading, turun jadi 3, lalu `preventLazyLoading` agar tidak terulang."*

## 8.4 Index dan EXPLAIN

Tanpa index: full scan. Dengan index: lompat langsung, seperti daftar isi buku.

```php
Order::where('user_id', $id)->where('status', 'paid')->orderByDesc('created_at')->limit(20)->get();

Schema::table('orders', function (Blueprint $t) {
    $t->index(['user_id', 'status', 'created_at']);
});
```

EXPLAIN MySQL: sebelum `type = ALL, rows = 1.200.000`; sesudah `type = ref/range`, `rows = 20`. PostgreSQL: `Seq Scan` vs `Index Scan`.

Urutan kolom index gabungan: kolom `=` dulu, lalu ORDER BY/rentang (aturan **ESR**, sama seperti Mongo). Setiap index memperlambat tulis — buat dari query nyata, hapus yang tak terpakai.

Mongo: `explain('executionStats')`. Bandingkan `totalDocsExamined` dengan `nReturned`. Ideal hampir sama, tahap `IXSCAN`.

Query **non-sargable** (index mati):

| Query lambat | Mengapa | Perbaikan |
| --- | --- | --- |
| `WHERE DATE(created_at) = '2026-01-01'` | Fungsi pada kolom | `whereBetween('created_at', [$start, $end])` |
| `WHERE name LIKE '%abc'` | Wildcard di depan | Search engine, atau prefix `LIKE 'abc%'` |
| `WHERE LOWER(email) = ?` | Fungsi pada kolom | Collation / index fungsional |
| `WHERE user_id = '123'` padahal integer | Konversi tipe implisit | Samakan tipe |
| `OFFSET 100000` | Tetap pindai 100.000 baris | Cursor pagination |
| `OR` di kolom berbeda | Sulit satu index | UNION atau index per kolom |

## 8.5 Ambil seperlunya, bulk, data besar

```php
// BURUK
$orders = Order::all();
// BAIK
$orders = Order::select('id', 'status', 'amount', 'created_at')
                ->paid()->cursorPaginate(20);
```

```js
const orders = await Order.find({ status: "paid" })
  .select("status amount createdAt").sort({ _id: -1 }).limit(20).lean();
```

### Cursor pagination

Offset = diminta buka halaman 5000, harus hitung dari halaman 1. Cursor = pembatas buku: "lanjutkan dari sini".

| | Offset (`page=5000`) | Cursor |
| --- | --- | --- |
| Cara kerja | Lewati N baris, ambil sisanya | Mulai dari penanda |
| Halaman dalam | Makin lambat | Relatif sama (index) |
| Data berubah saat scroll | Item terlewat / dobel | Stabil |
| Lompat ke halaman 50 | Bisa | Tidak langsung |
| Total halaman | Mudah (`COUNT`) | Tidak (atau query terpisah) |
| Cocok untuk | Admin kecil, halaman bernomor | Feed, infinite scroll, API publik |

```
GET /api/orders?limit=20  →  { data, next_cursor, has_more }
GET /api/orders?limit=20&cursor=...
```

Cursor di-encode (base64) agar client perlakukan sebagai teks buram.

```js
app.get("/orders", async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const filter = {};
  if (req.query.cursor) filter._id = { $lt: decode(req.query.cursor) };
  const rows = await Order.find(filter).sort({ _id: -1 }).limit(limit + 1).lean();
  const hasMore = rows.length > limit;
  const data = hasMore ? rows.slice(0, limit) : rows;
  res.json({
    data,
    has_more: hasMore,
    next_cursor: hasMore ? encode(data[data.length - 1]._id) : null,
  });
});
```

```php
$orders = Order::orderByDesc('id')->cursorPaginate(20);
```

Jika `created_at` bisa kembar, sertakan `id` sebagai pemutus seri di cursor dan di index `(created_at, id)`.

Dua arti "cursor": **pagination** = penanda halaman berikutnya; **database cursor / `.cursor()`** = stream hasil agar memori tidak habis.

Data besar: `chunkById` / `lazyById` (Laravel); `for await (const o of Order.find().lean().cursor())` (Mongoose). Bulk: `upsert` per batch 1000, bukan 10.000 query di loop. `bulkWrite` di Mongoose.

## Tips menjawab

*"Offset melambat di halaman dalam karena DB tetap memindai dan membuang N baris. Saya ganti cursor: `WHERE id < penanda` memakai index, waktunya konstan. Trade-off: tidak bisa lompat halaman dan tidak ada total — wajar untuk feed."*

## Sudut pandang senior

Ukur p95, bukan rata-rata. Satu perubahan per langkah agar dampak jelas. Index dari query nyata, bukan "tambah index di semua kolom".

## Kesalahan umum

- Mengoptimasi sebelum mengukur.
- Cache untuk menutupi query buruk.
- `LIKE '%kata%'` di tabel besar.
- Offset dalam untuk feed publik.
