# Dasar web, Redis, Docker, CI/CD

Ini bab "lem perekat": HTTP, browser, cache, Redis, container, dan cara rilis tanpa drama.

## Konsep

Saat mengetik URL: DNS → TCP+TLS → HTTP request → HTML → parse → unduh CSS/JS → DOM+CSSOM → render → JS (hydration jika SSR).

| Topik | Inti |
| --- | --- |
| CORS | Browser membatasi origin A memanggil API origin B. Server izinkan lewat header. **Bukan** keamanan server, hanya perlindungan di browser. Preflight OPTIONS untuk request non-sederhana. |
| Cookie vs localStorage | Cookie bisa HttpOnly dan terkirim otomatis. localStorage hanya JS (rentan XSS), tidak terkirim sendiri. |
| HTTP cache | `Cache-Control: max-age` untuk aset berfingerprint. ETag → 304. `no-store` untuk data sensitif. |
| XSS vs CSRF | XSS: skrip disuntik. Escape + CSP. CSRF: situs lain memicu request dengan cookie kamu. SameSite + token CSRF. |
| Reverse proxy | TLS, load balancing, kompresi, cache, rate limit di depan app. |

### Redis

In-memory, pelengkap DB — bukan pengganti. Cache-aside + TTL, session, rate limit (`INCR` + `EXPIRE`), queue (BullMQ), pub/sub, lock (`SET NX PX`), leaderboard (sorted set).

Jangan `KEYS *` (blokir thread). Pakai `SCAN`. Cache murni boleh hilang; data penting jangan hanya di Redis.

### Docker

Image = cetak biru. Container = image yang berjalan. Layer cache: yang jarang berubah dulu (`npm ci`) baru kode. Multi-stage: build lalu salin artefak ke image kecil. User non-root, `.dockerignore`, secret jangan di image.

### CI/CD

CI: tiap push → lint, tes, build. CD: rilis staging/produksi.

| Strategi | Cara | Trade-off |
| --- | --- | --- |
| Rolling | Ganti instance sedikit demi sedikit | Sederhana; dua versi hidup sementara |
| Blue-green | Alihkan trafik sekaligus | Rollback instan; biaya ganda |
| Canary | Sebagian pengguna dulu | Perlu monitoring |
| Feature flag | Deploy ≠ rilis fitur | Flag lama harus dibersihkan |

Pipeline tipikal: install → lint → typecheck → unit → build → integration → staging → E2E → produksi. Siapkan rollback. Jangan deploy besar Jumat sore. Jalur AWS/ECS, secret, dan migrasi expand/contract di pelajaran **Docker, AWS, CI/CD di produksi**.

## Tips menjawab

Klasik: "Apa CORS?", "Cookie vs localStorage?", "Redis untuk apa?", "Image vs container?", "Deploy tanpa downtime?", "Apa yang terjadi saat mengetik URL?"

## Sudut pandang senior

CORS sering disalahpahami sebagai "firewall API". API tanpa CORS tetap bisa dipanggil dari Postman/server. Keamanan API = auth, validasi, rate limit — bukan header CORS.

Redis lock kelihatan elegan, tetapi punya kasus tepi (lock kedaluwarsa). Untuk stok, lebih suka constraint/update atomic di database.

## Kesalahan umum

- Menyimpan token di localStorage lalu heran kena XSS.
- Secret di Dockerfile / image.
- Mengandalkan Redis sebagai sumber kebenaran saldo.
- Feature flag menumpuk tanpa dibersihkan.
- Deploy tanpa rencana rollback.
