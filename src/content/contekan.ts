export type ContekanCard = {
  id: string;
  q: string;
  a: string;
  babHref: string;
  babLabel: string;
};

/** Bab 14.1 — pertanyaan cepat dan jawaban satu kalimat. Bukan bank kuis. */
export const CONTEKAN_CARDS: ContekanCard[] = [
  {
    id: "state-props",
    q: "State vs props?",
    a: "State milik komponen dan bisa berubah. Props dikirim dari parent dan read-only.",
    babHref: "/pelajaran/bab-02-react",
    babLabel: "Bab 2 · React",
  },
  {
    id: "key-list",
    q: "Kenapa key di list?",
    a: "Agar React mengenali item mana yang berubah/pindah/dihapus. Pakai ID stabil, bukan index.",
    babHref: "/pelajaran/bab-02-react",
    babLabel: "Bab 2 · React",
  },
  {
    id: "re-render",
    q: "Kapan re-render?",
    a: "State berubah, parent re-render, context berubah, props berubah referensi.",
    babHref: "/pelajaran/bab-02-react",
    babLabel: "Bab 2 · React",
  },
  {
    id: "hydration",
    q: "Apa itu hydration?",
    a: "Proses React di browser menghidupkan HTML hasil server dengan menempelkan event handler dan state.",
    babHref: "/pelajaran/bab-03-nextjs",
    babLabel: "Bab 3 · Next.js",
  },
  {
    id: "ssr-ssg-isr",
    q: "SSR vs SSG vs ISR?",
    a: "Tiap request / saat build / saat build lalu diperbarui berkala.",
    babHref: "/pelajaran/bab-03-nextjs",
    babLabel: "Bab 3 · Next.js",
  },
  {
    id: "server-client",
    q: "Server vs Client Component?",
    a: "Server: tanpa JS ke browser, akses data langsung. Client: interaktif, memakai hooks.",
    babHref: "/pelajaran/bab-03-nextjs",
    babLabel: "Bab 3 · Next.js",
  },
  {
    id: "node-single",
    q: "Node single-thread?",
    a: "JS di satu thread. I/O oleh libuv/OS. CPU berat pakai worker. Banyak core pakai banyak proses.",
    babHref: "/pelajaran/bab-04-nodejs",
    babLabel: "Bab 4 · Node.js",
  },
  {
    id: "micro-macro",
    q: "Microtask vs macrotask?",
    a: "Microtask (Promise) dikosongkan semua dulu, baru satu macrotask (setTimeout) per putaran.",
    babHref: "/pelajaran/bab-01-javascript",
    babLabel: "Bab 1 · Event loop",
  },
  {
    id: "middleware",
    q: "Middleware Express?",
    a: "Fungsi (req, res, next) dalam rantai pemrosesan request.",
    babHref: "/pelajaran/bab-05-express",
    babLabel: "Bab 5 · Express.js",
  },
  {
    id: "jwt-session",
    q: "JWT vs session?",
    a: "JWT stateless tapi sulit dicabut. Session mudah dicabut tapi butuh penyimpanan.",
    babHref: "/pelajaran/bab-05-express",
    babLabel: "Bab 5 · Express.js",
  },
  {
    id: "put-patch",
    q: "PUT vs PATCH?",
    a: "PUT mengganti seluruh resource. PATCH mengubah sebagian.",
    babHref: "/pelajaran/bab-05-express",
    babLabel: "Bab 5 · Express.js",
  },
  {
    id: "embed-ref",
    q: "Embed vs reference?",
    a: "Embed untuk data dibaca bersama dan terbatas. Reference untuk data dipakai banyak dokumen atau tumbuh tanpa batas.",
    babHref: "/pelajaran/bab-06-mongodb",
    babLabel: "Bab 6 · MongoDB",
  },
  {
    id: "mongo-cepat",
    q: "Cara mempercepat query Mongo?",
    a: "Index yang sesuai (urutan ESR), explain, projection, hindari N+1 dan skip besar.",
    babHref: "/pelajaran/bab-06-mongodb",
    babLabel: "Bab 6 · MongoDB",
  },
  {
    id: "race",
    q: "Cegah race condition?",
    a: "Update atomic bersyarat, unique constraint, optimistic locking, atau transaksi.",
    babHref: "/pelajaran/bab-06-transaksi",
    babLabel: "Bab 6 · Transaksi",
  },
  {
    id: "ganda",
    q: "Cegah transaksi ganda?",
    a: "Idempotency key + state machine + webhook idempoten.",
    babHref: "/pelajaran/bab-06-transaksi",
    babLabel: "Bab 6 · Transaksi",
  },
  {
    id: "monolith",
    q: "Monolith vs microservices?",
    a: "Mulai modular monolith. Pecah bila ada alasan skala, tim, atau rilis.",
    babHref: "/pelajaran/bab-10-studi-kasus",
    babLabel: "Bab 10 · Studi kasus",
  },
  {
    id: "acid",
    q: "ACID?",
    a: "Atomic, Consistent, Isolated, Durable.",
    babHref: "/pelajaran/bab-11-pakem",
    babLabel: "Bab 11 · Pakem",
  },
];

export const RENCANA_2_MINGGU: { hari: string; title: string; fokus: string; href: string }[] = [
  {
    hari: "1–2",
    title: "JavaScript inti + soal 1–7",
    fokus: "JavaScript inti (bab 1, mulai proses/thread) + soal 1–7 di bab 13 tanpa AI.",
    href: "/pelajaran/bab-01-proses-thread",
  },
  {
    hari: "3–5",
    title: "React, soal 8–10, TypeScript",
    fokus: "React (bab 2): hooks, re-render, useEffect cleanup. Kerjakan soal 8–10. Lalu TypeScript (bab 7).",
    href: "/pelajaran/bab-02-react",
  },
  {
    hari: "6–7",
    title: "Next.js App Router",
    fokus: "Next.js (bab 3): rendering, Server/Client Component, caching, auth. Bangun halaman produk dengan ISR.",
    href: "/pelajaran/bab-03-nextjs",
  },
  {
    hari: "8–9",
    title: "Node, Express, tes jalur uang",
    fokus: "Node dan Express (bab 4–5) + soal 11–13. CRUD API dengan JWT, validasi, rate limit, dan tes jalur uang (bab 8).",
    href: "/pelajaran/bab-04-nodejs",
  },
  {
    hari: "10–11",
    title: "Mongo, soal 14, Redis/Docker",
    fokus: "MongoDB dan Mongoose (bab 6) + soal 14. Latih explain. Baca Redis, Docker, CI/CD (bab 9).",
    href: "/pelajaran/bab-06-mongodb",
  },
  {
    hari: "12–13",
    title: "Studi kasus + pakem",
    fokus: "Studi kasus arsitektur (bab 10) dan pakem (bab 11). Latihan menjelaskan lantang 3–5 menit per kasus.",
    href: "/pelajaran/bab-10-studi-kasus",
  },
  {
    hari: "14",
    title: "Mock interview + STAR",
    fokus: "Mock interview, 5 cerita STAR, daftar pertanyaan untuk pewawancara.",
    href: "/pelajaran/bab-12-strategi",
  },
];
