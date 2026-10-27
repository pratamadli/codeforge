# Array dan object

Dua struktur yang akan kamu pakai terus:

- **Array** — daftar berurutan. Indeks mulai dari `0`.
- **Object** — kamus: kunci → nilai.

```js
const angka = [10, 20, 30];
angka.push(40);

const user = { nama: "Ayu", usia: 22 };
user.kota = "Bandung";
```

## Method yang sering dipakai di soal

- `map` — ubah setiap elemen jadi nilai baru
- `filter` — ambil yang lolos syarat
- `reduce` — kumpulkan jadi satu nilai
- `find` — ambil elemen pertama yang cocok

```js
const dewasa = orang.filter((o) => o.usia >= 18).map((o) => o.nama);
```

## Pitfall

- `filter` **tidak mengubah** array asli; dia mengembalikan array baru.
- Membandingkan object dengan `===` membandingkan referensi, bukan isi. Untuk tes, kita bandingkan nilai hasil fungsi (angka, string, array, object polos) secara mendalam.

## Analogi

Array = antrian tiket. Object = formulir: kolom `nama`, `usia`, `kota`.
