## Ide

Diskon 10% artinya kamu membayar 90% dari harga. Jadi kalikan dengan `(1 - persen/100)`, bukan mengurangkan `persen` mentah-mentah.

## Analogi

Kaos Rp100.000 diskon 10%: label baru Rp90.000. Kalau kamu tulis `100 - 10` dapat 90 — kebetulan benar hanya karena harga 100. Untuk harga 80, `80 - 25` salah; yang benar 75% dari 80 = 60.

## Langkah

1. Ubah persen jadi pecahan: `persen / 100`.
2. Sisa yang dibayar: `1 - pecahan`.
3. Kalikan dengan harga.

## Kompleksitas

O(1).

## Pitfall

- `harga - persen` hanya kebetulan lolos tes sampel 100.
- Membagi `persen` dua kali.
- Membulatkan terlalu awal.

## Kode

```ts
function hitungDiskon(harga: number, persen: number): number {
  return harga * (1 - persen / 100);
}
```
