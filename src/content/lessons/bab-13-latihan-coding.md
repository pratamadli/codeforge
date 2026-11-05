# Cara memakai bab latihan

Kerjakan **tanpa AI** dulu. AI belakangan boleh jadi pelatih, bukan penulis jawaban.

1. Baca soalnya saja, tutup pembahasan. Batas waktu 10–20 menit.
2. Jalankan di editor. Baru bandingkan dengan pembahasan.
3. Besoknya, tulis ulang soal yang salah dari nol tanpa melihat.
4. Jelaskan lantang: mengapa benar, kasus tepi, kompleksitas.

Soal **1–7** (JavaScript murni: debounce, memoize, pool, flatten, groupBy, LRU, Two Sum) dijalankan judge sungguhan: satu fungsi/kelas, tes contoh, tes tersembunyi.

Soal **5 (tebak output)** tidak perlu editor — jawab di kepala, lalu buka bagian pembahasan di bawah setelah mencoba.

Soal React, Express, dan Mongo **tidak** punya sandbox palsu di v1. Judge hanya menjalankan fungsi JS/TS. Kerjakan di kertas/IDE sendiri, lalu baca materi pembahasan di pelajaran berikutnya di modul ini.

## Soal 5 · Tebak output

Coba tebak **sebelum** scroll ke pembahasan.

```js
// (a)
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);

// (b)
async function a() { console.log("a1"); await b(); console.log("a2"); }
async function b() { console.log("b"); }
a(); console.log("c");

// (c)
console.log(typeof null, [] == false, 0.1 + 0.2 === 0.3);
```

## Pembahasan soal 5

**(a) `3 3 3`.** `var` satu variabel untuk semua callback. Setelah loop, `i === 3`. Dengan `let` hasilnya `0 1 2` karena tiap iterasi punya binding sendiri.

**(b) `a1`, `b`, `c`, `a2`.** `await b()`: `b` jalan sinkron sampai Promise-nya settle (`console.log("b")` terjadi di dalam `a` sebelum yield). Setelah `await`, sisa `a` jadi microtask. `console.log("c")` masih sinkron di call stack. Jadi: a1 → b → c → a2.

**(c) `object true false`.** Bug historis `typeof null === "object"`. `[] == false` karena koersi `==`. `0.1 + 0.2` tidak tepat `0.3` (floating point IEEE-754).

## Tips menjawab

Saat live coding soal 1–7: sebut kompleksitas, kasus kosong, dan trade-off (waktu vs memori). Untuk debounce vs throttle: debounce menunggu jeda, throttle membatasi frekuensi.

## Sudut pandang senior

Pool konkurensi (soal 3) dan LRU (soal 6) muncul di produksi: batch call ke API pihak ketiga, cache di proses. Two Sum adalah tes apakah kamu langsung O(n²) atau sadar hashmap.

## Kesalahan umum

- Langsung `Promise.all` ribuan request.
- Cache memoize tanpa batas (bocor memori) — butuh LRU.
- `JSON.stringify` sebagai key memoize gagal untuk fungsi dan urutan key objek.
- Dua loop nested untuk Two Sum tanpa menyebut O(n²).
