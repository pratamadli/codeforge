# Cara berpikir senior & architect

Di level senior kamu dinilai dari kemampuan **memilih dan membenarkan**. Kerangka tiap kasus:

1. Klarifikasi: siapa pengguna, berapa trafik, apa yang tidak boleh gagal?
2. Sederhana dulu.
3. Trade-off: kompleksitas, biaya, konsistensi, kecepatan.
4. Risiko + mitigasi + cara mendeteksi.
5. Evolusi saat skala naik.

## Konsep — 10 kasus

**1. Double booking / stok.** "Cek lalu simpan" kalah race. Mulai dari update atomic bersyarat atau unique constraint. Hold TTL untuk checkout. Distributed lock terakhir.

**2. Pembayaran.** Idempotency key, state machine (`pending → captured → refunded`), webhook sebagai sumber kebenaran (verifikasi signature, idempoten), hitung total di server, rekonsiliasi, tokenisasi kartu (PCI), timeout: cek status dulu jangan charge ulang. Detail Stripe-like di pelajaran berikutnya.

**3. Monolith vs microservices.** Mulai modular monolith. Pecah hanya jika ada alasan nyata (skala, tim, siklus rilis berbeda). Microservices menukar kompleksitas kode dengan kompleksitas operasional.

**4. REST vs GraphQL vs tRPC.** REST: API publik, cache mudah. GraphQL: banyak client berbeda; hati-hati query mahal. tRPC: fullstack TS satu repo; kurang cocok API publik multi-bahasa.

**5. API lambat.** Ukur dulu (APM/tracing). Index + hilangkan N+1. Cache. Queue kerja berat. `Promise.all`. Pagination/kompresi. Skala horizontal **terakhir**.

**6. Cache.** Cache-aside paling umum. TTL + invalidasi eksplisit. Data kritis (saldo, stok akhir) jangan bergantung cache. Waspadai cache stampede (TTL acak, lock saat isi ulang).

**7. Queue.** Email, resize, laporan → queue. Respons cepat, tahan lonjakan, retry. Consumer harus idempoten + dead-letter queue.

**8. Realtime.** Polling (sederhana, jarang). SSE (satu arah). WebSocket (dua arah: chat). Pilih yang paling sederhana; WebSocket mahal dioperasikan.

**9. Upload besar.** Pre-signed URL ke object storage, jangan lewat server app. Validasi tipe/ukuran. Multipart/resumable untuk file sangat besar.

**10. FE skala besar.** Server state (TanStack Query) vs client state. Design system. Folder per fitur. Performance budget. Micro-frontend hanya jika banyak tim independen.

## Tips menjawab

Untuk desain sistem: klarifikasi → gambaran besar (client, API, DB, cache, queue) → model data + API inti → bagian tersulit → dua opsi + alasan → apa yang terjadi jika X mati, bagaimana mengetahuinya.

Selalu sebut **setidaknya dua opsi**. Jawaban "pakai Kafka" tanpa masalah yang dipecahkan terkesan junior.

## Sudut pandang senior

Kebenaran data dijamin database, bukan if di aplikasi. Untuk pembayaran pilih alur asinkron (webhook + status); UI harus tahan "menunggu konfirmasi". Consistency akhir boleh, asal status akhir benar dan terlacak.

## Kesalahan umum

- Langsung microservices / Redis / Kubernetes sebelum mengukur.
- Percaya redirect browser sebagai bukti bayar (bukan webhook).
- Cache tanpa strategi invalidasi.
- Menebak bottleneck.
