# Codexercise

Latihan interview **Senior Full Stack (MERN)** — spine 14 bab *Panduan Interview Fullstack*, ditimbang untuk lowongan seperti Bookipi: production ownership, desain API, transaksi Mongo (konsistensi, retry, duplikat), RCA, Docker/AWS/CI/CD, integrasi Stripe-like. Materi Indonesia, soal JS/TS di-judge, progress di **localStorage**. Tidak ada daftar/masuk. Bukan track tutorial junior.

## Stack

Next.js App Router · TypeScript · Tailwind · judge Node (esbuild + child process). Tanpa MongoDB dan tanpa akun.

## Jalan lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Langsung ke dasbor, tanpa login.

Kurikulum statis di `src/content`. Hidden tests dan pembahasan hanya dibaca server saat **Kumpulkan**.

## Alur

Baca materi → kerjakan soal 1–7 bab 13 di Monaco → **Jalankan contoh** → **Kumpulkan** (tes tersembunyi) → pembahasan. Soal React/Express/Mongo tetap materi + pembahasan (bukan sandbox palsu).

Progress, pelajaran/soal terakhir, pengumpulan, dan statistik dasbor tersimpan di `localStorage` (`ce-progress-v1`).

## Di luar v1

Generate soal AI, React preview, dan sandbox Express/Mongo — belum.
