# Contekan cepat sebelum interview

Baca ini pagi-pagi sebelum masuk Zoom. Kalimat pendek, **bukan pengganti bab 1–15**.

Drill 16.1 ada di **Review** di sidebar: pertanyaan saja → jawab lantang 20–30 detik → buka jawaban satu kalimat → nilai Lancar atau Masih goyang. Kartu goyang diprioritaskan. Bukan pilihan ganda.

## 16.1 Pertanyaan cepat

| Pertanyaan | Jawaban singkat |
| --- | --- |
| State vs props? | State milik komponen dan bisa berubah. Props dari parent, read-only. |
| Kenapa key di list? | Agar React kenali item mana yang berubah/pindah/dihapus. Pakai ID stabil, bukan index. |
| Kapan re-render? | State berubah, parent re-render, context berubah, props berubah referensi. |
| Hydration? | React di browser menghidupkan HTML server: tempel handler + state. |
| SSR vs SSG vs ISR? | Tiap request / saat build / build lalu diperbarui berkala. |
| Server vs Client Component? | Server: tanpa JS ke browser, akses data langsung. Client: interaktif, hooks. |
| Node single-thread? | JS satu thread. I/O oleh libuv/OS. CPU berat: worker. Banyak core: banyak proses. |
| Microtask vs macrotask? | Microtask (Promise) dikosongkan semua dulu, baru satu macrotask per putaran. |
| Middleware Express? | Fungsi `(req, res, next)` dalam rantai request. |
| JWT vs session? | JWT stateless tapi sulit dicabut. Session mudah dicabut, butuh store. |
| PUT vs PATCH? | PUT ganti seluruh resource. PATCH sebagian. |
| Embed vs reference? | Embed: dibaca bersama, terbatas. Reference: dipakai banyak dokumen / tumbuh. |
| Offset vs cursor pagination? | Offset memindai dan membuang N baris (lambat di halaman dalam). Cursor: penanda item terakhir lewat index — cepat dan stabil, tidak bisa lompat halaman. |
| Percepat query Mongo? | Index ESR, explain, projection, hindari N+1 dan skip besar. |
| Cegah race? | Update atomic bersyarat, unique constraint, optimistic locking, atau transaksi. |
| Transaksi ganda? | Idempotency key + state machine + webhook idempoten. |
| Monolith vs microservices? | Mulai modular monolith. Pecah bila ada alasan skala/tim/rilis. |
| ACID? | Atomic, Consistent, Isolated, Durable. |

## 16.2 Rencana 2 minggu

| Hari | Fokus |
| --- | --- |
| 1–2 | JavaScript (bab 1, mulai peta istilah) + soal 1–7 di bab 15 tanpa AI |
| 3–5 | React (bab 2) soal 8–10, lalu TypeScript (bab 9) |
| 6–7 | Next.js (bab 3): rendering, Server/Client, caching, auth |
| 8–9 | Node + Express (bab 4–5): soal 11–13, beberapa tes (bab 10) |
| 10–11 | Mongo (bab 6) + soal 14; baca Laravel (bab 7) jika relevan di stack |
| 12 | Optimasi backend (bab 8): cerita gejala → penyebab → perbaikan → angka. Redis/Docker/CI (bab 11) |
| 13 | Studi kasus (bab 12) + pakem (bab 13), bicara 3–5 menit per kasus |
| 14 | Mock interview, 5 cerita STAR, pertanyaan balik |

## Tips menjawab

Tidak ada yang mengharapkan kamu tahu segalanya. Jika tidak tahu: jujur, lalu nalar. *"Saya belum pernah memakainya, tapi dari konsepnya saya duga X. Saya akan verifikasi dengan Y."*

## Sudut pandang senior

Contekan merapikan lidah, bukan mengganti pemahaman. Pertanyaan lanjutan "mengapa" akan menggugurkan hafalan tabel.

## Kesalahan umum

- Mengarang jawaban framework yang tidak pernah dipakai.
- Tidak punya pertanyaan balik.
- Tidak tidur karena cram bab 12 jam 3 pagi — lebih baik 5 cerita STAR yang bersih.
