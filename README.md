# Codexercise

Latihan coding dari beginner sampai interview: materi Indonesia, soal JS/TS gaya LeetCode, judge di server, pembahasan, progress per user.

## Stack

Next.js App Router · TypeScript · Tailwind · MongoDB / Mongoose

## Jalan lokal

1. MongoDB di `127.0.0.1:27017` (Docker: `docker compose up -d`).
2. Salin env:

```bash
cp .env.example .env
```

Isi `AUTH_SECRET` dengan string acak yang panjang.

3. Install, seed, jalan:

```bash
npm install
npm run seed
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Seed bisa diulang (`npm run seed`) — kurikulum diisi ulang dari awal, submission/progress dihapus, user demo di-upsert.

### Akun demo

- Email: `demo@codexercise.dev`
- Password: `Latihan123`

## Alur

Daftar / masuk → kurikulum (track → modul) → baca materi → kerjakan soal di Monaco → **Jalankan contoh** (sample tests) → **Kumpulkan** (hidden tests) → pembahasan → progress.

Hidden tests dan solusi tidak dikirim ke client sebelum submit. Setelah submit pertama, pembahasan (termasuk kode referensi) tampil.

## Di luar v1

Generate soal AI, React preview, dan sandbox Express/Mongo — belum.
