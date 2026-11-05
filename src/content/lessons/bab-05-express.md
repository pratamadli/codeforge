# Express.js: middleware sampai REST

Express adalah framework web minimalis. Intinya: request melewati **rantai middleware**. Masing-masing boleh memodifikasi req/res, mengakhiri response, atau `next()`.

## Konsep

```js
const express = require("express");
const app = express();
app.use(express.json());
app.use(logger);
app.get("/orders/:id", auth, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
});
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});
```

Error handler: **4 parameter**, diletakkan paling akhir. Express 5 meneruskan error async otomatis; Express 4 perlu `try/catch` atau wrapper.

Struktur layered yang rapi: `routes` → `controllers` → `services` (logika bisnis, tidak tahu Express) → `repositories` → `middlewares` / `models` / `config`. Manfaat: service bisa dites tanpa HTTP. Trade-off: untuk proyek 3 file, layer ini berlebihan.

### Auth

| Pendekatan | Kelebihan | Kekurangan |
| --- | --- | --- |
| Session + cookie | Mudah dicabut, cookie HttpOnly | Perlu store (Redis) saat banyak server |
| JWT | Stateless, mudah skala | Sulit dicabut sebelum kedaluwarsa |
| OAuth2 / OIDC | Tidak kelola password | Alur lebih kompleks |

Autentikasi = siapa kamu. Otorisasi = apa yang boleh. Keduanya dicek **di server**.

REST: resource kata benda jamak. Status code tepat (401 vs 403 vs 404 vs 409 vs 429). Pagination (cursor lebih stabil daripada offset). Versioning. Idempotency-Key untuk POST pembayaran. Format error konsisten `{ code, message, details }`. Ownership kontrak (total di server, state machine, versi) di pelajaran **Desain API & ownership fitur**.

`PUT` mengganti seluruh resource. `PATCH` mengubah sebagian.

## Tips menjawab

Klasik: "Apa middleware?", "PUT vs PATCH?", "JWT vs session?", "Amankan API?", "Error global?", "Struktur proyek?"

Checklist keamanan yang mudah diingat: validasi Zod di server, hash password (bcrypt/argon2), rate limit login, Helmet + CORS ketat, cegah NoSQL injection (jangan masukkan objek mentah ke query), XSS/CSRF, secret di env, jangan bocorkan stack.

## Sudut pandang senior

Access token pendek (≈15 menit) + refresh token di cookie HttpOnly/Secure/SameSite, hash refresh token disimpan agar bisa dicabut.

Jangan simpan JWT di `localStorage` jika bisa dihindari (XSS).

Satu aplikasi web monolit: session sering lebih sederhana dan lebih aman. JWT unggul saat banyak service atau mobile client.

## Kesalahan umum

- Percaya pengecekan role di frontend.
- NoSQL injection: `{ "password": { "$gt": "" } }` bisa melewati login jika body langsung jadi query.
- 401 dan 403 tertukar.
- Error handler tidak di paling akhir, atau lupa 4 argumen.
- Harga/total dihitung di client.
