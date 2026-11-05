# Integrasi pembayaran (Stripe-like)

Bookipi adalah fintech invoice/payroll. Integrasi pihak ketiga seperti **Stripe** adalah nice-to-have tertulis, tetapi di interview sering jadi studi kasus wajib: uang, retry, webhook, duplikat.

Judge tidak menjalankan Stripe. Latih di kertas: kamu harus bisa menggambar alur dan menyebut apa yang gagal.

## Konsep

### Sumber kebenaran

Redirect browser "success=true" **bukan** bukti bayar. Jaringan bisa putus setelah uang terpotong. Sumber kebenaran: **webhook yang diverifikasi signature** + rekonsiliasi berkala ke laporan provider.

```js
app.post("/webhooks/stripe", express.raw({ type: "application/json" }), async (req, res) => {
  const event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], secret);
  await enqueue(event);          // persist dulu
  res.sendStatus(200);           // cepat; kerja berat di worker
});
```

`constructEvent` gagal → 400, jangan 200. Body harus raw; `express.json()` global merusak verifikasi.

### State machine (jangan boolean `paid`)

`draft → open → pending_payment → paid → refunded` (+ `void`, `failed`). Transisi disimpan di server. Webhook `payment_intent.succeeded` hanya boleh memindahkan `pending_payment → paid` **sekali**. Event kedua: no-op.

### Idempotency

- Keluar: `stripe.paymentIntents.create({ amount, currency, idempotencyKey })` — retry timeout tidak membuat charge kedua.
- Masuk: unique `event.id`. Kode 11000 = sudah diproses.
- Invoice: unique `(provider, providerInvoiceId)` atau kunci bisnis `(orgId, period, type)`.

### Timeout, retry, rekonsiliasi

Timeout setelah create intent: retrieve by id / by idempotency, jangan create baru. Retry webhook dari Stripe bersifat at-least-once; handler wajib idempoten. Job harian: bandingkan `paid` lokal vs daftar Stripe; selisih masuk antrian investigasi, bukan "kita anggap beres".

PCI: jangan pernah simpan nomor kartu. Token / Payment Element. Di log, redaksi payload.

### UI yang jujur

Tergantung UX. Polling status 2–3 detik + "menunggu konfirmasi" lebih jujur daripada spinner 30 detik yang bergantung request sinkron ke Stripe. Kalau webhook lambat, user tetap lihat `pending_payment`.

## Tips menjawab

Kerangka 90 detik: klarifikasi mata uang & yang tidak boleh gagal → API `POST /invoices/:id/pay` + idempotency → Stripe PaymentIntent → webhook → state machine → rekonsiliasi. Sebut dua opsi: Checkout hosted (cepat, kurang kontrol UI) vs Elements (kontrol, lebih banyak kerja PCI-adjacent).

Siapkan cerita: webhook dobel, atau timeout yang hampir men-charge dua kali, dan apa yang kamu pasang setelahnya.

## Sudut pandang senior

Tergantung yurisdiksi dan produk. Invoice B2B bisa "kirim link bayar". Payroll tidak boleh "eventual" tanpa SLO: dana harus sampai atau di-alert. Senior memilih **kesalahan mana yang mahal** (duplikat transfer) lalu mendesain menekan itu, bukan meminimalkan baris kode.

Jangan panggil Stripe di dalam transaksi Mongo yang masih terbuka. Commit status `pending` + outbox, charge di worker, webhook menutup `paid`. Lock DB tidak boleh menunggu jaringan pihak ketiga.

## Kesalahan umum

- Percaya query `?success=1` di return URL.
- `express.json()` sebelum webhook.
- Retry create tanpa idempotency key.
- Men-credit saldo di setiap webhook `succeeded` tanpa cek transisi.
- Menyimpan PAN/CVC "sebentar di server".
