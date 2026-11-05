## Ide

Satu kali `reduce`. Kunci = `keyFn(item)`. Jika kelompok belum ada, buat array. `push` item.

## Analogi

Kotak surat: tiap surat masuk ke laci sesuai kode pos, urutan di dalam laci = urutan datang.

## Langkah

1. Mulai `{}`.
2. `k = keyFn(x)`.
3. `(acc[k] ||= []).push(x)`.
4. Return `acc`.

## Kompleksitas

Waktu O(n). Memori O(n).

## Pitfall

- Menimpa array, bukan `push`.
- Mengubah urutan di dalam kelompok.
- `keyFn` yang return object (jadi kunci `"[object Object]"`).

## Kode

```js
function groupBy(arr, keyFn) {
  return arr.reduce((acc, x) => {
    const k = keyFn(x);
    (acc[k] ||= []).push(x);
    return acc;
  }, {});
}
```
