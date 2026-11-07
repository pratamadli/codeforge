import type { SeedTrack } from "@/content/types";

export const curriculum: SeedTrack[] = [
  {
    slug: "interview-fullstack",
    title: "Panduan Interview Fullstack",
    description:
      "14 bab latihan interview MERN: JavaScript sampai produksi — API, Mongo, testing, infra, dan soal coding.",
    order: 1,
    modules: [
      {
        slug: "bab-01-javascript",
        title: "Bab 1 · Fondasi JavaScript",
        description:
          "Peta istilah dari nol, proses & thread, sync/async, closure, dan event loop — fondasi pertanyaan React dan Node.",
        order: 1,
        lessons: [
          { slug: "bab-01-peta-istilah", title: "Mulai di sini: peta istilah dari nol", order: 1 },
          { slug: "bab-01-proses-thread", title: "Proses dan thread", order: 2 },
          { slug: "bab-01-sync-async", title: "Synchronous vs asynchronous", order: 3 },
          { slug: "bab-01-javascript", title: "Closure, event loop, dan fondasi lain", order: 4 },
        ],
        problems: [],
      },
      {
        slug: "bab-02-react",
        title: "Bab 2 · React",
        description: "Hooks, re-render, state, dan performa di React untuk fitur produksi.",
        order: 2,
        lessons: [{ slug: "bab-02-react", title: "React: konsep inti sampai concurrent", order: 1 }],
        problems: [],
      },
      {
        slug: "bab-03-nextjs",
        title: "Bab 3 · Next.js (App Router)",
        description: "SSR/SSG/ISR, Server vs Client Component, caching, dan auth di App Router.",
        order: 3,
        lessons: [{ slug: "bab-03-nextjs", title: "Next.js App Router", order: 1 }],
        problems: [],
      },
      {
        slug: "bab-04-nodejs",
        title: "Bab 4 · Node.js",
        description:
          "Runtime Node dari nol, perjalanan kode, fase event loop, modul/fs/npm, error, stream, dan troubleshooting produksi.",
        order: 4,
        lessons: [
          { slug: "bab-04-nodejs", title: "Node.js: runtime, core, event loop", order: 1 },
          { slug: "bab-04-nodejs-dalam", title: "Modul, fs, error, dan stream", order: 2 },
          { slug: "bab-04-produksi-rca", title: "Ownership produksi & troubleshooting", order: 3 },
        ],
        problems: [],
      },
      {
        slug: "bab-05-express",
        title: "Bab 5 · Express.js",
        description: "Desain API dan service backend yang bisa dimiliki end-to-end di produksi.",
        order: 5,
        lessons: [
          { slug: "bab-05-express", title: "Express.js: middleware sampai REST", order: 1 },
          { slug: "bab-05-api-ownership", title: "Desain API & ownership fitur", order: 2 },
        ],
        problems: [],
      },
      {
        slug: "bab-06-mongodb",
        title: "Bab 6 · MongoDB",
        description: "Performa, konsistensi, transaksi, retry, dan penanganan duplikat.",
        order: 6,
        lessons: [
          { slug: "bab-06-mongodb", title: "MongoDB: desain data dan performa", order: 1 },
          { slug: "bab-06-transaksi", title: "Transaksi, konsistensi, retry, duplikat", order: 2 },
        ],
        problems: [],
      },
      {
        slug: "bab-07-typescript",
        title: "Bab 7 · TypeScript",
        description: "Tipe, narrowing, generics, utility types, dan mengapa tipe tidak cukup di runtime.",
        order: 7,
        lessons: [{ slug: "bab-07-typescript", title: "TypeScript yang ditanya di interview", order: 1 }],
        problems: [],
      },
      {
        slug: "bab-08-testing",
        title: "Bab 8 · Testing",
        description: "Tes yang melindungi jalur uang/auth, plus pencegahan setelah insiden produksi.",
        order: 8,
        lessons: [{ slug: "bab-08-testing", title: "Testing: unit sampai E2E", order: 1 }],
        problems: [],
      },
      {
        slug: "bab-09-infra",
        title: "Bab 9 · Web, Redis, Docker & CI/CD",
        description: "Docker, AWS, CI/CD, dan rilis tanpa downtime.",
        order: 9,
        lessons: [
          { slug: "bab-09-infra", title: "Dasar web, Redis, Docker, CI/CD", order: 1 },
          { slug: "bab-09-aws-cicd", title: "Docker, AWS, CI/CD di produksi", order: 2 },
        ],
        problems: [],
      },
      {
        slug: "bab-10-studi-kasus",
        title: "Bab 10 · Studi kasus senior",
        description:
          "10 studi kasus sebagai drill verbal: pikirkan lantang, baru buka kerangka senior. Plus Stripe-like.",
        order: 10,
        lessons: [
          { slug: "bab-10-studi-kasus", title: "Studi kasus: drill verbal", order: 1 },
          { slug: "bab-10-stripe", title: "Integrasi pembayaran (Stripe-like)", order: 2 },
        ],
        problems: [],
      },
      {
        slug: "bab-11-pakem",
        title: "Bab 11 · Pakem software engineering",
        description: "KISS, SOLID, pakem FE/BE, sistem terdistribusi, dan praktik tim.",
        order: 11,
        lessons: [{ slug: "bab-11-pakem", title: "Pakem engineering FE & BE", order: 1 }],
        problems: [],
      },
      {
        slug: "bab-12-strategi",
        title: "Bab 12 · Strategi menjawab interview",
        description: "Cara menjawab interview MERN: ownership, transaksi, RCA, dan trade-off.",
        order: 12,
        lessons: [
          { slug: "bab-12-strategi", title: "Strategi menjawab interview", order: 1 },
          { slug: "bab-12-bicara-mern", title: "Latihan bicara interview MERN", order: 2 },
        ],
        problems: [],
      },
      {
        slug: "bab-13-latihan-coding",
        title: "Bab 13 · Latihan coding",
        description:
          "Soal 1–7 di-judge (fungsi JS/TS + tes). Soal React/Express/Mongo tetap materi + pembahasan — bukan sandbox palsu.",
        order: 13,
        lessons: [
          { slug: "bab-13-latihan-coding", title: "Cara latihan + tebak output", order: 1 },
          { slug: "bab-13-react-latihan", title: "Soal React (materi, bukan sandbox)", order: 9 },
          { slug: "bab-13-express-latihan", title: "Soal Node & Express (materi)", order: 10 },
          { slug: "bab-13-mongodb-latihan", title: "Soal MongoDB (materi)", order: 11 },
        ],
        problems: [
          {
            slug: "debounce",
            title: "Soal 1 · Debounce",
            order: 2,
            language: "js",
            difficulty: "medium",
            skillLevel: "intermediate",
            functionName: "debounce",
            tags: ["closure", "timer", "debounce"],
            starterCode: `function debounce(fn, delay) {
  // jalankan fn hanya setelah tidak dipanggil selama delay ms
}
`,
            sampleTests: [
              {
                args: [
                  50,
                  [
                    { t: 0, v: "a" },
                    { t: 20, v: "b" },
                  ],
                ],
                expected: ["b"],
              },
              {
                args: [
                  40,
                  [
                    { t: 0, v: 1 },
                    { t: 80, v: 2 },
                  ],
                ],
                expected: [1, 2],
              },
            ],
          },
          {
            slug: "memoize",
            title: "Soal 2 · Memoize",
            order: 3,
            language: "js",
            difficulty: "easy",
            skillLevel: "intermediate",
            functionName: "memoize",
            tags: ["closure", "cache", "map"],
            starterCode: `function memoize(fn) {
  // kembalikan fungsi yang menyimpan hasil berdasarkan argumen
}
`,
            sampleTests: [
              { args: [[2, 2, 3]], expected: { values: [4, 4, 9], computes: 2 } },
              { args: [[5]], expected: { values: [25], computes: 1 } },
            ],
          },
          {
            slug: "run-pool",
            title: "Soal 3 · Pool konkurensi",
            order: 4,
            language: "js",
            difficulty: "medium",
            skillLevel: "intermediate",
            functionName: "runPool",
            tags: ["async", "promise", "concurrency"],
            starterCode: `async function runPool(tasks, limit) {
  // jalankan maksimal \`limit\` task async bersamaan
  // hasil tetap berurutan sesuai indeks tasks
}
`,
            sampleTests: [
              { args: [[1, 2, 3], 2], expected: { results: [1, 2, 3], max: 2 } },
              { args: [["a"], 3], expected: { results: ["a"], max: 1 } },
            ],
          },
          {
            slug: "flatten",
            title: "Soal 4a · Flatten",
            order: 5,
            language: "js",
            difficulty: "easy",
            skillLevel: "beginner",
            functionName: "flatten",
            tags: ["array", "recursion", "reduce"],
            starterCode: `function flatten(arr) {
  // ratakan array bersarang berapa pun kedalamannya
  // flatten([1, [2, [3, 4]], 5]) → [1, 2, 3, 4, 5]
}
`,
            sampleTests: [
              { args: [[1, [2, [3, 4]], 5]], expected: [1, 2, 3, 4, 5] },
              { args: [[[], 1, [2]]], expected: [1, 2] },
            ],
          },
          {
            slug: "group-by",
            title: "Soal 4b · groupBy",
            order: 6,
            language: "js",
            difficulty: "easy",
            skillLevel: "beginner",
            functionName: "groupBy",
            tags: ["array", "reduce", "object"],
            starterCode: `function groupBy(arr, keyFn) {
  // kelompokkan item menurut keyFn(item)
  // groupBy(orders, o => o.status) → { paid: [...], pending: [...] }
}
`,
            sampleTests: [
              {
                args: [
                  [
                    { id: 1, status: "paid" },
                    { id: 2, status: "pending" },
                    { id: 3, status: "paid" },
                  ],
                  "status",
                ],
                expected: {
                  paid: [
                    { id: 1, status: "paid" },
                    { id: 3, status: "paid" },
                  ],
                  pending: [{ id: 2, status: "pending" }],
                },
              },
              { args: [[], "status"], expected: {} },
            ],
          },
          {
            slug: "lru-cache",
            title: "Soal 6 · LRU Cache",
            order: 7,
            language: "js",
            difficulty: "medium",
            skillLevel: "intermediate",
            functionName: "LRUCache",
            tags: ["map", "lru", "class"],
            starterCode: `class LRUCache {
  constructor(capacity) {
    // kapasitas tetap; get dan set harus O(1)
  }
  get(key) {
    // kembalikan nilai, atau undefined jika tidak ada
  }
  set(key, val) {
    // jika penuh, buang item yang paling lama tidak dipakai
  }
}
`,
            sampleTests: [
              {
                args: [
                  2,
                  [
                    ["set", 1, 1],
                    ["set", 2, 2],
                    ["get", 1],
                    ["set", 3, 3],
                    ["get", 2],
                    ["get", 3],
                  ],
                ],
                expected: [1, null, 3],
              },
            ],
          },
          {
            slug: "two-sum",
            title: "Soal 7 · Two Sum",
            order: 8,
            language: "js",
            difficulty: "easy",
            skillLevel: "intermediate",
            functionName: "twoSum",
            tags: ["hashmap", "array", "two-sum"],
            starterCode: `function twoSum(nums, target) {
  // kembalikan indeks [i, j] (i < j) yang jumlahnya = target
  // jika tidak ada, kembalikan null
}
`,
            sampleTests: [
              { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
              { args: [[3, 2, 4], 6], expected: [1, 2] },
            ],
          },
        ],
      },
      {
        slug: "bab-14-contekan",
        title: "Bab 14 · Contekan cepat",
        description:
          "Review 14.1: pertanyaan cepat + jawaban satu kalimat (bukan kuis). Plus rencana 2 minggu.",
        order: 14,
        lessons: [{ slug: "bab-14-contekan", title: "Contekan cepat sebelum interview", order: 1 }],
        problems: [],
      },
    ],
  },
];
