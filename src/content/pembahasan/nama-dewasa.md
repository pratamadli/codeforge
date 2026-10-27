## Ide

Saring dulu, lalu ambil field yang diminta. Dua langkah ini sering muncul di data nyata (user, transaksi, produk).

## Analogi

Pintu klub: satpam (filter usia) lalu buku tamu hanya mencatat nama, bukan KTP lengkap.

## Langkah

1. `filter` yang `usia >= 18` (18 termasuk dewasa).
2. `map` ke `nama`.

Bisa digabung dalam satu loop `for` — sama validnya.

## Kompleksitas

Waktu O(n), memori O(k) untuk hasil.

## Pitfall

- Membandingkan `>` 18 sehingga usia 18 terbuang.
- Mengembalikan object utuh, bukan nama.
- Mengubah urutan (misalnya sort) padahal tidak diminta.

## Kode

```js
function namaDewasa(orang) {
  return orang.filter((o) => o.usia >= 18).map((o) => o.nama);
}
```
