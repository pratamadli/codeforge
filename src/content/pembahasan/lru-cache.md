## Ide

`Map` di JS mengingat urutan sisip. Key paling depan = paling lama tidak dipakai. `get`/`set`: hapus dulu lalu `set` lagi supaya pindah ke belakang (terbaru). Saat `size > cap`, hapus `map.keys().next().value`.

## Analogi

Rak buku sempit. Buku yang baru dibaca ditaruh di ujung kanan. Yang di ujung kiri, kalau penuh, dibuang.

## Langkah

1. Constructor: simpan `cap` + `new Map()`.
2. `get`: jika tidak ada, `undefined`. Jika ada, delete + set ulang, return nilai.
3. `set`: jika key ada, delete. Set baru. Jika kelebihan, delete key pertama.

## Kompleksitas

`get`/`set` O(1) rata-rata.

## Pitfall

- `get` tidak memindahkan ke terbaru → bukan LRU.
- Pakai array + `indexOf` → O(n).
- Update nilai tanpa reset urutan.

## Kode

```js
class LRUCache {
  constructor(capacity) {
    this.cap = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return undefined;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }
  set(key, val) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, val);
    if (this.map.size > this.cap) this.map.delete(this.map.keys().next().value);
  }
}
```
