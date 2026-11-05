# Debounce

Buat `debounce(fn, delay)` yang hanya menjalankan `fn` setelah **tidak dipanggil** selama `delay` milidetik.

- Tiap panggilan baru membatalkan timer lama.
- Saat timer selesai, panggil `fn` dengan argumen **panggilan terakhir**.
- Closure menyimpan timer.

Judge mengetes fungsimu dengan rangkaian `{ t, v }` (waktu ms dan nilai). Yang dinilai: nilai yang benar-benar dijalankan, berurutan.

Bedanya dengan throttle: throttle membatasi frekuensi (maksimal sekali per interval). Debounce menunggu jeda.
