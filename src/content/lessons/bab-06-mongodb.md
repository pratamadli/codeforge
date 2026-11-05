# MongoDB: desain data dan performa

MongoDB menyimpan dokumen mirip JSON (BSON) dalam collection. Skema fleksibel — **bukan** berarti tanpa aturan. Tetap pakai Mongoose schema / Zod di aplikasi.

Padanan: database ≈ database, collection ≈ tabel, document ≈ baris, field ≈ kolom.

## Konsep

### Embed vs reference

| | Embed | Reference |
| --- | --- | --- |
| Contoh | Item pesanan di dalam `order` | `order.userId` merujuk `users` |
| Pakai jika | Dibaca bersama, dimiliki induk, jumlah kecil | Dipakai banyak dokumen, sering berubah, atau tak terbatas |
| Plus | Satu query, atomic per dokumen | Tidak duplikat |
| Minus | Duplikasi, batas 16 MB | `$lookup` / populate, lebih banyak query |

Aturan praktis: **data yang dibaca bersama disimpan bersama.** Hindari array yang tumbuh tanpa batas (semua komentar di dalam post).

### Index

Tanpa index = collection scan. Compound index: urutan **ESR** — Equality, Sort, Range.

```js
db.orders.find({ userId, status: "paid" }).sort({ createdAt: -1 });
db.orders.createIndex({ userId: 1, status: 1, createdAt: -1 });
```

Unique index (email), TTL (session/OTP), text index. Setiap index mempercepat baca, memperlambat tulis. Cek `explain("executionStats")`: cari `IXSCAN`, bandingkan `totalDocsExamined` vs `nReturned`.

Aggregation: `$match` dan `$limit` sedini mungkin. Update atomic: `$inc`, `$set`, `$push` — jangan baca-ubah-tulis jika bisa satu operasi. Pagination besar: cursor, bukan `skip`.

Satu dokumen selalu atomic. Transaksi multi-dokumen butuh replica set, lebih mahal — detail retry, duplikat, dan konsistensi ada di pelajaran **Transaksi** modul ini. Replica set = ketersediaan; secondary bisa sedikit tertinggal. Sharding jangan terlalu dini; shard key buruk (timestamp naik terus) = hot spot.

Uang: simpan satuan terkecil (sen) sebagai integer atau `Decimal128`, bukan float.

Mongoose: `lean()` untuk baca cepat, `select()` projection, `populate` seperlunya (bukan di loop), `runValidators: true` pada update, satu `mongoose.connect` per proses.

## Tips menjawab

Klasik: "Embed vs reference?", "Percepat query lambat?", "Compound index urutannya?", "Race condition stok?", "Kapan transaksi?"

Jawaban jujur yang disukai: *"Bukan mana yang lebih baik. Saya lihat pola akses dan kebutuhan konsistensi. Keuangan inti cenderung SQL. Katalog/log/konten fleksibel, Mongo nyaman."*

Stok: `findOneAndUpdate({ _id, stock: { $gte: qty } }, { $inc: { stock: -qty } })`. Jika `null`, stok tidak cukup. Jangan baca lalu simpan ulang.

## Sudut pandang senior

Di dokumen order, **snapshot** nama dan harga produk saat dibeli — bukan hanya `productId`. Kalau harga berubah besok, order lama tidak boleh ikut berubah. Ini duplikasi yang disengaja: tukar ruang demi kebenaran histori.

## Kesalahan umum

- `populate` di dalam loop (N+1).
- Tidak ada index untuk field yang sering difilter.
- Array tak terbatas di dalam dokumen.
- Uang sebagai `Number` floating point.
- `skip` besar untuk pagination.
- Mengira "schemaless" = tidak perlu validasi.
