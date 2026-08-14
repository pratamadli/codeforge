# CodeForge

Platform untuk **menilai** dan **melatih** skill ngoding kamu.

Assessment singkat mengukur level (Pemula → Mahir), lalu latihan coding disesuaikan dengan kelemahan dan topik yang perlu diperkuat.

## Fitur

- **Assessment** — 12 pertanyaan (konsep, baca kode, algoritma, async, pola)
- **Level & breakdown** — skor per topik + rekomendasi fokus latihan
- **Latihan coding** — soal JavaScript dengan hint, test otomatis, dan solusi
- **Progress** — lacak latihan selesai dan percobaan

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

Progress disimpan di memori proses (`globalThis`) — bertahan saat hot reload, reset saat server restart.

## Setup

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Alur pengguna

1. **Beranda** — overview dan stat progress
2. **Assessment** — jawab 12 pertanyaan
3. **Hasil** — level, skor, breakdown topik
4. **Latihan** — kerjakan soal sesuai level, jalankan test

## API

| Method | Path | Body | Result |
| --- | --- | --- | --- |
| `GET` | `/api/curriculum` | — | questions, exercises, progress |
| `POST` | `/api/assessment` | `{ answers: Record<questionId, optionIndex> }` | `{ result, progress }` |
| `GET` | `/api/progress` | — | `{ progress }` |
| `POST` | `/api/progress` | `{ action: "complete" \| "attempt" \| "reset", exerciseId? }` | `{ progress }` |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |
