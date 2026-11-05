# Node.js di luar browser

Bab 4 di revisi panduan jauh lebih dalam (4.1–4.16). Pelajaran ini: **4.1–4.8** — apa itu Node, kapan dipakai, cara memakai banyak core, arsitektur V8+libuv, dan fase event loop. Modul, `fs`, npm, error, dan stream di pelajaran berikutnya.

## 4.1 Apa itu Node.js?

Node.js adalah runtime JavaScript di luar browser: mesin **V8** (eksekusi JS) + **libuv** (event loop dan I/O asinkron). JavaScript bahasanya; Node tempat menjalankannya.

## 4.2 Single-thread tapi bisa banyak pekerjaan

Kode JS berjalan di **satu thread utama**. I/O (database, jaringan, file) diserahkan ke OS atau thread pool libuv, lalu kembali lewat event loop sebagai callback/Promise. Node *concurrent* (banyak pekerjaan bergantian), bukan *parallel* untuk kode JS.

Analogi pelayan restoran: satu pelayan terima pesanan, serahkan ke dapur, layani meja lain. Jika ia memasak sendiri (CPU berat), semua meja menunggu. Ini kelanjutan langsung bab 1.1–1.4.

## 4.3 Kapan Node bagus, kapan tidak?

| Cocok | Kurang cocok |
| --- | --- |
| API, banyak I/O, WebSocket, BFF, microservice ringan | Video encoding, ML, kriptografi berat — pindahkan ke worker/service |

## 4.4 Cara memakai banyak core / thread

| Mekanisme | Bentuk | Dipakai untuk |
| --- | --- | --- |
| `worker_threads` | Thread dalam satu proses, event loop masing-masing | CPU berat tanpa memblokir thread utama |
| cluster / PM2 / replika | Beberapa proses | Semua core untuk menerima request |
| `child_process` | Proses terpisah | Menjalankan program/skrip lain |
| Message queue + worker | Service terpisah | Email, laporan, resize gambar |

```js
// main.js
const { Worker } = require("worker_threads");
const w = new Worker("./heavy.js", { workerData: 40 });
w.on("message", (r) => console.log("Hasil:", r));

// heavy.js
const { parentPort, workerData } = require("worker_threads");
const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));
parentPort.postMessage(fib(workerData));
```

Antar worker: `postMessage`. Shared memory: `SharedArrayBuffer` + `Atomics` — rumit dan rawan salah.

## 4.5 Konsep lain yang sering ditanya

- **Stream** — data per potongan (file besar, upload). Pakai `pipeline()`.
- **Buffer** — potongan data biner mentah.
- **EventEmitter** — `on` / `emit`. Event `'error'` tanpa listener menjatuhkan proses.
- **`process.nextTick` vs `setImmediate`** — nextTick sebelum microtask lain; `setImmediate` setelah fase I/O. Hindari rekursi nextTick (I/O kelaparan).
- **Graceful shutdown** — `SIGTERM` → berhenti terima request baru → selesaikan yang berjalan → tutup DB → keluar.
- **Error handling** — tangani `unhandledRejection` dan `uncaughtException` (log lalu restart). Jangan lanjutkan proses dalam keadaan tidak jelas.
- **CommonJS vs ESM** — `require` vs `import`. ESM standar modern.
- **Environment** — jangan hardcode secret. Env var / secret manager.

## 4.6 Node.js vs JavaScript di browser

| Aspek | Node | Browser |
| --- | --- | --- |
| Tempat | Server / mesin lokal | Tab browser |
| API khas | `fs`, `http`, `path`, `os`, `crypto`, `process` | DOM, BOM, `localStorage`, Web APIs |
| Global | `global` / `globalThis` | `window` / `globalThis` |
| Modul | CJS dan ESM | ESM (`<script type="module">`) |
| Akses sistem | Penuh, tidak ada sandbox | Dibatasi sandbox |
| Tujuan | Backend, CLI, skrip | UI |

`globalThis` bekerja di keduanya. Node 18+ punya `fetch` bawaan. Karena akses penuh ke sistem, keamanan rantai pasok (supply chain) penting.

## 4.7 Arsitektur Node.js

```
Kode JavaScript Anda
        |
        v
V8 Engine  ---- kompilasi + jalankan JS
        |
        v
Node.js Bindings / API (fs, http, crypto, ...)
        |
        v
libuv  ---- event loop + thread pool + I/O asinkron lintas OS
        |
        v
Sistem Operasi (jaringan, disk)
```

- **V8** — mesin Chrome; JS → kode mesin.
- **libuv** — event loop, thread pool (default **4**, `UV_THREADPOOL_SIZE`), I/O non-blocking di Windows/Linux/macOS.
- Thread pool untuk operasi tanpa API async OS: sebagian file, crypto (`pbkdf2`, `scrypt`), zlib, DNS lookup.

## 4.8 Fase event loop Node.js

Satu putaran, berurutan:

1. **Timers** — `setTimeout` / `setInterval` yang sudah jatuh tempo.
2. **Pending callbacks** — callback I/O tertunda (mis. error TCP).
3. **Idle, prepare** — internal Node.
4. **Poll** — event I/O baru (jaringan, file). Jika kosong, loop bisa menunggu di sini.
5. **Check** — `setImmediate`.
6. **Close callbacks** — `socket.on("close")`.

Di antara setiap callback: kosongkan `process.nextTick` dulu, lalu microtask Promise. Prioritas: **nextTick > Promise > fase loop**.

```js
const fs = require("fs");
fs.readFile(__filename, () => {
  setTimeout(() => console.log("timeout"), 0);
  setImmediate(() => console.log("immediate"));
});
// Di dalam callback I/O: SELALU immediate, lalu timeout.
// Dari main module, setTimeout(0) vs setImmediate tidak dijamin.

process.nextTick(() => console.log("nextTick"));
Promise.resolve().then(() => console.log("promise"));
// Urutan: nextTick, promise
```

`fs.readFileSync` di handler request memblokir **seluruh server**. Sync boleh saat startup, jangan di request.

## Tips menjawab

Emas "Node single-threaded?": *"Eksekusi JS di satu thread, I/O ditangani libuv (thread pool dan OS). CPU berat: `worker_threads` atau queue. Semua core: banyak proses (cluster/PM2/replika)."*

Klasik lain: blocking vs non-blocking, event loop, middleware, stream, `nextTick`, mengamankan, menskalakan, `require` vs `import`.

## Sudut pandang senior

Tergantung yang macet. I/O: jangan tambah thread — perbaiki blocking. CPU (PDF, resize, laporan pajak): worker atau queue, jangan di request path. Banyak proses untuk menerima HTTP di banyak core.

Di fintech: race hampir selalu di **data** (invoice), bukan antar baris JS.

## Kesalahan umum

- Fungsi sync (`readFileSync`, `bcrypt.hashSync`, `JSON.parse` besar) di handler.
- Loop berat tanpa kesempatan event loop.
- Promise reject tidak ditangani → proses crash.
- Mengira async = parallel.
