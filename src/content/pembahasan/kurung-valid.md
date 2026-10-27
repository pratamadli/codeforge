## Ide

Stack (tumpukan). Kurung buka = taruh piring. Kurung tutup = ambil piring teratas; harus pasangan yang cocok. Di akhir, tumpukan harus kosong.

## Analogi

Tumpukan piring di restoran. Piring terakhir yang diletakkan harus terambil lebih dulu (*last in, first out*). Kamu tidak bisa menutup kotak kardus sementara masih ada piring di atasnya — itu analogi `"([)]"`.

## Langkah

1. Peta pasangan: `)` → `(`, dst.
2. Loop karakter.
3. Jika buka, `push`.
4. Jika tutup: stack kosong atau puncak bukan pasangannya → `false`.
5. Akhir: `stack.length === 0`.

## Kompleksitas

Waktu O(n), memori O(n).

## Pitfall

- String kosong → `true`.
- Hanya tutup `"]"` → `false` (stack kosong).
- Hanya buka `"((((("` → `false` (sisa di stack).

## Kode

```ts
function isValidParentheses(s: string): boolean {
  const pasangan: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  const stack: string[] = [];
  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
      continue;
    }
    if (stack.pop() !== pasangan[ch]) return false;
  }
  return stack.length === 0;
}
```
