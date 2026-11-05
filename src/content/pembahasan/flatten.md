## Ide

Rekursi: jika elemen array, flatten isinya; jika bukan, masukkan ke accumulator.

## Analogi

Buka kotak yang di dalamnya ada kotak lagi, sampai isinya barang, bukan kotak.

## Langkah

1. `reduce` dari `[]`.
2. Jika `Array.isArray(x)`, concat `flatten(x)`.
3. Jika tidak, concat `x`.

## Kompleksitas

Waktu O(n) untuk n elemen daun + node. Memori O(kedalaman) di stack.

## Pitfall

- Hanya satu tingkat (`arr.flat()` default).
- Menganggap `[]` sebagai nilai.
- Mutasi array asli.

## Kode

```js
function flatten(arr) {
  return arr.reduce((acc, x) => acc.concat(Array.isArray(x) ? flatten(x) : x), []);
}
```
