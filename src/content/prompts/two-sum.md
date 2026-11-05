# Two Sum

Diberi array angka `nums` dan `target`, kembalikan indeks dua elemen yang jumlahnya tepat `target`.

- Indeks `i < j`.
- Tiap elemen dipakai paling banyak sekali.
- Jika tidak ada pasangan, kembalikan `null`.

Dua loop bersarang = O(n²). Dengan `Map` (nilai → indeks) cukup O(n) waktu dan O(n) memori. Selalu sebutkan trade-off waktu vs memori.
