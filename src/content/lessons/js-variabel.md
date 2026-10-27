# Variabel: kotak berlabel

Bayangkan variabel seperti **kotak di rak**. Kamu menempel label (`nama`) lalu menaruh nilai di dalamnya.

Di JavaScript modern:

- `const` — isi kotak tidak diganti (referensi tetap). Pakai ini sebagai default.
- `let` — isi kotak boleh diganti.
- `var` — hindari. Aturannya membingungkan (*function scope* + *hoisting*).

```js
const nama = "Ayu";
let skor = 0;
skor = skor + 10;
```

## Yang sering salah di interview

`const` bukan berarti “objeknya membeku”. Yang tidak bisa diganti adalah **ikatan namanya**, bukan isi object/array:

```js
const user = { nama: "Ayu" };
user.nama = "Bimo"; // boleh
// user = {} // error
```

Kalau butuh object yang benar-benar tidak bisa diubah, baru pakai `Object.freeze` — itu topik terpisah.

## Analogi cepat

Kamu punya laci bernama `dompet`. `const` artinya kamu tidak mengganti lacinya dengan laci lain. Uang di dalamnya masih bisa bertambah atau berkurang kalau lacinya adalah object.
