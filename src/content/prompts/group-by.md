# groupBy

Buat `groupBy(arr, keyFn)` yang mengelompokkan item menurut `keyFn(item)`.

```
groupBy(orders, o => o.status)
// { paid: [...], pending: [...] }
```

Kembalikan object: kunci = hasil `keyFn`, nilai = array item (urutan asli di dalam tiap kelompok). Array kosong → `{}`.
