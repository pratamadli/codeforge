# Flatten

Buat `flatten(arr)` yang meratakan array bersarang berapa pun kedalamannya.

```
flatten([1, [2, [3, 4]], 5]) → [1, 2, 3, 4, 5]
```

Nilai non-array (termasuk `0`, `false`, `null`) tetap ada di hasil. Array kosong hilang.

Bawaan: `arr.flat(Infinity)` — interviewer sering tetap minta kamu menulis rekursi/`reduce` sendiri.
