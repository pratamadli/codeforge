## Ide

Tidak ada trik. Fungsi adalah mesin: dua input, satu output.

## Analogi

Kalkulator saku. Tombol `+` tidak berguna kalau hasilnya tidak muncul di layar — itu peran `return`.

## Langkah

1. Terima `a` dan `b`.
2. Kembalikan `a + b`.

## Kompleksitas

Waktu O(1), memori O(1).

## Pitfall

Lupa `return` → tes melihat `undefined`.

## Kode

```js
function jumlahDuaAngka(a, b) {
  return a + b;
}
```
