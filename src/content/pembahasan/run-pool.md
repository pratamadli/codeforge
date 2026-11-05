## Ide

Jangan `Promise.all` semua task sekaligus. Jalankan `limit` worker. Tiap worker ambil indeks berikutnya, `await` task itu, simpan di `results[i]`. Karena JS satu thread, `next++` aman tanpa lock.

## Analogi

Ada 100 piring dan 4 wastafel. Empat orang mencuci; piring ke-5 baru mulai setelah salah satu selesai. Urutan rak tetap nomor asli, bukan siapa yang selesai dulu.

## Langkah

1. `results = []`, `next = 0`.
2. Worker: `while (next < tasks.length) { const i = next++; results[i] = await tasks[i](); }`
3. `Promise.all` sebanyak `min(limit, tasks.length)` worker.

## Kompleksitas

Waktu ≈ (n / limit) × durasi task jika task seragam. Memori O(n) untuk hasil.

## Produksi

Tergantung SLA pihak ketiga. Pool 4–8 untuk Stripe/pajak masuk akal; `Promise.all` 500 invoice adalah cara membuat akun di-rate-limit. Hasil berurutan penting kalau response dipasangkan ke baris UI.

## Pitfall

- `Promise.all(tasks.map(t => t()))` mengabaikan limit.
- `push` hasil sesuai urutan selesai → urutan kacau. Wajib `results[i]`.
- `limit` 0 atau array kosong.

## Kode

```js
async function runPool(tasks, limit) {
  const results = [];
  let next = 0;
  async function worker() {
    while (next < tasks.length) {
      const i = next++;
      results[i] = await tasks[i]();
    }
  }
  const n = Math.min(limit, tasks.length);
  await Promise.all(Array.from({ length: n }, worker));
  return results;
}
```
