# Pool konkurensi

Buat `async function runPool(tasks, limit)`.

- `tasks` adalah array fungsi async (tidak menerima argumen).
- Jalankan maksimal `limit` task **bersamaan**.
- Hasil array harus berurutan sesuai indeks `tasks`, bukan urutan selesai.

`Promise.all` untuk ribuan request bisa membebani API. Pola pool ini yang dipakai untuk batch call.

Judge memeriksa nilai hasil **dan** jumlah task yang benar-benar berjalan bersamaan (`max` tidak boleh melebihi `limit`).
