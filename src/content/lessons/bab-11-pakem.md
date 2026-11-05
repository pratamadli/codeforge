# Pakem engineering FE & BE

Ini yang membedakan engineer biasa dengan senior. Jangan hafal sebagai teori: pahami alasan, siapkan **satu contoh nyata** per prinsip.

## Konsep

| Prinsip | Artinya | Contoh |
| --- | --- | --- |
| KISS | Solusi paling sederhana yang cukup | Jangan microservices untuk app 3 orang |
| DRY | Jangan ulang pengetahuan yang sama | Aturan diskon di satu fungsi. Duplikasi kecil lebih murah daripada abstraksi salah |
| YAGNI | Jangan bangun yang belum dibutuhkan | Plugin system sebelum ada kebutuhan |
| SoC | Satu tanggung jawab | UI tanpa logika bisnis |
| Composition | Susun dari bagian kecil | Komponen + custom hook |
| Fail fast | Gagal sedini mungkin | Validasi di gerbang masuk |
| Immutability | Hasil hanya dari input | Reducer Redux |

SOLID ringkas: S satu alasan berubah; O tambah perilaku tanpa ubah kode lama; L turunan bisa ganti induk; I antarmuka kecil; D bergantung pada abstraksi (repository di-inject, mudah di-mock).

### Frontend

Pisahkan server/UI state. Tangani 4 keadaan: loading, error, kosong, sukses. a11y bukan tambahan. Performa sebagai fitur. TypeScript + Zod di batas API. State sedekat pemakai. Validasi penting di server. Cegah XSS. Mobile-first. Tes: unit logika, Testing Library untuk perilaku, sedikit E2E.

### Backend

Stateless (state di DB/cache). Idempotency. Validasi setiap batas. Least privilege. Defense in depth. Timeout + retry backoff + circuit breaker. Migrasi expand/contract. Observability (log, metrik, tracing, correlation ID). 12-factor config. API backward compatible. Graceful degradation.

| Konsep | Satu kalimat |
| --- | --- |
| ACID | Atomic, Consistent, Isolated, Durable |
| Eventual consistency | Konsisten pada akhirnya, bukan seketika |
| CAP | Saat partition, pilih C atau A |
| Horizontal scaling | Tambah server; butuh service stateless |
| SLA/SLO | Target ketersediaan, mis. 99,9% |

Praktik tim: review yang membangun, commit kecil, CI/CD + canary/flag + rollback, piramida tes, ADR (catat keputusan + alternatif + alasan), jangan optimasi prematur, utang teknis dicatat dan dibayar, postmortem tanpa menyalahkan.

## Tips menjawab

Siapkan contoh: "Saya pernah menolak microservices karena tim 4 orang; kami pecah modul di dalam monolith dan deploy tetap satu." Interviewer mencari alasan, bukan poster SOLID.

## Sudut pandang senior

DRY yang berlebihan adalah abstraksi prematur. Dua salinan 5 baris yang jelas lebih baik daripada helper generik yang salah. YAGNI melindungi dari "framework internal" yang hanya dipakai satu kali.

## Kesalahan umum

- Hafal akronim tanpa contoh.
- Optimasi prematur.
- Satu lapis keamanan.
- Migrasi skema + kode dalam satu langkah berisiko.
- Menyalahkan orang di postmortem.
