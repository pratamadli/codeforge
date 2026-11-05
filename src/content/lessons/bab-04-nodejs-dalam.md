# Modul, fs, error, dan stream Node

Lanjutan bab 4: **4.9–4.16**. Ini yang sering jadi pertanyaan follow-up setelah "Node single-thread".

## 4.9 Sistem modul

| Jenis | Contoh |
| --- | --- |
| Built-in | `fs`, `http`, `path`, `os`, `url`, `events`, `crypto`, `stream`, `util`, `child_process`, `worker_threads` |
| Buatan sendiri | `module.exports` (CJS) atau `export` (ESM) |
| Pihak ketiga | npm → `node_modules` |

```js
// CommonJS
exports.add = (a, b) => a + b;
const math = require("./math");
console.log(math.add(2, 3)); // 5

// ESM  (package.json: "type": "module")
export const add = (a, b) => a + b;
import { add } from "./math.js"; // ekstensi .js wajib di ESM
```

- `require` hanya mengeksekusi file sekali (`require.cache`) — berguna untuk singleton koneksi DB.
- Circular dependency (A butuh B, B butuh A) menghasilkan export yang belum lengkap. Pisahkan modul.
- CJS: sinkron, dinamis. ESM: analisis statis (tree-shaking), top-level `await`, tidak punya `__dirname` (pakai `import.meta.dirname` atau `fileURLToPath(import.meta.url)`).

## 4.10 Callback, Promise, async/await

```js
fs.readFile("a.txt", "utf8", (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});

fs.promises.readFile("a.txt", "utf8").then(console.log).catch(console.error);

async function read() {
  try {
    const data = await fs.promises.readFile("a.txt", "utf8");
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

`util.promisify` mengubah callback menjadi Promise. `async function` selalu mengembalikan Promise; error di dalamnya = reject.

Kesalahan klasik: `await` berurutan padahal tidak bergantung (`Promise.all`); `array.forEach(async ...)` tidak menunggu.

## 4.11 Modul fs dan path

```js
const fs = require("fs/promises");
const path = require("path");
const file = path.join(__dirname, "data", "users.json");
const text = await fs.readFile(file, "utf8");
await fs.writeFile(file, JSON.stringify(data, null, 2));
await fs.mkdir(path.dirname(file), { recursive: true });
```

Operasi umum: `readFile`, `writeFile`, `appendFile`, `unlink`, `mkdir`, `readdir`, `stat`, `access`.

- Sync memblokir event loop. Boleh saat startup (config), jangan di handler.
- File besar: `createReadStream`, bukan `readFile`.
- Path traversal: input `../../etc/passwd` → `path.resolve` dan pastikan tetap di folder yang diizinkan.
- Pakai `path.join` / `path.resolve`, jangan menyambung `/` manual.

## 4.12 Modul process dan os

| API | Fungsi |
| --- | --- |
| `process.env` | Env var. Nilainya **selalu string**. |
| `process.argv` | Argumen command line. |
| `process.cwd()` | Direktori kerja (beda dengan `__dirname`, lokasi file). |
| `process.exit(code)` | 0 = sukses. Hindari di tengah proses tanpa cleanup. |
| `process.on("SIGTERM", fn)` | Graceful shutdown. |
| `process.memoryUsage()` / `uptime()` | Memori dan lama hidup. |
| `os.cpus().length` / `os.availableParallelism()` | Jumlah core — berguna untuk cluster. |
| `os.platform()`, `totalmem()`, `freemem()` | Info OS. |

## 4.13 package.json dan npm

| Bagian | Penjelasan |
| --- | --- |
| `dependencies` | Dibutuhkan saat aplikasi berjalan (express, mongoose). |
| `devDependencies` | Hanya pengembangan (jest, eslint, typescript). |
| `peerDependencies` | Harus disediakan pemakai library (react). |
| `scripts` | `npm run dev`, `npm test`, `npm start`. |
| `main` / `exports` / `type` | Titik masuk dan jenis modul. |
| `engines` | Versi Node yang didukung. |
| Semver `^1.2.3` | Minor+patch (`>=1.2.3 <2`). `~1.2.3` hanya patch. |
| `package-lock.json` | Kunci versi persis. **Wajib di-commit.** |
| `npm install` vs `npm ci` | `install` bisa ubah lockfile. `ci` persis sesuai lock, untuk CI/CD. |
| `npx` | Jalankan paket tanpa pasang global. |
| `npm audit` | Cek kerentanan. |

Setiap `npm install` membawa puluhan dependensi dengan akses penuh ke server. Commit lockfile, `npm ci` di CI, `npm audit`, hindari paket kecil yang tidak jelas pemeliharanya, tunda versi yang baru dirilis beberapa hari. Fungsi kecil sering lebih aman ditulis sendiri.

## 4.14 Error handling di Node

- **Operational error** — input salah, DB down, timeout. Tangani, beri respons sesuai.
- **Programmer error** — bug. Jangan ditutupi. Log, perbaiki.
- Callback: error-first `(err, data)`. Async: `try/catch` atau `.catch()`.
- EventEmitter `'error'` tanpa listener = proses jatuh.
- Level proses: `unhandledRejection` / `uncaughtException` → log, keluar rapi, process manager restart.

```js
class AppError extends Error {
  constructor(message, status = 500, code = "INTERNAL") {
    super(message);
    this.status = status;
    this.code = code;
    this.isOperational = true;
  }
}

if (!order) throw new AppError("Order tidak ditemukan", 404, "ORDER_NOT_FOUND");

app.use((err, req, res, next) => {
  const status = err.isOperational ? err.status : 500;
  if (!err.isOperational) console.error(err.stack);
  res.status(status).json({
    code: err.code || "INTERNAL",
    message: err.isOperational ? err.message : "Internal Server Error",
  });
});
```

Jangan bocorkan stack ke client.

## 4.15 Stream, lebih lengkap

Empat jenis: **Readable**, **Writable**, **Duplex** (keduanya, mis. socket), **Transform** (gzip).

**Backpressure:** penulis lebih lambat dari pembaca → data menumpuk. `write()` mengembalikan `false` → tunggu `'drain'`. `pipeline()` menangani ini otomatis.

```js
const { pipeline } = require("stream/promises");
const zlib = require("zlib");
await pipeline(
  fs.createReadStream("big.log"),
  zlib.createGzip(),
  fs.createWriteStream("big.log.gz"),
);
```

## 4.16 Pertanyaan yang paling sering muncul

| Pertanyaan | Jawaban singkat |
| --- | --- |
| Apa itu Node dan mengapa dipakai? | Runtime JS di atas V8, I/O non-blocking. Cocok API I/O-heavy, banyak koneksi. |
| Beda Node dan JavaScript? | JS bahasa. Node runtime di luar browser + API server. |
| Blocking vs non-blocking? | Blocking menahan thread. Non-blocking menyerahkan, hasil lewat callback/Promise. |
| Event loop? | Ambil callback dari antrean saat stack kosong. |
| Middleware? | `(req, res, next)` dalam rantai request. |
| Menangani error? | try/catch, `next(err)`, bedakan operational vs programmer, tangani `unhandledRejection`. |
| Stream? | Data per potongan: Readable, Writable, Duplex, Transform. |
| `process.nextTick()`? | Tepat setelah operasi saat ini, sebelum microtask Promise dan fase loop berikutnya. |
| Mengamankan Node? | Validasi, hash password, rate limit, Helmet, CORS ketat, secret di env, HTTPS, `npm audit`, jangan bocor detail error. |
| Menskalakan? | Horizontal di belakang load balancer (stateless). Cluster/PM2, Redis, queue, worker CPU. |
| Cluster? | Beberapa proses Node (satu per core) berbagi port. |
| dependencies vs devDependencies? | Runtime vs hanya development/build. |
| `require` vs `import`? | CJS sinkron/dinamis vs ESM statis + top-level await. |
| package.json vs lockfile? | Metadata + rentang versi vs versi persis. |

## Tips menjawab

Jawaban emas tetap sama seperti 4.1–4.8, lalu siap follow-up: nextTick, stream backpressure, `npm ci`, AppError terpusat.

## Sudut pandang senior

Supply chain adalah risiko produksi, bukan trivia npm. Trade-off: paket mempercepat development, menambah permukaan serangan. Untuk fungsi 15 baris, tulis sendiri.

Bedakan operational vs programmer error. Senior tidak `try/catch` kosong lalu lanjut seolah sehat.

## Kesalahan umum

- `readFileSync` / `hashSync` di handler.
- `forEach(async ...)`.
- Hardcode secret.
- `process.exit` di tengah request tanpa cleanup.
- Stream tanpa `pipeline` — error dan backpressure terlewat.
- Bocorkan `err.stack` ke client.
