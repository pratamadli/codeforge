# CodeForge

A tiny snippet forge — create and browse code snippets.

Heat a title, pick a language, and strike code into an in-memory library. Search, filter, copy, or quench pieces from the rack.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

Persistence lives in process memory (`globalThis`) so snippets survive Next.js hot reloads during development, but reset when the server restarts.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |

## API

| Method | Path | Body | Result |
| --- | --- | --- | --- |
| `GET` | `/api/snippets` | — | `{ snippets: Snippet[] }` |
| `POST` | `/api/snippets` | `{ title, language?, code }` | `201 { snippet }` |
| `DELETE` | `/api/snippets/:id` | — | `{ ok: true }` |

`title` and `code` are required on create. `language` defaults to `plaintext`.
