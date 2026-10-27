## Ide

Untuk setiap angka `x`, kamu butuh pasangan `target - x`. Kalau pasangan itu sudah pernah kamu lihat, selesai. Simpan “angka → indeks” di `Map`.

Brute force dua loop juga benar untuk n kecil, tapi interviewer hampir selalu menunggu hashmap O(n).

## Analogi

Kamu bawa daftar belanja dan anggaran 9. Setiap kali lihat harga 2, kamu cek: “apakah tadi ada yang harganya 7?” Buku catatan (Map) mengingat harga yang sudah lewat beserta rak-nya (indeks).

## Langkah

1. Siapkan `Map`.
2. Loop `i` dari 0.
3. `need = target - nums[i]`.
4. Jika `need` ada di Map, return `[map.get(need), i]`.
5. Jika belum, `map.set(nums[i], i)`.

Set **sesudah** cek, supaya satu elemen tidak dipakai dua kali.

## Kompleksitas

Waktu O(n), memori O(n).

## Pitfall

- Return nilainya, bukan indeks.
- Sort array dulu lalu kehilangan indeks asli.
- `map.set` sebelum cek, sehingga `[3, 3], target 6` bisa mengambil indeks yang sama.

## Kode

```js
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) {
      return [seen.get(need), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}
```
