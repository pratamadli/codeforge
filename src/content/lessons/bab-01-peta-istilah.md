# Mulai di sini: peta istilah dari nol

Jika istilah di bawah ini terasa asing, baca bagian ini dulu. Analogi: **proses = kantor**, **thread = karyawan**, **kode = daftar tugas**.

## Konsep

| Istilah | Artinya dalam bahasa sehari-hari |
| --- | --- |
| Kode | Hanya teks. Komputer tidak bisa langsung menjalankannya. |
| JavaScript engine (V8) | Program yang membaca teks JavaScript, menerjemahkannya jadi instruksi CPU, lalu menjalankannya. Chrome dan Node.js memakai V8. |
| Proses | Program yang sedang hidup di memori. Menjalankan `node app.js` membuat satu proses (kantor). |
| Thread | Pekerja di dalam proses yang benar-benar menjalankan instruksi (karyawan). JavaScript hanya punya **satu karyawan** untuk kode kamu. |
| Call stack | Tumpukan tugas yang sedang dikerjakan karyawan itu, satu per satu. |
| Callback | Fungsi yang kamu titipkan untuk dipanggil nanti. Seperti menitipkan motor di bengkel: "kalau selesai, telepon saya" — nomor HP-mu adalah callback. |
| Promise | Janji bahwa hasil akan datang nanti. Status: menunggu, berhasil, atau gagal. |
| async/await | Cara menulis "tunggu hasil janji ini" agar kodenya mudah dibaca. **Bukan karyawan baru.** |
| Event loop | Petugas yang terus mengecek: "karyawan sedang kosong? ada pekerjaan titipan yang sudah selesai?" Jika ya, ia menyuruh karyawan memanggil callback-nya. |

```js
setTimeout(() => console.log("halo"), 1000);
```

1. V8 membaca kode ini, thread utama menjalankannya.
2. Thread utama bertemu `setTimeout`. Timer **tidak** dikerjakan oleh karyawan itu — dititipkan ke browser/Node.
3. Thread utama langsung lanjut mengerjakan hal lain. Ia tidak menunggu.
4. Setelah 1 detik, timer selesai dan callback `() => console.log("halo")` masuk antrean.
5. Event loop melihat karyawan kosong, lalu menjalankan callback itu. Muncul `"halo"`.

Inilah alasan JavaScript yang hanya punya satu thread tetap bisa "melakukan banyak hal": pekerjaan menunggu dititipkan ke luar, dan hasilnya dipanggil kembali lewat event loop. Bagian berikutnya menjelaskan setiap istilah ini lebih dalam.

## Tips menjawab

Kalau ditanya dari nol: mulai dari analogi kantor. *"Kode itu daftar tugas. V8 membacanya. Satu karyawan (thread) mengerjakannya satu per satu. Pekerjaan menunggu dititipkan; event loop memanggil callback saat karyawan kosong. `async/await` bukan karyawan baru."*

## Sudut pandang senior

Peta ini cukup untuk membuka percakapan. Interviewer akan lanjut ke proses vs thread, `await` yang bukan thread baru, dan event loop. Jangan berhenti di analogi — siap tabel dan contoh 4–6 baris di pelajaran berikutnya.

## Kesalahan umum

- Mengira `async/await` membuat thread baru (karyawan baru).
- Mengira `setTimeout(..., 1000)` menahan karyawan selama satu detik.
- Mengira "single-thread" berarti JavaScript tidak bisa menangani banyak request.
