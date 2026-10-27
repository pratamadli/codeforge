# Fungsi: mesin yang menerima input

Fungsi adalah **mesin**. Kamu masukkan bahan (`parameter`), mesin bekerja, lalu keluar hasil (`return`).

```js
function kali(a, b) {
  return a * b;
}

const kaliArrow = (a, b) => a * b;
```

## Kenapa `return` penting

Tanpa `return`, fungsi mengembalikan `undefined`. Ini penyebab tes gagal yang paling sering di pemula: logika sudah benar, tapi hasilnya tidak dikembalikan.

```js
function salah(a, b) {
  a + b; // dihitung, lalu dibuang
}
```

## Function declaration vs arrow

- `function nama()` di-*hoist*: bisa dipanggil sebelum barisnya.
- Arrow function menjaga `this` dari luar — berguna di React, jarang krusial di soal LeetCode.

Untuk soal di Codexercise: **tulis satu fungsi dengan nama yang diminta**, lalu `return` hasilnya.

## Analogi

Resep masakan. Parameter = bahan. `return` = piring yang kamu sajikan. Kalau kamu masak tapi tidak menyajikan, tamu (test case) tidak dapat apa-apa.
