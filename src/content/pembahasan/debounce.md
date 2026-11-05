## Ide

Simpan `timer` di closure. Setiap panggilan: batalkan timer lama, pasang yang baru. Hanya jeda sunyi sepanjang `delay` yang benar-benar menjalankan `fn`.

## Analogi

Lift menunggu orang berhenti masuk. Tiap ada orang baru, pintu ditahan lagi. Baru jalan setelah sepi beberapa detik.

## Langkah

1. `let timer`.
2. Kembalikan fungsi yang menerima `...args`.
3. `clearTimeout(timer)`.
4. `timer = setTimeout(() => fn.apply(this, args), delay)`.

## Kompleksitas

Waktu O(1) per panggilan (selain delay). Memori O(1) di luar `fn`.

## Pitfall

- Throttle ≠ debounce.
- Lupa `clearTimeout` → `fn` jalan berkali-kali.
- Tidak meneruskan `this` / argumen terakhir.

## Kode

```js
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```
