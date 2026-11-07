# Synchronous vs asynchronous

Mengapa JavaScript *harus* async, dan apa artinya `await` (bukan thread baru).

## Konsep

| | Synchronous (blocking) | Asynchronous (non-blocking) |
| --- | --- | --- |
| Cara kerja | Baris berikutnya menunggu baris sebelumnya selesai | Pekerjaan dimulai, program lanjut, hasil datang nanti |
| Contoh | Loop berat, `readFileSync`, `JSON.parse` besar | `fetch`, `setTimeout`, `fs.readFile`, query DB |
| Dampak | Seluruh program tertahan | Thread tetap bebas melayani pekerjaan lain |

Analogi kasir kopi: sync = berdiri menunggu kopi jadi, antrean di belakang ikut menunggu. Async = nomor antrean, duduk; kasir layani orang berikutnya, kamu dipanggil saat siap.

CPU bekerja nanodetik; jaringan/disk puluhan–ratusan milidetik. Jika thread menunggu secara sync, ia menganggur dan semua pekerjaan lain tertahan.

```js
console.log("A");
setTimeout(() => console.log("B"), 1000); // dijadwalkan, tidak ditunggu
console.log("C");
// Output: A, C, lalu 1 detik kemudian B
```

### Tiga generasi menulis async

```js
// 1) Callback — rawan callback hell
getUser(id, (err, user) => {
  if (err) return handle(err);
  getOrders(user.id, (err, orders) => { /* makin menjorok */ });
});

// 2) Promise — rantai, error di satu tempat
getUser(id).then((u) => getOrders(u.id)).then(show).catch(handle);

// 3) async/await — terbaca seperti kode biasa
try {
  const user = await getUser(id);
  const orders = await getOrders(user.id);
  show(orders);
} catch (err) {
  handle(err);
}
```

Promise punya tiga keadaan: **pending**, **fulfilled**, **rejected**. Keadaan hanya berubah sekali.

### Fakta penting tentang async/await

- Sintaks di atas Promise, **bukan thread baru**.
- `await` hanya menjeda **fungsi itu**. Kode lain di program tetap berjalan.
- Fungsi async berjalan sinkron sampai `await` pertama. Sisanya setelah `await` jadi **microtask**.
- Membantu pekerjaan menunggu (I/O). **Tidak** mempercepat CPU berat.
- `async function` selalu mengembalikan Promise. Error di dalamnya = Promise reject.

```js
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function task() {
  await sleep(1000);
}
await task();
await task(); // berurutan: ~2 detik
await Promise.all([task(), task()]); // paralel: ~1 detik
```

`Promise.all` gagal jika salah satu gagal. `Promise.allSettled` menunggu semuanya apa pun hasilnya.

## Tips menjawab

*"Async/await tidak membuat thread baru. Ia menyerahkan I/O, lalu event loop mengembalikan hasilnya sebagai microtask. Dua I/O independen saya `Promise.all`; yang saling bergantung tetap berurutan."*

Tergantung kegagalan: butuh semua atau gagal cepat → `all`. Butuh laporan per-item (webhook batch) → `allSettled`.

## Sudut pandang senior

Di API invoice: hitung pajak sinkron (kecil) boleh di request. Panggil Stripe / generate PDF → async + queue. `readFileSync` atau `bcrypt.hashSync` di handler = seluruh replica "kasir berdiri menunggu".

`forEach(async ...)` tidak menunggu. Produksi: `for...of` (berurutan, lebih aman ke rate limit) atau `Promise.all` / pool (bab 15 soal 3) jika pihak ketiga kuat.

## Kesalahan umum

- Mengira `await` memblokir seluruh proses.
- `await` berurutan untuk dua fetch yang tidak saling bergantung.
- `array.forEach(async ...)` lalu menganggap semua selesai.
- Memakai async untuk "mempercepat" loop CPU.
- Tidak menangani reject — proses Node bisa jatuh.
