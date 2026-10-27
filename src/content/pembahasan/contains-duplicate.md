## Ide

Set tidak menerima duplikat. Saat `add` gagal (nilai sudah ada), ketemu duplikat. Bisa juga bandingkan `set.size` dengan `nums.length` di akhir — tapi cek di tengah lebih cepat berhenti.

## Analogi

Daftar tamu di pintu. Nama yang sudah ada di buku tamu tidak boleh masuk dua kali — begitu muncul nama yang sama, kamu sudah tahu ada duplikat.

## Langkah

1. `Set` kosong.
2. Untuk tiap angka, jika sudah ada di Set → `true`.
3. Jika tidak, tambahkan.
4. Habis loop → `false`.

## Kompleksitas

Waktu O(n), memori O(n). Sort lalu cek tetangga: waktu O(n log n), memori O(1) extra — trade-off yang bagus disebut di interview.

## Pitfall

Array kosong atau satu elemen → `false`, bukan error.

## Kode

```js
function containsDuplicate(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}
```
