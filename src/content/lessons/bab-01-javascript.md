# Closure, event loop, dan fondasi lain

Hampir semua pertanyaan React dan Node bersumber dari sini.

## 1.3 Closure

### Mulai dari scope

Scope adalah area tempat sebuah variabel bisa diakses. JavaScript memakai **lexical scoping**: scope ditentukan oleh di mana kode **ditulis**, bukan di mana fungsi dipanggil. Saat mencari variabel, JS menelusuri dari dalam ke luar (**scope chain**).

```js
const a = "global";
function outer() {
  const b = "outer";
  function inner() {
    const c = "inner";
    console.log(a, b, c); // inner melihat a, b, c (naik lewat scope chain)
  }
  inner();
}
```

### Apa itu closure?

Closure adalah fungsi yang membawa serta **referensi ke lingkungan** (variabel) tempat ia dibuat, sehingga masih bisa mengakses variabel itu walau fungsi luarnya sudah selesai.

```js
function makeCounter() {
  let count = 0; // milik makeCounter
  return function () {
    count++;
    return count;
  };
}
const a = makeCounter();
const b = makeCounter();
a(); a(); // 1, 2
b();      // 1  — b punya count sendiri
```

Langkah demi langkah:

1. `makeCounter()` dipanggil. JS membuat lingkungan baru berisi `count = 0`.
2. Fungsi dalam dibuat, menyimpan referensi ke lingkungan itu, lalu dikembalikan.
3. `makeCounter` selesai. Biasanya variabel lokal dibuang, tetapi `count` tetap hidup karena masih direferensikan.
4. Setiap pemanggilan `makeCounter()` membuat lingkungan **baru dan terpisah** — itulah sebabnya `a` dan `b` tidak saling mengganggu.
5. Saat fungsi tidak dipakai lagi dan tak ada referensi, garbage collector membersihkan lingkungannya.

### Kegunaan di dunia nyata

| Kegunaan | Contoh |
| --- | --- |
| Data privat | `count` tidak bisa diubah dari luar kecuali lewat fungsi yang dikembalikan |
| Function factory | `const double = createMultiplier(2)` mengingat angka 2 |
| Memoization / cache | Hasil hitungan sebelumnya di variabel tertutup |
| Debounce, throttle, once | Timer atau status "sudah dipanggil" |
| Event handler & callback | Handler mengingat variabel dari tempat ia didaftarkan |
| React hooks | Tiap render membuat closure baru yang menangkap state/props **render itu** |

### Jebakan 1: closure di dalam loop

```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0); // 3, 3, 3
for (let i = 0; i < 3; i++) setTimeout(() => console.log(i), 0); // 0, 1, 2
```

`var` satu variabel untuk seluruh loop — semua callback melihat nilai akhir (3). `let` membuat binding baru tiap putaran.

### Jebakan 2: stale closure di React

```js
function Timer() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount(count + 1), 1000); // count terjebak di 0
    return () => clearInterval(id);
  }, []);
  // Perbaikan: setInterval(() => setCount((c) => c + 1), 1000);
}
```

Callback di dalam effect menangkap `count` saat effect dibuat (0), jadi hasilnya selalu 1. Ini penyebab banyak bug hooks.

Kebocoran memori: closure menahan variabel selama fungsinya hidup. Event listener yang tidak dilepas atau timer yang tidak dibersihkan membuat data besar tidak pernah dibuang.

## 1.4 Event loop

Karena JavaScript hanya punya **satu thread**, bagaimana ia menunggu `fetch` sambil tetap merespons klik? Event loop: terus memeriksa *"call stack kosong? Jika ya, ambil pekerjaan berikutnya dari antrean."*

| Komponen | Peran |
| --- | --- |
| Call stack | Tumpukan fungsi yang sedang dieksekusi (LIFO). Satu yang berjalan pada satu waktu. |
| Web APIs / Node APIs | Timer, fetch, DOM, file I/O — dikerjakan **di luar** thread JS (browser, OS, libuv). |
| Macrotask queue | `setTimeout`, `setInterval`, event klik, callback I/O. |
| Microtask queue | Prioritas lebih tinggi: `.then` / `.catch` / `.finally`, lanjutan setelah `await`, `queueMicrotask`. |
| Event loop | Saat stack kosong, pindahkan tugas dari antrean ke stack. |

```
Call Stack --(timer, fetch, I/O)--> Web/Node APIs
                                      |
                          selesai, callback masuk antrean
                                      v
                       Microtask queue  /  Macrotask queue
                                      |
 Event loop: "stack kosong?" --> ambil tugas --> kembali ke Call Stack
```

### Aturan putaran

1. Jalankan semua kode sinkron sampai call stack kosong.
2. Kosongkan **seluruh** microtask (termasuk yang muncul selama itu).
3. (Browser) render ulang layar bila perlu.
4. Ambil **satu** macrotask dan jalankan.
5. Ulangi dari langkah 2.

### Contoh dengan penelusuran

```js
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
(async () => { console.log("4"); await null; console.log("5"); })();
console.log("6");
// Output: 1, 4, 6, 3, 5, 2
```

| Tahap | Yang terjadi | Output |
| --- | --- | --- |
| Sinkron | Cetak 1. `setTimeout` = macrotask. `.then` = microtask. Fungsi async cetak 4, `await` memindahkan sisanya ke microtask. Cetak 6. | 1, 4, 6 |
| Microtask | Jalankan `.then`, lalu lanjutan setelah `await`. | 3, 5 |
| Satu macrotask | Callback `setTimeout`. | 2 |

Pelajaran penting:

- `setTimeout(fn, 0)` artinya *"minimal setelah 0 ms, dan setelah stack + microtask kosong"* — bukan "segera".
- Waktu di `setTimeout` adalah **batas minimum**, bukan jaminan. Thread sibuk = callback terlambat.
- Microtask yang terus menambah microtask baru bisa mengunci loop (render dan klik tidak sempat).
- Kode sinkron lama memblokir semuanya, termasuk timer dan klik.

```js
setTimeout(() => console.log("timer"), 100);
const start = Date.now();
while (Date.now() - start < 3000) {} // blokir 3 detik
// "timer" baru tercetak setelah ~3 detik, bukan 100 ms
```

Jika ada tugas CPU berat: pecah jadi potongan (`setTimeout` / `requestIdleCallback`); pindah ke Web Worker / `worker_threads`; atau ke service khusus.

Di Node, loop dijalankan libuv (fase timers, poll, check, …) dan `process.nextTick` diprioritaskan sebelum microtask Promise. Detail di bab 4.8.

## 1.5 Hal lain yang wajib paham

| Topik | Penjelasan singkat |
| --- | --- |
| `var` / `let` / `const` | `var` function-scoped dan di-hoist. `let`/`const` block-scoped. Default pakai `const`. |
| Hoisting & TDZ | Deklarasi `var`/function "naik" ke atas scope. `let`/`const` ada di *temporal dead zone* sebelum baris deklarasinya (akses = error). |
| `==` vs `===` | `===` tanpa konversi tipe. Pakai `===` selalu. |
| Reference vs value | Object/array disalin per referensi. `a = b` tidak membuat salinan. Pakai spread atau `structuredClone`. |
| `this` | Ditentukan cara fungsi dipanggil. Arrow function tidak punya `this` sendiri. |
| Prototype | Object mewarisi properti lewat rantai prototype. `class` hanyalah sintaks di atas prototype. |
| Debounce / throttle | Debounce: jalankan setelah user berhenti. Throttle: maksimal sekali per interval. |
| Immutability | Jangan ubah data lama, buat salinan baru. Dasar React dan Redux. |

`const` hanya membekukan **ikatan nama**, bukan isi object.

## Tips menjawab

Closure: *"Fungsi yang mengingat variabel dari scope tempat ia dibuat, walau scope itu sudah selesai. Saya memakainya untuk data privat, debounce, dan memahami hooks React, dan saya waspada terhadap stale closure serta kebocoran memori."*

Event loop (emas): *"Kode JS berjalan di satu thread, tetapi pekerjaan menunggu diserahkan ke browser/OS/libuv. Saat selesai, callback masuk antrean dan event loop menjalankannya ketika call stack kosong. Jadi concurrent, bukan parallel. Untuk CPU berat saya pakai worker atau pindah ke service."*

Mulai dari definisi satu kalimat, contoh 4–6 baris, lalu jebakan. Tebak output: sebut stack → microtask → macrotask.

## Sudut pandang senior

Fondasi ini yang membedakan orang yang "bisa React" dengan orang yang bisa men-debug stale closure, race, dan memory leak. Hooks hanyalah closure + re-render.

Di produksi MERN, immutability dan referensi object lebih sering jadi bug daripada "tidak hafal method array". Loop sinkron 3 detik di handler invoice = seluruh replica macet, sama seperti `while` di atas.

## Kesalahan umum

- Mengira `const` membekukan isi object.
- `==` yang diam-diam mengkonversi (`[] == false` adalah `true`).
- `await` berurutan padahal dua Promise tidak saling bergantung.
- `array.forEach(async ...)` tidak menunggu.
- Menyimpan object/fungsi baru setiap render, lalu heran child yang di-memo tetap re-render.
- Event listener / interval tanpa cleanup → closure menahan memori.
- Mengira `setTimeout(0)` jalan sebelum `.then`.
