# Soal Node & Express (materi + pembahasan)

Tidak dijalankan di judge: butuh HTTP server, header, dan sistem file. Pelajari polanya, tulis di IDE jika ingin mencoba.

## Soal 11 · Rate limiter middleware

### Pembahasan

```js
const hits = new Map(); // ip -> { count, resetAt }
function rateLimit({ windowMs = 60_000, max = 100 } = {}) {
  return (req, res, next) => {
    const now = Date.now();
    const rec = hits.get(req.ip);
    if (!rec || now > rec.resetAt) {
      hits.set(req.ip, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (++rec.count > max) {
      res.set("Retry-After", Math.ceil((rec.resetAt - now) / 1000));
      return res.status(429).json({ message: "Too many requests" });
    }
    next();
  };
}
```

Ini *fixed window* di memori proses. Tidak benar jika server lebih dari satu (pakai Redis `INCR` + `EXPIRE`). Data lama menumpuk (perlu pembersihan). Ada lonjakan di batas jendela — alternatif: sliding window / token bucket.

## Soal 12 · Middleware JWT + role

### Pembahasan

```js
function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
const requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.user?.role) ? next() : res.status(403).json({ message: "Forbidden" });

app.delete("/orders/:id", auth, requireRole("admin"), deleteOrder);
```

401 = belum terautentikasi. 403 = tidak berhak. Secret dari environment. Access token pendek + refresh token.

## Soal 13 · Hitung baris file besar

### Pembahasan

```js
const fs = require("fs");
const readline = require("readline");
async function countLines(path) {
  const rl = readline.createInterface({
    input: fs.createReadStream(path),
    crlfDelay: Infinity,
  });
  let n = 0;
  for await (const _ of rl) n++;
  return n;
}
```

`fs.readFile` memuat seluruh file. File 2 GB bisa crash. Stream menjaga memori kecil.

## Tips menjawab

Sebut kelemahan solusi in-memory saat ada beberapa instance. Sebut 401 vs 403 tanpa diminta.

## Sudut pandang senior

Rate limit di proses = baik untuk demo, berbahaya di produksi multi-replica. Gateway/Redis lebih tepat. JWT di-verify di setiap service, tetapi *pencabutan* butuh store (blocklist / rotasi refresh).

## Kesalahan umum

- Map di memori tanpa TTL cleanup.
- Menyimpan JWT secret di kode.
- `readFile` untuk file besar.
- Menyamaratakan 401 dan 403.
