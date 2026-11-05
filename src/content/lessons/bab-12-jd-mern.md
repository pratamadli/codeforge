# Menjawab interview Senior Full Stack (MERN)

Bab 12 yang umum tetap berlaku. Tambahan ini merapikan lidah untuk JD seperti Bookipi: fintech + AI, invoice/payroll, remote, jam Sydney.

## Konsep — apa yang mereka uji

| Klausa JD | Yang mereka ingin dengar |
| --- | --- |
| Production feature ownership | Kamu membawa fitur dari spek → API → UI → rilis → monitor |
| Scaling production / growing complexity | Bukan buzzword; angka (p95, jumlah invoice, worker backlog) + pilihan yang kamu buat |
| Transactions, consistency, retries, duplicates | Unique index, atomic update, idempotency, webhook, kapan transaksi multi-doc |
| Troubleshooting + prevention | RCA, rollback, tes yang mengunci regresi, alert |
| Architecture, trade-offs, end-to-end | Dua opsi, konsekuensi, apa yang kamu pilih untuk *konteks mereka* |
| Docker / AWS / CI/CD | Jalur rilis dan rollback, bukan daftar layanan |
| Stripe-like integrations | Webhook, signature, state machine, rekonsiliasi |

## Cerita STAR yang wajib disiapkan

1. **Fitur yang kamu miliki sendiri** sampai produksi (invoice, payout, onboarding).
2. **Insiden:** duplikat, timeout payment, query yang membunuh Atlas.
3. **Trade-off:** monolith vs pecah service, session vs JWT, atomic vs multi-doc txn.
4. **Pencegahan:** index, idempotency, tes, feature flag.
5. **Kolaborasi produk:** spek yang kamu tolak karena merusak konsistensi uang.

Latihan keras: 3 menit per cerita, tanpa slide. Kalau tidak punya domain fintech, pinjam analogi e-commerce/order — prinsipnya sama.

## Pertanyaan balik yang relevan

- Bagaimana alur invoice/payroll dari ide ke produksi? Siapa on-call?
- Apa insiden uang terakhir dan apa yang berubah setelahnya?
- Atlas / Postgres / mix — mengapa? Transaksi di mana ditegakkan?
- Stripe (atau setara) — webhook di-handle siapa, rekonsiliasi seberapa sering?
- Jam Sydney: overlap, handoff, dokumentasi keputusan (ADR)?

## Tips menjawab

Jangan terdengar seperti bootcamp: "saya bisa CRUD MERN". Ganti: *"Saya biasanya mulai dari kontrak API dan state machine, baru UI. Untuk pembayaran saya anggap at-least-once dan menekan duplikat di unique key + transisi status."*

Jika ditanya microservices di tim kecil: tolak dengan alasan operasional, tawarkan modular monolith.

## Sudut pandang senior

Mereka merekrut orang yang bisa **memperlambat spek yang berbahaya** dan tetap mengantar. Tunjukkan kamu nyaman bilang tidak, plus alternatif yang bisa di-ship minggu ini.

## Kesalahan umum

- Hanya bicara hooks React.
- Tidak bisa menjelaskan satu query lambat sampai `explain`.
- "Saya selalu pakai transaksi" atau "saya tidak pernah pakai transaksi".
- Tidak punya pertanyaan tentang uang, on-call, atau rilis.
