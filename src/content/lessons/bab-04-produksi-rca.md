# Ownership produksi & troubleshooting

Lowongan Senior Full Stack (MERN) seperti Bookipi menilai ini lebih dari hafalan API: **kamu pernah memiliki fitur sampai produksi**, sistem sempat tumbuh, lalu kamu bisa men-debug saat rusak.

Ini bukan bab "cara `console.log`". Ini bab bagaimana seorang senior menemukan akar masalah, memperbaiki, dan memastikan tidak terulang.

## Konsep

Ownership end-to-end artinya kamu bisa menjawab empat pertanyaan tanpa melempar ke orang lain:

1. **Apa yang user rasakan?** Invoice tidak terbit, payroll gagal, tombol Bayar muter.
2. **Di lapisan mana?** Browser, CDN, API, antrian, Mongo, pihak ketiga (Stripe).
3. **Mengapa terjadi sekarang?** Deploy, data baru, lonjakan trafik, dependensi lambat, race.
4. **Bagaimana kita tahu selesai, dan bagaimana agar tidak kembali?** Tes, alert, runbook, guardrail.

### RCA yang bisa diceritakan di interview

1. Reproduksi sempit: request-id, user-id, waktu, payload (tanpa secret).
2. Lihat sinyal dulu, jangan menebak: log terstruktur, metrik p95/p99, trace, error budget.
3. Bagi dua: regresi (baru rusak setelah deploy) vs laten (data/trafik mencapai ambang).
4. Perbaiki gejala jika user sedang berdarah (feature flag off, rollback), **baru** perbaiki akar.
5. Pencegahan: tes yang gagal untuk skenario itu, alert, batas timeout, idempotency, dashboard.

Contoh kalimat senior: *"p95 checkout naik dari 400 ms ke 2.1 s setelah deploy aggregasi laporan. Trace menunjukkan N+1 populate di `/invoices`. Saya rollback, tambah `$lookup` + index, dan pasang tes yang menolak query `totalDocsExamined >> nReturned`."*

### Scaling yang mereka maksud

Bukan "saya tahu Kubernetes". Melainkan: trafik atau kompleksitas domain naik (lebih banyak invoice, lebih banyak integrasi), dan kamu memilih **batas yang mana yang diukur** — DB, payload, worker, atau chatty API.

| Gejala | Hipotesis pertama | Bukan langkah pertama |
| --- | --- | --- |
| p95 API naik | explain query, N+1, payload | Tambah replica "supaya kuat" |
| Error 5xx spike | deploy diff, dependensi, OOM | Rewrite framework |
| Duplikat invoice | idempotency, retry client, webhook dobel | "suruh user jangan klik dua kali" |
| Event loop lag | sync I/O, JSON besar, loop CPU | Tambah instance membabi buta |

## Tips menjawab

Pewawancara Bookipi-style akan mendorong: "Ceritakan produksi yang rusak." Pakai STAR: situasi (fintech, uang), tugas (kamu on-call / pemilik fitur), aksi (ukur → rollback/fix → pencegahan), hasil (angka).

Kalau belum punya insiden besar: ceritakan near-miss yang kamu cegah — timeout tanpa retry, unique index yang kamu usulkan, webhook yang kamu buat idempoten.

## Sudut pandang senior

Tergantung blast radius. Kalau pembayaran/payroll: rollback dulu, diskusi akar belakangan. Kalau halaman pengaturan: boleh hotfix kecil. Senior tidak memamerkan keberanian "saya debug 4 jam di prod" — mereka memamerkan **waktu-ke-mitigasi**.

Observability adalah syarat ownership. Tanpa correlation id, kamu bukan men-debug, kamu sedang mengundi.

## Kesalahan umum

- Langsung scale-out sebelum mengukur.
- Memperbaiki gejala (`try/catch` kosong, retry tanpa bound) tanpa akar.
- Tidak punya tes yang mereproduksi bug setelah hotfix.
- Menyalahkan "jaringan" atau "Mongo aneh" tanpa `explain` / trace.
- Tidak bisa menjelaskan apa yang berubah di deploy.
