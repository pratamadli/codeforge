## Ide

Untuk setiap angka `x`, kamu butuh pasangan `target - x`. Kalau pasangan itu sudah pernah dilihat, selesai. Simpan “nilai → indeks” di `Map`.

## Analogi

Daftar belanja dan anggaran 9. Lihat harga 2: “apakah tadi ada yang 7?” Buku catatan (Map) mengingat harga yang sudah lewat beserta raknya (indeks).

## Langkah

1. Siapkan `Map`.
2. Loop `i` dari 0.
3. `need = target - nums[i]`.
4. Jika `need` ada, return `[map.get(need), i]`.
5. Baru `map.set(nums[i], i)`.

Set **sesudah** cek, supaya satu elemen tidak dipakai dua kali.

## Kompleksitas

Waktu O(n), memori O(n). Brute force dua loop O(n²) benar untuk n kecil, tetapi interviewer menunggu hashmap.

## Produksi

Pewawancara senior jarang peduli Two Sum itu sendiri. Mereka melihat apakah kamu menolak O(n²) tanpa alasan, dan bisa sebut trade-off memori. Analoginya di API: lookup `Map` / index, bukan scan collection.

## Pitfall

- Return nilainya, bukan indeks.
- Sort dulu lalu kehilangan indeks asli.
- `map.set` sebelum cek: `[3, 3], target 6` bisa memakai indeks yang sama.

## Kode

```js
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return null;
}
```
