# Soal MongoDB (materi + pembahasan)

Query Mongo tidak dijalankan di judge. Fokusnya: index ESR, aggregation, dan update atomic.

## Soal 14 · Query, index, aggregation, stok

**(a)** 20 order terbaru milik seorang user berstatus `paid`. Index apa?

**(b)** 5 produk dengan pendapatan tertinggi 30 hari terakhir.

**(c)** Kurangi stok tanpa race condition.

**(d)** Webhook pembayaran datang dua kali dengan `event.id` sama. Bagaimana agar invoice tidak ditandai `paid` dua kali dan ledger tidak dobel?

**(e)** `POST /invoices` timeout di client; client mengulang dengan `Idempotency-Key` yang sama. Apa yang harus terjadi?

### Pembahasan

```js
// (a) Equality (userId, status) lalu Sort (createdAt)
db.orders.find({ userId, status: "paid" }).sort({ createdAt: -1 }).limit(20);
db.orders.createIndex({ userId: 1, status: 1, createdAt: -1 });

// (b)
db.orders.aggregate([
  { $match: { status: "paid", createdAt: { $gte: since } } },
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.productId",
      revenue: { $sum: { $multiply: ["$items.price", "$items.qty"] } },
      sold: { $sum: "$items.qty" },
    },
  },
  { $sort: { revenue: -1 } },
  { $limit: 5 },
]);

// (c) satu operasi atomic: hanya berhasil jika stok cukup
const p = await Product.findOneAndUpdate(
  { _id: id, stock: { $gte: qty } },
  { $inc: { stock: -qty } },
  { new: true },
);
if (!p) throw new Error("Out of stock");

// (d) unique event + transisi status — retry webhook = no-op
db.payments.createIndex({ providerEventId: 1 }, { unique: true });
const wrote = await Payment.findOneAndUpdate(
  { providerEventId: event.id },
  { $setOnInsert: { invoiceId, amount: event.amount, status: "posted" } },
  { upsert: true, rawResult: true },
);
if (!wrote.lastErrorObject?.upserted) return; // duplikat
await Invoice.updateOne(
  { _id: invoiceId, status: "pending_payment" },
  { $set: { status: "paid" } },
);

// (e) unique idempotencyKey: request ulang mengembalikan dokumen yang sama
const existing = await Invoice.findOne({ orgId, idempotencyKey });
if (existing) return existing; // payload beda → 409
```

(a) urutan index mengikuti ESR. (b) `$match` di awal agar index terpakai. (c) dua request bersamaan tidak boleh sama-sama lolos — biarkan database yang menjamin atomisitas. (d) unique `providerEventId` + hanya transisi `pending_payment → paid`. (e) unique `(orgId, idempotencyKey)`; retry adalah sukses, bukan invoice baru.

## Setelah selesai semua

Pilih 3 soal tersulit dan ulangi besok tanpa melihat solusi. Kalau pakai AI, minta mengkritik: *"Cari bug dan kasus tepi dari kode saya, jangan beri solusi dulu."*

## Tips menjawab

Sebut `explain` saat ditanya query lambat. Sebut snapshot harga di order jika pembicaraan ke desain data. Untuk (d)(e) sebut **tiga lapis**: unique index, kontrak API, UX — bukan hanya disable tombol.

## Sudut pandang senior

Race stok adalah tes apakah kamu percaya "if di aplikasi" atau "constraint di database". Senior memilih database.

## Kesalahan umum

- Index `{ createdAt: -1, userId: 1 }` untuk query equality user+status (salah urutan).
- `$group` sebelum `$match`.
- Baca stok → hitung → `save()`.
