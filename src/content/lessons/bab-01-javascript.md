# Fondasi JavaScript yang sering ditanya

Hampir semua pertanyaan React dan Node bersumber dari sini. Kuasai bagian ini dulu, baru hafalan framework.

## Konsep

### Closure

Closure adalah fungsi yang **mengingat variabel dari tempat ia dibuat**, walau fungsi luarnya sudah selesai. Dipakai untuk data privat, memoization, dan hooks React.

```js
function counter() {
  let count = 0;            // variabel ini "diingat"
  return () => ++count;
}
const next = counter();
next(); // 1
next(); // 2
```

### Event loop

JavaScript punya satu thread untuk menjalankan kode. Agar tidak macet saat menunggu I/O, ada event loop. Urutan prioritas:

1. **Call stack** — kode sinkron sampai kosong.
2. **Microtask** — `Promise.then`, `await`, `queueMicrotask`. Dikosongkan sepenuhnya sebelum lanjut.
3. **Macrotask** — `setTimeout`, `setInterval`, event I/O. Satu per putaran.

```js
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
// Output: 1, 4, 3, 2
```

### Hal lain yang wajib paham

| Topik | Penjelasan singkat |
| --- | --- |
| `var` / `let` / `const` | `var` function-scoped dan di-hoist. `let`/`const` block-scoped. Default pakai `const`. |
| `==` vs `===` | `===` tanpa konversi tipe. Pakai `===` selalu. |
| Reference vs value | Object/array disalin per referensi. `a = b` tidak membuat salinan. Pakai spread atau `structuredClone`. |
| `this` | Ditentukan cara fungsi dipanggil. Arrow function tidak punya `this` sendiri. |
| Promise / async-await | `async/await` cara menulis Promise. Error ditangkap `try/catch`. |
| Debounce / throttle | Debounce: jalankan setelah user berhenti. Throttle: maksimal sekali per interval. |
| Immutability | Jangan ubah data lama, buat salinan baru. Dasar React dan Redux. |

```js
const [a, b] = await Promise.all([getUser(), getOrders()]);
const results = await Promise.allSettled([p1, p2, p3]);
```

`Promise.all` gagal jika salah satu gagal. `allSettled` menunggu semuanya.

## Tips menjawab

- Mulai dari **definisi satu kalimat**, lalu contoh 4–6 baris, lalu jebakan.
- Pertanyaan emas event loop: sebut call stack → microtask → macrotask, lalu tebak output.
- Kalau ditanya debounce vs throttle: debounce untuk search (tunggu user berhenti ketik), throttle untuk scroll/resize.
- Kalimat yang disukai interviewer: *"Tergantung X. Kalau X saya pilih A karena..., konsekuensinya..."*

## Sudut pandang senior

Fondasi ini yang membedakan orang yang "bisa React" dengan orang yang bisa men-debug *stale closure*, race condition, dan memory leak. Senior tidak menghafal API hooks; mereka tahu hooks hanyalah closure + re-render.

Di produksi, immutability dan referensi object lebih sering jadi bug daripada "tidak hafal method array".

## Kesalahan umum

- Mengira `const` membekukan isi object. Yang tetap hanya **ikatan namanya**.
- `==` yang diam-diam mengkonversi (`[] == false` adalah `true`).
- `await` berurutan padahal dua Promise tidak saling bergantung — harusnya `Promise.all`.
- `array.forEach(async ...)` tidak menunggu. Pakai `for...of` atau `Promise.all(array.map(...))`.
- Menyimpan object/fungsi baru setiap render, lalu heran kenapa child yang di-memo tetap re-render.
