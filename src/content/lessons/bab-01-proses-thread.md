# Proses dan thread

## Konsep

**Proses** adalah program yang sedang berjalan, lengkap dengan ruang memori sendiri. **Thread** adalah jalur eksekusi di dalam proses: urutan instruksi yang dikerjakan CPU. Satu thread hanya bisa mengerjakan **satu hal pada satu waktu**.

### Analogi restoran

- Proses = sebuah restoran (dapur, bahan, peralatan sendiri).
- Thread = koki di dalamnya. Satu koki = satu pesanan pada satu waktu.
- Restoran boleh punya banyak koki (*multi-thread*), tetapi mereka **berbagi dapur**. Bisa tabrakan saat memakai bahan yang sama (*race condition*).

| | Proses | Thread |
| --- | --- | --- |
| Memori | Terpisah antar proses | Dibagi dengan thread lain dalam proses yang sama |
| Biaya membuat | Lebih berat | Lebih ringan |
| Komunikasi | IPC (pesan): rumit tapi aman | Memori bersama: cepat, rawan race |
| Jika crash | Proses lain tetap hidup | Bisa menjatuhkan seluruh proses |

### Concurrency vs parallelism

- **Concurrency:** banyak pekerjaan berjalan bergantian dan semuanya maju. Satu koki merebus air, selagi menunggu ia memotong sayur untuk pesanan lain.
- **Parallelism:** banyak pekerjaan benar-benar bersamaan di beberapa core. Tiga koki, tiga pesanan sekaligus.

Concurrency ≠ parallelism. Satu thread bisa concurrent (bergantian). Parallel butuh lebih dari satu core/thread.

### Bagaimana dengan JavaScript?

Kode JavaScript dijalankan oleh **satu thread** (main thread) dengan **satu call stack**.

- Kelebihan: tidak ada race condition antar kode JS, tidak perlu lock. Lebih mudah dan aman ditulis.
- Kekurangan: satu fungsi lambat memblokir semuanya. Di browser, main thread juga mengurus render dan klik — JS berat membuat halaman macet.
- Walau satu thread, JS tetap bisa menangani banyak hal bersamaan: pekerjaan menunggu (network, timer, file) diserahkan ke luar (browser, OS, libuv), lalu kembali lewat **event loop** (pelajaran berikutnya).
- Parallelism sungguhan: **Web Worker** di browser atau **`worker_threads`** di Node.

### Jebakan istilah

Bahasa JavaScript itu satu thread, **runtime-nya tidak**. Browser dan Node punya thread lain di balik layar (jaringan, render, thread pool libuv). Hanya **eksekusi kode JS kamu** yang berjalan di satu thread.

Di produksi MERN: `JSON.parse` file besar atau loop sinkron di handler Express memblokir **seluruh proses** — semua request lain antre. Itu bukan "Mongo lambat"; itu kamu memakai satu-satunya koki untuk mengiris bawang 3 detik.

## Tips menjawab

Jawaban emas: *"Kode JS satu thread, satu call stack. Pekerjaan menunggu diserahkan ke browser/OS/libuv. Event loop mengembalikan callback saat stack kosong. Jadi concurrent, bukan parallel. CPU berat saya pindah ke worker atau service."*

Kalau ditanya beda proses vs thread: tabel memori / biaya / crash cukup, lalu satu contoh Node (`cluster` = banyak proses, `worker_threads` = thread dalam satu proses).

## Sudut pandang senior

Tergantung yang macet. Kalau I/O: jangan tambah thread — perbaiki blocking. Kalau CPU (resize gambar, laporan pajak): worker atau queue, jangan di request path. Banyak proses (cluster/ECS replica) untuk memakai banyak core menerima HTTP; worker untuk hitungan berat tanpa merusak p95 API.

Di fintech: race condition hampir selalu di **data** (stok, invoice), bukan antar baris JS. Satu thread tidak menyelamatkan dua request HTTP yang menyentuh dokumen yang sama.

## Kesalahan umum

- "JS single-thread jadi tidak bisa banyak request" — bisa, lewat event loop.
- "Node parallel karena async" — async = concurrent. Parallel = worker / banyak proses.
- Sync berat di main thread lalu menyalahkan framework.
- Mengira Web Worker berbagi memori seperti thread biasa tanpa `postMessage`.
