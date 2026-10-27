# Promise dan async/await

JavaScript satu thread. Kerja lambat (jaringan, timer) tidak boleh membekukan halaman. Makanya ada **Promise**: janji yang akan *selesai* (`fulfilled`) atau *gagal* (`rejected`) nanti.

```js
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  await delay(100);
  return "siap";
}
```

## Analogi

Kamu pesan kopi. `fetch` / Promise = nomor antrian. `await` = kamu duduk menunggu nomor dipanggil, tanpa mengunci seluruh kafe (event loop tetap jalan).

## Yang ditanya di interview

- `async` function selalu mengembalikan Promise.
- `await` hanya di dalam `async` (kecuali top-level module).
- `Promise.all` menjalankan beberapa janji **paralel**. `await` berurutan = lebih lambat kalau tugasnya independen.
- `try/catch` di `async` menangkap Promise yang reject.

Soal v1 Codexercise masih sinkron (satu fungsi, input → output). Tapi di Node, Express, dan Next.js, async adalah roti sehari-hari.
