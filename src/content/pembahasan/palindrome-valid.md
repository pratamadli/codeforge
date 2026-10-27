## Ide

Two pointers dari kiri dan kanan. Loncat karakter yang bukan huruf/angka. Bandingkan versi huruf kecil.

Boleh juga bersihkan string dulu jadi `cleaned`, lalu bandingkan dengan `reversed`. Two pointers menghemat alokasi string kedua.

## Analogi

Dua orang membaca tulisan di gelas: satu dari depan, satu dari belakang (lewat cermin). Spasi dan koma diabaikan, seperti stiker yang tidak dihitung.

## Langkah

1. `kiri = 0`, `kanan = s.length - 1`.
2. Majukan `kiri` selama karakter tidak alfanumerik.
3. Mundurkan `kanan` similarly.
4. Jika `toLowerCase` berbeda → `false`.
5. Geser keduanya, ulangi.

## Kompleksitas

Waktu O(n), memori O(1) untuk two pointers.

## Pitfall

- Lupa digit: `"0P"` bukan palindrome (`0` vs `p`).
- `underscore` `_` bukan alfanumerik — `"ab_a"` setelah dibersihkan jadi `"aba"`.
- Regex `\\w` di JS termasuk `_`, jadi jangan pakai `\\w` kalau mengikuti definisi alfanumerik ketat.

## Kode

```js
function isPalindrome(s) {
  const ok = (ch) => /[a-z0-9]/i.test(ch);
  let kiri = 0;
  let kanan = s.length - 1;
  while (kiri < kanan) {
    while (kiri < kanan && !ok(s[kiri])) kiri++;
    while (kiri < kanan && !ok(s[kanan])) kanan--;
    if (s[kiri].toLowerCase() !== s[kanan].toLowerCase()) return false;
    kiri++;
    kanan--;
  }
  return true;
}
```
