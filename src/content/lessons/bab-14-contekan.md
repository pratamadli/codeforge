# Contekan cepat sebelum interview

Baca ini pagi-pagi sebelum masuk Zoom. Kalimat pendek, bukan pengganti bab 1–13.

## Pertanyaan cepat

| Pertanyaan | Jawaban singkat |
| --- | --- |
| State vs props? | State milik komponen dan bisa berubah. Props dari parent, read-only. |
| Kenapa key di list? | Agar React kenali item mana yang berubah/pindah. Pakai ID stabil, bukan index. |
| Kapan re-render? | State berubah, parent re-render, context berubah, props berubah referensi. |
| Hydration? | React di browser menghidupkan HTML server: tempel handler + state. |
| SSR vs SSG vs ISR? | Tiap request / saat build / build lalu diperbarui berkala. |
| Server vs Client Component? | Server: tanpa JS ke browser, akses data langsung. Client: interaktif, hooks. |
| Node single-thread? | JS satu thread. I/O oleh libuv. CPU berat: worker. Banyak core: banyak proses. |
| Microtask vs macrotask? | Microtask (Promise) dikosongkan semua dulu, baru satu macrotask per putaran. |
| Middleware Express? | Fungsi `(req, res, next)` dalam rantai request. |
| JWT vs session? | JWT stateless tapi sulit dicabut. Session mudah dicabut, butuh store. |
| PUT vs PATCH? | PUT ganti seluruh resource. PATCH sebagian. |
| Embed vs reference? | Embed: dibaca bersama, terbatas. Reference: dipakai banyak dokumen / tumbuh. |
| Percepat query Mongo? | Index ESR, explain, projection, hindari N+1 dan skip besar. |
| Cegah race? | Update atomic bersyarat, unique constraint, optimistic locking, atau transaksi. |
| Transaksi ganda? | Idempotency key + state machine + webhook idempoten. |
| Monolith vs microservices? | Mulai modular monolith. Pecah bila ada alasan skala/tim/rilis. |
| ACID? | Atomic, Consistent, Isolated, Durable. |
| Cegah invoice dobel? | Unique idempotency key + transisi status + webhook `event.id` unik. |
| Retry pembayaran? | Hanya dengan kunci yang sama; timeout → retrieve, jangan create buta. |
| Kapan transaksi Mongo? | Multi-dokumen yang harus commit bersama. Satu dok = atomic update cukup. |
| RCA produksi? | Sinyal dulu (log/trace), mitigasi (rollback/flag), baru akar + tes pencegahan. |
| Stripe webhook? | Signature, body raw, persist `event.id`, 200 cepat, kerja di worker. |
| Deploy AWS tipikal? | Image → ECR → ECS/ALB → Atlas; healthcheck; rollback ke sha sebelumnya. |

## Rencana 2 minggu

| Hari | Fokus |
| --- | --- |
| 1–2 | JavaScript (bab 1) + soal 1–7 tanpa AI |
| 3–5 | React (bab 2) soal 8–10, lalu TypeScript (bab 7) |
| 6–7 | Next.js (bab 3): rendering, Server/Client, caching, auth |
| 8–9 | Node + Express (bab 4–5): API ownership, RCA, soal 11–13, tes jalur uang (bab 8) |
| 10–11 | Mongo transaksi/duplikat (bab 6) + soal 14 + Docker/AWS/CI (bab 9) |
| 12–13 | Studi kasus + Stripe (bab 10), pakem (bab 11), bicara 3–5 menit per kasus |
| 14 | Mock JD Bookipi-style, 5 cerita STAR ownership/RCA/transaksi |

## Tips menjawab

Tidak ada yang mengharapkan kamu tahu segalanya. Jika tidak tahu: jujur, lalu nalar. *"Saya belum pernah memakainya, tapi dari konsepnya saya duga X. Saya akan verifikasi dengan Y."*

## Sudut pandang senior

Contekan ini untuk merapikan lidah, bukan untuk mengganti pemahaman. Kalau hanya menghafal tabel, pertanyaan lanjutan "mengapa" akan menggugurkan.

## Kesalahan umum

- Mengarang jawaban framework yang tidak pernah dipakai.
- Tidak punya pertanyaan balik.
- Tidak tidur karena cram bab 10 di jam 3 pagi — lebih baik 5 cerita STAR yang bersih.
