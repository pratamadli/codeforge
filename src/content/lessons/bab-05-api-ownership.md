# Desain API & ownership fitur

Di JD senior MERN, "design and develop APIs and backend services" artinya kamu merancang **kontrak** yang produk dan klien lain bisa andalkan — bukan hanya `app.post` yang mengembalikan 200.

## Konsep

Fitur end-to-end (contoh: terbitkan invoice) punya batas yang harus kamu miliki:

- **UI:** status yang jujur (draft / issuing / failed), bukan spinner abadi.
- **API:** perintah yang idempoten, validasi di server, error yang bisa ditindak.
- **Service:** aturan uang dan pajak dihitung di backend.
- **Data:** skema + index + transisi status yang valid.
- **Integrasi:** webhook, retry, rekonsiliasi.
- **Observability:** log + metrik per endpoint.

### Kontrak yang kelihatan senior

```http
POST /v1/invoices
Idempotency-Key: 8f3c-...
{ "clientId": "...", "items": [{ "desc": "Sep", "qty": 1, "unitAmount": 150000 }] }
```

- Total **tidak** dari client. Server hitung `amount`, pajak, mata uang.
- `Idempotency-Key` wajib untuk perintah yang mengubah uang. Request ulang = response yang sama, bukan invoice kedua.
- 201 + `Location` untuk create. 409 jika kunci bentrok dengan payload berbeda.
- Pagination cursor untuk daftar. Jangan `skip=100000`.
- Error: `{ code: "OUT_OF_STOCK", message, details }` — `code` untuk FE, `message` untuk manusia.

### Versi dan evolusi

Tergantung klien. Internal one-repo: additive change (field baru opsional) sering cukup. Mobile/partner: `/v1` dan masa deprecasi. Jangan ganti arti field diam-diam (`amount` tiba-tiba jadi dollar).

### Batas service

Service invoice tidak perlu tahu cara Stripe men-charge. Ia punya port: `Payments.charge({ amount, idempotencyKey })`. Implementasi Stripe/Xendit bisa diganti. Ini Dependency Inversion yang relevan di interview, bukan diagram UML.

## Tips menjawab

Saat diminta "desain API invoice":

1. Resource dan perintah (create, void, send, pay) — bukan 20 endpoint CRUD buta.
2. Idempotency + state machine.
3. Siapa yang boleh (role) dan audit trail (fintech).
4. Apa yang terjadi jika worker mati di tengah `send`.
5. Dua opsi: sinkron vs antrian, dan mengapa untuk skala mereka.

## Sudut pandang senior

Ownership berarti kamu menolak spek yang merusak konsistensi: "simpan total dari React supaya cepat" adalah tidak. Kamu menawarkan alternatif: preview di client, commit di server.

Tergantung kecepatan tim. Untuk MVP internal, satu `POST /invoices` gemuk lebih jujur daripada 8 microservice. Pecah saat ada alasan rilis/skala, bukan karena diagram di internet.

## Kesalahan umum

- CRUD yang mencerminkan tabel 1:1 tanpa use-case.
- 200 untuk semua, termasuk gagal bisnis.
- Tidak ada `Idempotency-Key` pada pembayaran/terbit dokumen.
- Breaking change tanpa versi.
- Controller berisi query + aturan pajak + panggilan Stripe.
