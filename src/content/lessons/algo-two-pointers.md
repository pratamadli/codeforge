# Two pointers

Dua indeks bergerak di array/string yang **sudah terurut** atau punya arah jelas. Tujuannya: menghindari loop bersarang.

Pola klasik:

1. **Dari dua ujung** — palindrome, pair sum di array terurut.
2. **Pelan-cepat** (*slow/fast*) — cycle, tengah linked list.
3. **Jendela** (*sliding window*) — subarray terpanjang tanpa duplikat.

```js
function isPalindromeChars(chars) {
  let kiri = 0;
  let kanan = chars.length - 1;
  while (kiri < kanan) {
    if (chars[kiri] !== chars[kanan]) return false;
    kiri++;
    kanan--;
  }
  return true;
}
```

## Analogi

Dua orang merapikan rak dari ujung kiri dan ujung kanan, bertemu di tengah. Mereka tidak perlu cek semua pasangan (itu O(n²)); cukup n langkah.

## Kapan jangan dipaksa

Kalau data tidak terurut dan tidak ada sifat “bisa buang sisi kiri/kanan”, two pointers tidak ajaib. Kadang hashmap lebih jujur.
