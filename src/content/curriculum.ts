import type { SeedTrack } from "@/content/types";

export const DEMO_USER = {
  email: "demo@codexercise.dev",
  password: "Latihan123",
  name: "Demo",
};

export const curriculum: SeedTrack[] = [
  {
    slug: "javascript-dasar",
    title: "JavaScript Dasar",
    description:
      "Fondasi bahasa: variabel, fungsi, array, object, dan async. Wajib kuasai sebelum interview.",
    order: 1,
    modules: [
      {
        slug: "fondasi",
        title: "Fondasi",
        description: "Cara menyimpan nilai dan menulis fungsi.",
        order: 1,
        lessons: [
          { slug: "js-variabel", title: "Variabel: const dan let", order: 1 },
          { slug: "js-fungsi", title: "Fungsi", order: 2 },
        ],
        problems: [
          {
            slug: "jumlah-dua-angka",
            title: "Jumlah dua angka",
            order: 3,
            language: "js",
            difficulty: "easy",
            skillLevel: "beginner",
            functionName: "jumlahDuaAngka",
            tags: ["math", "function"],
            starterCode: `function jumlahDuaAngka(a, b) {
  // kembalikan hasil a + b
}
`,
            sampleTests: [
              { args: [2, 3], expected: 5 },
              { args: [-1, 1], expected: 0 },
            ],
            hiddenTests: [
              { args: [100, 250], expected: 350 },
              { args: [0, 0], expected: 0 },
              { args: [-10, -5], expected: -15 },
            ],
          },
        ],
      },
      {
        slug: "data",
        title: "Data",
        description: "Array dan object — struktur yang paling sering muncul di soal.",
        order: 2,
        lessons: [{ slug: "js-array-object", title: "Array dan object", order: 1 }],
        problems: [
          {
            slug: "nama-dewasa",
            title: "Nama yang sudah dewasa",
            order: 2,
            language: "js",
            difficulty: "easy",
            skillLevel: "beginner",
            functionName: "namaDewasa",
            tags: ["array", "filter", "object"],
            starterCode: `function namaDewasa(orang) {
  // orang: [{ nama: string, usia: number }, ...]
  // kembalikan array nama yang usianya >= 18, urutan tetap
}
`,
            sampleTests: [
              {
                args: [
                  [
                    { nama: "Ani", usia: 17 },
                    { nama: "Budi", usia: 18 },
                  ],
                ],
                expected: ["Budi"],
              },
              {
                args: [[{ nama: "Citra", usia: 21 }]],
                expected: ["Citra"],
              },
            ],
            hiddenTests: [
              { args: [[]], expected: [] },
              {
                args: [
                  [
                    { nama: "Dina", usia: 16 },
                    { nama: "Eko", usia: 15 },
                  ],
                ],
                expected: [],
              },
              {
                args: [
                  [
                    { nama: "Farah", usia: 18 },
                    { nama: "Gilang", usia: 40 },
                    { nama: "Hana", usia: 17 },
                  ],
                ],
                expected: ["Farah", "Gilang"],
              },
            ],
          },
        ],
      },
      {
        slug: "async",
        title: "Async",
        description: "Promise dan async/await — wajib untuk Node dan fetch.",
        order: 3,
        lessons: [{ slug: "js-async", title: "Promise dan async/await", order: 1 }],
        problems: [],
      },
    ],
  },
  {
    slug: "typescript-dasar",
    title: "TypeScript Dasar",
    description: "Type, interface, dan generic sederhana supaya kode interview lebih rapi.",
    order: 2,
    modules: [
      {
        slug: "tipe",
        title: "Tipe",
        description: "Anotasi tipe yang paling sering ditanya.",
        order: 1,
        lessons: [
          { slug: "ts-type-interface", title: "Type dan interface", order: 1 },
          { slug: "ts-generic", title: "Generic sederhana", order: 2 },
        ],
        problems: [
          {
            slug: "hitung-diskon",
            title: "Hitung diskon",
            order: 3,
            language: "ts",
            difficulty: "easy",
            skillLevel: "beginner",
            functionName: "hitungDiskon",
            tags: ["math", "typescript"],
            starterCode: `function hitungDiskon(harga: number, persen: number): number {
  // harga setelah diskon. Contoh: 100 dan 10 → 90
}
`,
            sampleTests: [
              { args: [100, 10], expected: 90 },
              { args: [200, 0], expected: 200 },
            ],
            hiddenTests: [
              { args: [80, 25], expected: 60 },
              { args: [99, 50], expected: 49.5 },
              { args: [50, 100], expected: 0 },
            ],
          },
          {
            slug: "nilai-unik",
            title: "Nilai unik terurut",
            order: 4,
            language: "ts",
            difficulty: "easy",
            skillLevel: "beginner",
            functionName: "nilaiUnik",
            tags: ["array", "set", "sort", "typescript"],
            starterCode: `function nilaiUnik(angka: number[]): number[] {
  // kembalikan nilai unik, diurutkan dari kecil ke besar
}
`,
            sampleTests: [
              { args: [[3, 1, 3, 2]], expected: [1, 2, 3] },
              { args: [[5, 5, 5]], expected: [5] },
            ],
            hiddenTests: [
              { args: [[]], expected: [] },
              { args: [[-1, 3, -1, 2, 3]], expected: [-1, 2, 3] },
              { args: [[10, 0, 10, 0, 4]], expected: [0, 4, 10] },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "interview-algo",
    title: "Interview DS/Algo",
    description:
      "Pola yang sering muncul di technical test: hashmap, two pointers, sliding window, stack.",
    order: 3,
    modules: [
      {
        slug: "array-hashmap",
        title: "Array & hashmap",
        description: "Cari pasangan dan deteksi duplikat tanpa nested loop buta.",
        order: 1,
        lessons: [{ slug: "algo-kompleksitas", title: "Kompleksitas waktu (Big O)", order: 1 }],
        problems: [
          {
            slug: "two-sum",
            title: "Two Sum",
            order: 2,
            language: "js",
            difficulty: "easy",
            skillLevel: "intermediate",
            functionName: "twoSum",
            tags: ["hashmap", "array", "two-sum"],
            starterCode: `function twoSum(nums, target) {
  // kembalikan indeks [i, j] (i < j) yang jumlahnya = target
}
`,
            sampleTests: [
              { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
              { args: [[3, 2, 4], 6], expected: [1, 2] },
            ],
            hiddenTests: [
              { args: [[3, 3], 6], expected: [0, 1] },
              { args: [[0, 4, 3, 0], 0], expected: [0, 3] },
              { args: [[-1, -2, -3, -4, -5], -8], expected: [2, 4] },
            ],
          },
          {
            slug: "contains-duplicate",
            title: "Contains Duplicate",
            order: 3,
            language: "js",
            difficulty: "easy",
            skillLevel: "intermediate",
            functionName: "containsDuplicate",
            tags: ["hashmap", "set", "array"],
            starterCode: `function containsDuplicate(nums) {
  // true jika ada angka yang muncul lebih dari sekali
}
`,
            sampleTests: [
              { args: [[1, 2, 3, 1]], expected: true },
              { args: [[1, 2, 3, 4]], expected: false },
            ],
            hiddenTests: [
              { args: [[]], expected: false },
              { args: [[1]], expected: false },
              { args: [[1, 1]], expected: true },
              { args: [[7, 2, 9, 2, 5]], expected: true },
            ],
          },
        ],
      },
      {
        slug: "pointer-stack",
        title: "Two pointers & stack",
        description: "Dua ujung array, dan tumpukan untuk kurung.",
        order: 2,
        lessons: [{ slug: "algo-two-pointers", title: "Two pointers", order: 1 }],
        problems: [
          {
            slug: "palindrome-valid",
            title: "Valid Palindrome",
            order: 2,
            language: "js",
            difficulty: "easy",
            skillLevel: "intermediate",
            functionName: "isPalindrome",
            tags: ["two-pointers", "string"],
            starterCode: `function isPalindrome(s) {
  // true jika s palindrome setelah huruf kecil dan hanya alfanumerik
}
`,
            sampleTests: [
              { args: ["A man, a plan, a canal: Panama"], expected: true },
              { args: ["race a car"], expected: false },
            ],
            hiddenTests: [
              { args: [" "], expected: true },
              { args: ["0P"], expected: false },
              { args: ["ab_a"], expected: true },
              { args: ["No lemon, no melon"], expected: true },
            ],
          },
          {
            slug: "kurung-valid",
            title: "Valid Parentheses",
            order: 3,
            language: "ts",
            difficulty: "easy",
            skillLevel: "intermediate",
            functionName: "isValidParentheses",
            tags: ["stack", "string", "typescript"],
            starterCode: `function isValidParentheses(s: string): boolean {
  // true jika kurung (), {}, [] seimbang
}
`,
            sampleTests: [
              { args: ["()"], expected: true },
              { args: ["()[]{}"], expected: true },
              { args: ["(]"], expected: false },
            ],
            hiddenTests: [
              { args: ["([)]"], expected: false },
              { args: ["{[]}"], expected: true },
              { args: [""], expected: true },
              { args: ["((((("], expected: false },
              { args: ["]"], expected: false },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "arsitektur",
    title: "Arsitektur",
    description: "Materi baca: layering, API design, caching, scaling — sering muncul di interview sistem.",
    order: 4,
    modules: [
      {
        slug: "dasar-arsitektur",
        title: "Dasar arsitektur",
        description: "Cara menjelaskan desain ke interviewer, bukan cuma menggambar kotak.",
        order: 1,
        lessons: [
          { slug: "ars-layering", title: "Layering: controller, service, repository", order: 1 },
          { slug: "ars-api-scaling", title: "API design, caching, dan scaling", order: 2 },
        ],
        problems: [],
      },
    ],
  },
];
