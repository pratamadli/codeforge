# Kompleksitas waktu (Big O)

Interview bukan hanya “kode benar”, tapi “apakah lolos kalau datanya 10⁵ elemen?”

Big O menggambarkan **bagaimana waktu tumbuh** saat input membesar. Kita lihat kasus terburuk yang masih wajar.

| Pola | Contoh | Kira-kira |
| --- | --- | --- |
| O(1) | akses `arr[i]`, `map.get` | konstan |
| O(n) | satu loop | linear |
| O(n log n) | `sort` | sort |
| O(n²) | loop di dalam loop | bahaya di n besar |

## Analogi

Mencari nama di buku telepon.

- O(n): baca dari halaman 1 sampai ketemu.
- O(log n): buka tengah, buang setengah, ulang (binary search).
- O(1): kamu sudah punya indeks “halaman 412”.

Hashmap (`Map` / object) adalah “indeks buku telepon”: *trade-off* memakai memori supaya pencarian cepat.

## Kalimat yang aman di interview

“Solusi brute force O(n²). Saya simpan yang sudah dilihat di Map supaya tiap elemen diproses sekali: waktu O(n), ruang O(n).”
