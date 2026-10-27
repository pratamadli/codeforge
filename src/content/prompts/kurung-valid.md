Diberikan string yang hanya berisi `()[]{}` (bisa juga kosong). Kembalikan `true` jika setiap kurung buka tertutup dengan pasangan yang **benar dan berurutan**.

**Contoh**

- `"()"` → `true`
- `"()[]{}"` → `true`
- `"(]"` → `false`
- `"([)]"` → `false` (salah sarang)
- `"{[]}"` → `true`
