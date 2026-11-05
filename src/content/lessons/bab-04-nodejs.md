# Node.js di luar browser

Node.js adalah runtime JavaScript di luar browser: mesin **V8** (eksekusi JS) + **libuv** (event loop dan I/O asinkron). JavaScript bahasanya; Node tempat menjalankannya.

## Konsep

Kode JS berjalan di **satu thread utama**. I/O (database, jaringan, file) diserahkan ke OS atau thread pool libuv, lalu kembali lewat event loop. Node *concurrent* (banyak pekerjaan bergantian), bukan *parallel* untuk kode JS.

Analogi pelayan restoran: satu pelayan terima pesanan, serahkan ke dapur, layani meja lain. Jika ia memasak sendiri (CPU berat), semua meja menunggu.

| Cocok | Kurang cocok |
| --- | --- |
| API, banyak I/O, WebSocket, BFF, microservice ringan | Video encoding, ML, kriptografi berat — pindahkan ke worker/service |

Cara memakai banyak core: `worker_threads` (CPU tanpa memblokir), cluster/PM2/replika (banyak proses), `child_process`, message queue + worker service.

Fase event loop: timers → pending callbacks → poll → check (`setImmediate`) → close. Di antara callback: `process.nextTick` dulu, lalu microtask Promise. Prioritas: **nextTick > Promise > fase loop**.

Di dalam callback I/O, `setImmediate` selalu sebelum `setTimeout(0)`. Dari main module, urutannya tidak dijamin.

Konsep lain: stream + `pipeline()`, Buffer, EventEmitter, graceful shutdown (`SIGTERM`), `unhandledRejection`, CJS vs ESM, env var untuk secret.

| Aspek | Node | Browser |
| --- | --- | --- |
| API khas | `fs`, `http`, `path`, `crypto` | DOM, `localStorage`, Web APIs |
| Global | `global` / `globalThis` | `window` / `globalThis` |
| Akses sistem | Penuh | Sandbox |

`fs.readFileSync` di handler request memblokir **seluruh server**. Sync boleh saat startup, jangan di request.

Path traversal: input `../../etc/passwd` harus dinormalisasi `path.resolve` dan tetap di folder yang diizinkan.

## Tips menjawab

Emas untuk "Node single-threaded?": *"Eksekusi JS di satu thread, I/O ditangani libuv. CPU berat saya pakai `worker_threads` atau queue. Semua core: banyak proses (cluster/PM2/replika)."*

Klasik lain: blocking vs non-blocking, middleware, stream, `nextTick`, cara mengamankan, cara menskalakan, `require` vs `import`, `dependencies` vs `devDependencies`.

## Sudut pandang senior

Setiap `npm install` membawa puluhan dependensi dengan akses penuh ke server. Commit lockfile, `npm ci` di CI, `npm audit`, hindari paket kecil yang tidak jelas pemeliharanya. Fungsi kecil sering lebih aman ditulis sendiri.

Bedakan *operational error* (DB down, input salah — tangani) vs *programmer error* (bug — log, restart, perbaiki). Jangan bocorkan stack trace ke client.

## Kesalahan umum

- Fungsi sync (`readFileSync`, `bcrypt.hashSync`) di dalam handler.
- Loop berat tanpa kesempatan event loop.
- Promise reject tidak ditangani → proses crash.
- `forEach(async ...)` yang tidak di-await.
- EventEmitter `'error'` tanpa listener menjatuhkan proses.
- Hardcode secret.
