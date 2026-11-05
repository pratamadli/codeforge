# Studi kasus: drill verbal

Di level senior kamu dinilai dari kemampuan **memilih dan membenarkan**. Kerangka tiap kasus:

1. Klarifikasi: siapa pengguna, berapa trafik, apa yang tidak boleh gagal?
2. Sederhana dulu.
3. Trade-off: kompleksitas, biaya, konsistensi, kecepatan.
4. Risiko + mitigasi + cara mendeteksi.
5. Evolusi saat skala naik.

Sepuluh kasus di bawah adalah **drill lisan**: jelaskan 3–5 menit seperti di interview, baru buka kerangka. Kartu tersimpan di browser ini.

Detail pembayaran Stripe-like (signature, `event.id`, ledger) ada di pelajaran berikutnya — kasus 2 di sini adalah kerangka umum.

## Tips menjawab

Untuk desain sistem: klarifikasi → gambaran besar (client, API, DB, cache, queue) → model data + API inti → bagian tersulit → **dua opsi** + alasan → apa yang terjadi jika X mati, bagaimana mengetahuinya.

Jawaban "pakai Kafka" tanpa masalah yang dipecahkan terkesan junior.

## Sudut pandang senior

Kebenaran data dijamin database, bukan if di aplikasi. Untuk pembayaran pilih alur asinkron (webhook + status); UI tahan "menunggu konfirmasi". Consistency akhir boleh, asal status akhir benar dan terlacak.

## Kesalahan umum

- Langsung microservices / Redis / Kubernetes sebelum mengukur.
- Percaya redirect browser sebagai bukti bayar (bukan webhook).
- Cache tanpa strategi invalidasi.
- Menebak bottleneck.
