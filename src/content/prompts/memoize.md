# Memoize

Buat `memoize(fn)` yang mengembalikan fungsi baru. Hasil `fn` disimpan berdasarkan argumen. Panggilan dengan argumen sama tidak menghitung ulang.

Judge mengetes dengan fungsi kuadrat `(x) => x * x` dan menghitung berapa kali fungsi asli dijalankan.

```
memoizeRun([2, 2, 3]) → { values: [4, 4, 9], computes: 2 }
```

Poin: hanya cocok untuk fungsi murni. `JSON.stringify` sebagai key punya batas (fungsi, urutan key objek). Cache tanpa batas bisa membocorkan memori — di produksi pakai LRU.
