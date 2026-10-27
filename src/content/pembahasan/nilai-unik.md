## Ide

Set secara alami membuang duplikat. Setelah itu urutkan. Atau: sort dulu, lalu jalan sekali untuk menumpuk nilai yang berubah.

## Analogi

Daftar absen yang ketik nama dua kali. Kamu tidak butuh dua baris “Ayu”; kamu butuh satu, lalu urut abjad supaya mudah dicari.

## Langkah

1. Masukkan ke `Set` untuk unik.
2. Ubah kembali ke array.
3. `sort` dengan comparator angka `(a, b) => a - b` — jangan `sort()` default (itu urut string: `10` sebelum `2`).

## Kompleksitas

Waktu O(n log n) karena sort. Memori O(n).

## Pitfall

`[10, 2].sort()` jadi `[10, 2]` atau `[2, 10]` tergantung string. Selalu comparator numerik.

## Kode

```ts
function nilaiUnik(angka: number[]): number[] {
  return [...new Set(angka)].sort((a, b) => a - b);
}
```
