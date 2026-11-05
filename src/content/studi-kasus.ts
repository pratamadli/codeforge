export type StudiKasus = {
  id: string;
  title: string;
  prompt: string;
  answer: string;
};

/** Bab 10 — verbal review. Bukan pilihan ganda. */
export const STUDI_KASUS: StudiKasus[] = [
  {
    id: "double-booking",
    title: "Kasus 1 · Double booking / stok",
    prompt:
      "Dua orang memesan kamar terakhir bersamaan. Kode hanya 'cek tersedia, lalu simpan'. Apa yang salah, opsi apa yang ada, dan apa yang kamu pilih dulu?",
    answer:
      "Itu race: keduanya bisa lolos. Opsi: update atomic bersyarat (findOneAndUpdate stok > 0), unique constraint (kamarId, tanggal), optimistic locking (version), hold TTL saat checkout, distributed lock terakhir. Mulai dari constraint + update atomic di database — kebenaran dijamin DB, bukan if di aplikasi. Tambah hold TTL untuk checkout. Hindari lock terdistribusi kecuali opsi lain tidak cukup.",
  },
  {
    id: "pembayaran",
    title: "Kasus 2 · Integrasi pembayaran",
    prompt:
      "User klik Bayar dua kali, jaringan putus setelah bayar, webhook gateway terlambat atau dobel. Bagaimana agar uang dan invoice tetap benar?",
    answer:
      "Idempotency key (retry = hasil yang sama). State machine pending → authorized → captured → refunded. Webhook = sumber kebenaran: verifikasi signature, idempoten, 200 cepat, kerja di queue. Hitung total di server. Rekonsiliasi berkala. Tokenisasi kartu (PCI), jangan simpan data mentah. Timeout: cek status dulu, jangan charge ulang. Pilih alur asinkron; UI tahan 'menunggu konfirmasi'.",
  },
  {
    id: "monolith",
    title: "Kasus 3 · Monolith atau microservices?",
    prompt:
      "Produk masih berkembang, tim belum besar. Seseorang mengusulkan pecah ke microservices 'supaya scalable'. Bagaimana kamu menjawab?",
    answer:
      "Mulai modular monolith: satu deploy, modul berbatas jelas, transaksi dan debug mudah. Pecah hanya jika ada alasan nyata (skala, tim, siklus rilis berbeda). Microservices menukar kompleksitas kode dengan kompleksitas operasional — CI/CD, monitoring, tracing harus siap.",
  },
  {
    id: "api-gaya",
    title: "Kasus 4 · REST, GraphQL, atau tRPC?",
    prompt:
      "Kamu merancang API. Kapan REST, kapan GraphQL, kapan tRPC? Sebut trade-off masing-masing.",
    answer:
      "REST: API publik, cache mudah, tooling luas; risiko over/under-fetch. GraphQL: banyak client beda kebutuhan; cache sulit, query mahal perlu limit kedalaman. tRPC: fullstack TS satu repo, type-safe end-to-end; kurang cocok API publik multi-bahasa.",
  },
  {
    id: "api-lambat",
    title: "Kasus 5 · API lambat",
    prompt:
      "p95 /invoices naik. Apa urutan tindakanmu? Jangan langsung 'tambah replica'.",
    answer:
      "Ukur dulu (APM/trace) — jangan menebak. DB: index, explain, hilangkan N+1, projection. Cache yang sering dibaca dan jarang berubah. Pindahkan kerja berat ke queue. Promise.all untuk panggilan independen. Pagination/kompresi. Skala horizontal terakhir.",
  },
  {
    id: "cache",
    title: "Kasus 6 · Strategi caching",
    prompt:
      "Kapan cache-aside, write-through, TTL? Data apa yang tidak boleh bergantung pada cache? Apa itu cache stampede?",
    answer:
      "Cache-aside paling umum (risiko data basi). Write-through lebih konsisten, tulis lebih lambat. TTL sederhana, terima sedikit basi. Jawaban aman: TTL pendek + invalidasi eksplisit; saldo/stok akhir jangan bergantung cache. Stampede: banyak request menyerbu DB saat cache habis bersamaan — mitigasi TTL acak + lock saat isi ulang.",
  },
  {
    id: "queue",
    title: "Kasus 7 · Sinkron atau queue?",
    prompt:
      "Kirim email, resize gambar, laporan pajak. Masukkan ke request HTTP atau ke queue? Mengapa, dan apa risikonya?",
    answer:
      "Pekerjaan lama/bisa gagal/tidak perlu hasil seketika → queue (BullMQ/Redis, SQS) + worker. Plus: respons cepat, tahan lonjakan, retry. Minus: lebih banyak komponen, hasil tidak instan, consumer harus idempoten, perlu dead-letter queue.",
  },
  {
    id: "realtime",
    title: "Kasus 8 · Polling, SSE, atau WebSocket?",
    prompt:
      "Status pembayaran vs chat vs live feed. Pilih yang paling sederhana yang cukup. Apa biaya WebSocket?",
    answer:
      "Polling: sederhana, update jarang (status bayar). SSE: server→client, notifikasi/feed/progres. WebSocket: dua arah — chat, kolaborasi. WebSocket butuh reconnect, sticky session / pub-sub; lebih mahal dioperasikan. Jangan pilih yang paling keren.",
  },
  {
    id: "upload",
    title: "Kasus 9 · Upload file besar",
    prompt:
      "User unggah PDF 200 MB lewat form ke server Express. Apa yang salah dan bagaimana merancangnya?",
    answer:
      "Jangan lewatkan file melalui server app. Server buat pre-signed URL; browser unggah langsung ke object storage. Validasi tipe/ukuran, pindai malware bila perlu, metadata saja di DB. File sangat besar: multipart/resumable.",
  },
  {
    id: "fe-skala",
    title: "Kasus 10 · Frontend skala besar",
    prompt:
      "Beberapa tim akan mengerjakan dashboard invoice. Bagaimana agar tidak saling tabrak dan bundle tidak meledak?",
    answer:
      "Pisahkan server state (TanStack Query) dari client state. Design system. Folder per fitur. Performance budget + Core Web Vitals di CI. Micro-frontend hanya jika banyak tim independen — biayanya tinggi. Observability FE: Sentry, analitik, feature flag.",
  },
];
