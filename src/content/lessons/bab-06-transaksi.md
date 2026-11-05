# Transaksi, konsistensi, retry, duplikat

Apa yang terjadi saat dua request, dua webhook, atau retry network mengenai uang.

## Konsep

### Satu dokumen vs multi-dokumen

Operasi pada **satu dokumen Mongo selalu atomic**. Desain yang baik menaruh perubahan yang harus bersama di satu dokumen (atau memakai update bersyarat) supaya transaksi mahal jarang dipakai.

Transaksi multi-dokumen (`session.withTransaction`) butuh replica set. Lebih lambat, bisa abort, dan retry-able. Pakai untuk: transfer saldo, terbit invoice + kurangi stok + tulis ledger — jika memang tidak bisa di-model sebagai satu dokumen / satu update atomic.

```js
await session.withTransaction(async () => {
  const inv = await Invoice.create([{ ...input, status: "issued" }], { session });
  const stock = await Stock.findOneAndUpdate(
    { sku, qty: { $gte: input.qty } },
    { $inc: { qty: -input.qty } },
    { session, new: true },
  );
  if (!stock) throw new Error("OUT_OF_STOCK"); // abort transaksi
  await Ledger.create([{ invoiceId: inv[0]._id, amount: input.amount }], { session });
});
```

Tergantung isolasi. Default snapshot/write-conflict: dua transaksi yang sentuh dokumen sama, satu akan retry. Jangan anggap "transaksi = tidak perlu unique index".

### Konsistensi

| Yang kamu jamin | Cara | Trade-off |
| --- | --- | --- |
| Stok tidak negatif | update atomic `qty: { $gte: n }` | Satu dokumen; cukup untuk banyak kasus |
| Invoice tidak dobel | unique `idempotencyKey` + upsert | Retry aman; bentrok payload beda → 409 |
| Ledger seimbang | transaksi multi-doc atau outbox | Lebih mahal; perlu retry handler |
| Replica secondary | eventual | Jangan baca secondary untuk "sudah bayar?" |

Write concern `majority` untuk uang. Baca setelah tulis di primary. Jangan janjikan "langsung terlihat di semua region" tanpa menyebut lag.

### Retry yang benar

Retry **hanya** operasi yang idempoten atau yang punya kunci.

- Jaringan timeout setelah `POST /charges`: **jangan** charge ulang buta. Cek status dulu, atau kirim `Idempotency-Key` yang sama.
- Transaksi Mongo `TransientTransactionError` / `UnknownTransactionCommitResult`: retry seluruh callback, bukan "lanjutkan di tengah".
- Webhook Stripe datang 3 kali: handler cek `event.id` unik, return 200 cepat, kerja berat di queue.

```js
async function commitWithRetry(fn) {
  for (let i = 0; i < 3; i++) {
    try {
      return await fn();
    } catch (err) {
      if (err.hasErrorLabel?.("TransientTransactionError") && i < 2) continue;
      throw err;
    }
  }
}
```

### Duplicate handling

Tiga sumber duplikat yang selalu ditanya:

1. **User klik dua kali** — disable tombol tidak cukup. Idempotency-Key dari client + unique index.
2. **Client retry** karena 502 — server harus mengenali kunci yang sama.
3. **Webhook / job dobel** — unique `providerEventId`, state machine (`open → paid`, tidak `paid → paid` yang men-credit dua kali).

Pola upsert:

```js
try {
  await Payment.create({ providerEventId, invoiceId, amount });
} catch (err) {
  if (err.code === 11000) return; // sudah diproses — sukses, bukan error user
  throw err;
}
```

Atau `findOneAndUpdate({ providerEventId }, { $setOnInsert: {...} }, { upsert: true, rawResult: true })` dan keluar jika bukan insert baru.

## Tips menjawab

Kalau ditanya "bagaimana cegah invoice dobel?": sebut **tiga lapis** — unique index (kebenaran), idempotency key (kontrak API), UI disable (UX). Jangan hanya satu.

Kalau ditanya transaksi vs atomic update: *"Tergantung batas konsistensi. Stok di satu SKU: atomic cukup dan lebih cepat. Invoice + ledger + stok yang harus commit bersama: transaksi atau transactional outbox. Saya ukur contention-nya dulu."*

## Sudut pandang senior

Transaksi adalah alat, bukan tanda senioritas. Senior justru **mengurangi** kebutuhan transaksi dengan model data (snapshot, single-doc, outbox). Di fintech, duplikat lebih menakutkan daripada latency 50 ms.

Outbox: tulis event di transaksi yang sama dengan perubahan bisnis, worker terpisah yang publish. At-least-once + consumer idempoten mengalahkan "exactly-once" yang mustahil di jaringan.

## Kesalahan umum

- Baca-ubah-tulis stok/saldo.
- Retry `POST` pembayaran tanpa kunci.
- Transaksi panjang yang memanggil Stripe di dalamnya (lock lama, timeout).
- Unique index "nanti saja".
- Anggap 200 dari webhook berarti pekerjaan berat sudah aman di-request yang sama tanpa persist event id.
