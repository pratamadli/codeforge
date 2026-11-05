# Strategi menjawab interview

Yang dinilai bukan hafalan, melainkan alasan di balik keputusan.

## Konsep

### Rumus pertanyaan konsep (4 langkah)

1. Definisi satu kalimat.
2. Mengapa penting / masalah yang diselesaikan.
3. Contoh nyata dari proyek kamu.
4. Trade-off atau jebakan.

Contoh "kapan `useMemo`?": *"Menyimpan hasil hitungan agar tidak diulang tiap render. Saya pakai saat terbukti mahal atau butuh referensi stabil. Tidak di mana-mana — memo punya biaya. Saya ukur dulu dengan Profiler."*

### Rumus desain sistem

1. Klarifikasi fitur inti, pengguna, pola baca/tulis, yang tidak boleh gagal.
2. Gambaran besar: client, API, DB, cache, queue.
3. Model data + API fitur inti.
4. Bagian tersulit (konkurensi, konsistensi, skala).
5. Dua opsi + alasan.
6. Kegagalan dan pemantauan.

### STAR (perilaku)

Situation, Task, Action (**saya**, bukan "kami"), Result terukur. Siapkan 5 cerita: masalah teknis tersulit, insiden produksi, perbedaan pendapat, keputusan trade-off, peningkatan dengan angka (mis. load turun 40%).

### Live coding

Pahami soal, ulangi dengan kata sendiri, tanya kasus tepi. Ucapkan proses berpikir. Mulai dari solusi yang berjalan, lalu perbaiki. Nama jelas, fungsi kecil, uji contoh sendiri.

Latihan React: search debounce + abort, form uang dengan validasi server. Node: API idempoten, rate limiter, upload. Siapkan juga cerita produksi — lihat pelajaran **Latihan bicara interview MERN** di modul ini.

### Yang membedakan senior

| Menengah | Senior |
| --- | --- |
| "Pakai Redux untuk state global." | "Pisahkan server/client state. Redux hanya jika perlu." |
| "Tambah cache supaya cepat." | "Ukur bottleneck. Jika cache: TTL, invalidasi, data kritis tidak bergantung padanya." |
| "Microservices supaya scalable." | "Mulai modular monolith. Pecah bila ada alasan nyata." |
| "Validasi di frontend." | "FE untuk UX; sumber kebenaran di server." |
| Hanya "apa" | "Mengapa", "kapan tidak", "apa risikonya" |

Pertanyaan balik yang bagus: alur ide → produksi, tantangan teknis terbesar, utang teknis & insiden, bagaimana keputusan arsitektur dicatat.

## Tips menjawab

Jika tidak tahu: jujur + nalar. *"Saya belum pernah memakainya, dari konsepnya saya duga X. Saya akan verifikasi dengan Y."* Lebih dihargai daripada dikarang.

## Sudut pandang senior

Interview senior adalah percakapan desain, bukan kuis. Tunjukkan kamu bisa hidup dengan konsekuensi pilihanmu.

## Kesalahan umum

- Langsung coding tanpa klarifikasi.
- Diam saat live coding.
- Jawaban slogan tanpa trade-off.
- Tidak punya cerita STAR yang konkret.
- Tidak bertanya balik sama sekali.
