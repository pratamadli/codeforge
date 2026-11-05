## Ide

Bungkus `fn` dengan `Map`. Kunci = representasi argumen. Jika sudah ada, kembalikan cache. Jika belum, hitung, simpan, kembalikan.

## Analogi

Lembar contekan: soal yang sama tidak dikerjakan ulang.

## Langkah

1. `const cache = new Map()`.
2. Return fungsi baru.
3. `key = JSON.stringify(args)`.
4. Jika `cache.has(key)` return isinya.
5. `result = fn(...args)`, `cache.set`, return.

## Kompleksitas

Waktu O(1) amortisasi per hit, plus biaya `fn` pada miss. Memori tumbuh mengikuti kombinasi argumen unik.

## Pitfall

- Fungsi tidak murni (waktu, random, I/O) → cache salah.
- `JSON.stringify` peka urutan key objek; fungsi tidak bisa jadi key.
- Cache tanpa batas → bocor memori. Produksi: LRU.

## Kode

```js
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
```
