# LRU Cache

Kelas `LRUCache` dengan kapasitas tetap. Saat penuh, buang item yang **paling lama tidak dipakai**. `get` dan `set` harus **O(1)**.

- `get(key)` → nilai, atau `undefined` jika tidak ada. `get` menghitung sebagai "baru dipakai".
- `set(key, val)` menambah atau memperbarui, lalu menandai sebagai terbaru. Jika `size > capacity`, buang yang tertua.

`Map` mengingat urutan penyisipan: key pertama = paling lama tidak dipakai. Trik: `delete` lalu `set` lagi untuk memindahkan ke posisi terbaru.

Judge memanggil rangkaian operasi `["set", k, v]` / `["get", k]` dan memeriksa hasil `get` (`null` jika miss, karena JSON tidak punya `undefined`).
