# Node.js di luar browser

## 4.1 Apa itu Node.js? (dari nol)

Dulu JavaScript hanya bisa berjalan di dalam browser, karena hanya browser yang punya mesin untuk membacanya. Lalu mesin pembaca JavaScript milik Chrome (**V8**) dipisahkan dari browser dan dipakai sendiri. Hasilnya **Node.js**: program yang menjalankan JavaScript langsung di komputer atau server, tanpa browser.

Rumus mudah: **Node.js = V8 + libuv + library bawaan**.

- **V8** — membaca dan menjalankan kode JavaScript.
- **libuv** — mengurus pekerjaan yang butuh menunggu (jaringan, file, timer) dan mengatur event loop.
- **Library bawaan** — `fs`, `http`, `path`, `crypto`, dan lainnya. Ini kemampuan yang tidak dimiliki JavaScript di browser.

| Node.js itu… | Penjelasan |
| --- | --- |
| Bukan bahasa | Bahasanya tetap JavaScript. Node adalah tempat menjalankannya (runtime). |
| Bukan framework | Express, NestJS, dan Fastify adalah framework yang berjalan **di atas** Node. |
| Runtime | Lingkungan yang menyediakan mesin (V8) dan kemampuan sistem (file, jaringan) agar JavaScript bisa berjalan di luar browser. |

Mengapa banyak dipakai? Satu bahasa untuk frontend dan backend, sangat baik untuk aplikasi yang banyak menunggu (API, database, realtime), ekosistem npm yang besar, dan pengembangan cepat.

## 4.2 Cara kerja: perjalanan kode dari file sampai berjalan

Kita ikuti apa yang terjadi saat kamu menjalankan `node app.js`. Analogi sama seperti peta istilah: **proses = kantor**, **thread = karyawan**, **kode = daftar tugas**.

1. File `app.js` hanyalah teks. CPU tidak bisa membaca teks.
2. Kamu menjalankan `node app.js`. Sistem operasi membuat sebuah **proses** (kantor) dan memberinya memori.
3. Node menyala dan menyiapkan V8, libuv, dan modul bawaan. Di dalam proses ada **thread utama** (karyawan utama) dan beberapa thread bantu internal.
4. Node menyerahkan isi `app.js` ke V8.
5. V8 membaca teks: parsing → bytecode → eksekusi. Bagian yang sering dipakai dioptimasi jadi kode mesin (**JIT**).
6. Thread utama mengeksekusi kode baris demi baris (di dalam *call stack*).
7. Saat bertemu pekerjaan yang harus menunggu (baca file, query DB, HTTP, timer), thread utama **tidak ikut menunggu**. Pekerjaan dititipkan ke libuv dan OS, lalu thread utama lanjut ke baris berikutnya.
8. Setelah pekerjaan titipan selesai, callback-nya masuk antrean.
9. Event loop menunggu sampai thread utama kosong, lalu memanggil callback itu satu per satu.
10. Jika tidak ada lagi pekerjaan tertunda, proses selesai. Server HTTP tetap hidup karena terus "mendengarkan" koneksi baru.

```
app.js (teks)
    |
    v
V8: baca → bytecode → eksekusi di THREAD UTAMA
    |
    | ketemu operasi menunggu (file / DB / HTTP / timer)
    v
libuv + OS mengerjakannya DI LUAR thread utama
    |
    | selesai → callback masuk antrean
    v
EVENT LOOP: "thread utama kosong?" → panggil callback
```

```js
const fs = require("fs");
console.log("1. mulai");
fs.readFile("data.txt", "utf8", (err, text) => {
  console.log("3. file terbaca:", text.length, "karakter");
});
console.log("2. lanjut, tidak menunggu file");
// Output: 1, 2, lalu 3
```

Urutannya 1, 2, 3 karena `readFile` dititipkan ke libuv. Thread utama langsung mencetak `"2"`, dan callback baru dipanggil setelah file selesai dibaca.

### Jadi, mengapa disebut single-thread?

Karena **kode JavaScript kamu** dijalankan oleh satu thread utama. Di balik layar Node memakai thread lain (thread pool libuv, thread bantu V8) yang **tidak** menjalankan kode JS kamu.

| Bagian | Berapa thread? | Mengerjakan apa? |
| --- | --- | --- |
| Kode JavaScript kamu | 1 (thread utama) | Fungsi dan logika kamu |
| Thread pool libuv | Default 4 | File, hash/crypto, kompresi, DNS |
| Sistem operasi | — | Jaringan secara non-blocking |

Node itu **concurrent** (banyak pekerjaan bergantian, menunggu di luar), tetapi kode JS kamu **tidak parallel**. Satu fungsi lama di thread utama memblokir semuanya.

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

## 4.7 Arsitektur Node.js: lapisan dan tugas masing-masing

Bayangkan Node sebagai tumpukan lapisan. Kamu hanya menulis lapisan paling atas.

```
+----------------------------------------------+
| 1. KODE ANDA (JavaScript)                    |
|    Express, route, logika bisnis             |
+----------------------------------------------+
| 2. CORE MODULES NODE (ditulis dalam JS)      |
|    fs, http, path, stream, events, crypto    |
+----------------------------------------------+
| 3. NODE BINDINGS (C++)                       |
|    jembatan antara JS dan kode C/C++         |
+---------------------+------------------------+
| 4a. V8              | 4b. libuv              |
|  menjalankan JS,    |  event loop,           |
|  mengelola memori   |  thread pool,          |
|  (garbage collector)|  I/O asinkron          |
+---------------------+------------------------+
| 5. SISTEM OPERASI (jaringan, disk, CPU)      |
+----------------------------------------------+
```

| Lapisan | Tugasnya |
| --- | --- |
| Kode kamu | Logika aplikasi. Kamu memanggil `fs.readFile` atau `app.get`. |
| Core modules | Fitur siap pakai (file, HTTP, stream) yang bisa di-`require`. |
| Bindings | Penerjemah: panggilan JavaScript → kode C/C++ yang cepat. |
| V8 | "Otak" yang menjalankan JavaScript dan membersihkan memori. |
| libuv | "Manajer pekerjaan menunggu": event loop, thread pool, I/O non-blocking di Windows/Linux/macOS. |
| Sistem operasi | Yang sebenarnya mengurus kartu jaringan, disk, dan CPU. |

### Contoh: satu request HTTP masuk ke API Express

1. Browser mengirim request. OS menerimanya di socket jaringan.
2. libuv tahu ada data masuk (non-blocking milik OS).
3. Event loop memanggil callback Node, lalu handler Express berjalan di **thread utama**.
4. Handler memanggil `db.find(...)` (async). Permintaan dikirim ke database; thread utama **tidak menunggu**, jadi ia bebas melayani request lain.
5. Balasan database tiba, callback masuk antrean, event loop memanggilnya di thread utama.
6. Handler memanggil `res.json(...)` dan respons dikirim ke client.

Satu thread utama bisa melayani ribuan koneksi karena sebagian besar waktu request dihabiskan **menunggu** (database, jaringan). Selama menunggu, thread utama dipakai request lain. Thread utama hanya sibuk saat ada kode yang benar-benar dijalankan.

### Thread pool libuv: dipakai untuk apa?

| Jenis operasi | Ditangani oleh |
| --- | --- |
| Jaringan (HTTP, koneksi DB, WebSocket) | Langsung oleh OS (non-blocking), **bukan** thread pool |
| File system, hashing/crypto (bcrypt), kompresi, DNS lookup | Thread pool libuv (default **4**) |
| Kode JavaScript kamu | Thread utama (kecuali kamu membuat worker) |

Konsekuensi: banyak hash bcrypt bersamaan → hanya 4 yang diproses sekaligus, sisanya antre, API terasa lambat. Solusi: atur `UV_THREADPOOL_SIZE`, atau pindahkan kerja berat ke service/queue.

### Thread per request vs event-driven

| | Thread per request (PHP-FPM, Java klasik) | Event-driven (Node.js) |
| --- | --- | --- |
| Cara kerja | Tiap request satu thread yang menunggu sampai selesai | Satu thread utama melayani semua request; menunggu dititipkan ke luar |
| Kelebihan | Kode blocking mudah, CPU berat tidak menghambat request lain | Hemat memori untuk banyak koneksi; cocok I/O-heavy dan realtime |
| Kekurangan | Boros memori jika koneksi sangat banyak | Kode CPU berat atau blocking menghambat **semua** request |

Menaruh hitungan besar, `readFileSync`, atau `JSON.parse` raksasa di handler menahan thread utama — semua pengguna ikut menunggu.

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

Tergantung yang macet. I/O: jangan tambah thread — perbaiki blocking. CPU (PDF, resize, laporan pajak, bcrypt massal): worker, queue, atau naikkan `UV_THREADPOOL_SIZE` — jangan di request path. Banyak proses untuk menerima HTTP di banyak core.

Di fintech: race hampir selalu di **data** (invoice), bukan antar baris JS. Model event-driven hemat memori; model thread-per-request lebih maaf pada kode blocking. Pilih sadar.

## Kesalahan umum

- Fungsi sync (`readFileSync`, `bcrypt.hashSync`, `JSON.parse` besar) di handler.
- Loop berat tanpa kesempatan event loop.
- Promise reject tidak ditangani → proses crash.
- Mengira async = parallel.
