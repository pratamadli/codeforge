import type { AssessmentQuestion, TrainingExercise } from "@/lib/types";

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "q1",
    topic: "fundamentals",
    difficulty: 1,
    type: "multiple-choice",
    question: "Apa output dari kode berikut?\n\nlet x = 5;\nx = x + 3;\nconsole.log(x);",
    options: ["5", "8", "53", "undefined"],
    correctIndex: 1,
    explanation: "Variabel x di-assign ulang: 5 + 3 = 8.",
  },
  {
    id: "q2",
    topic: "fundamentals",
    difficulty: 1,
    type: "multiple-choice",
    question: "Operator mana yang digunakan untuk perbandingan SAMA PERSIS (tipe + nilai)?",
    options: ["==", "===", "=", "!="],
    correctIndex: 1,
    explanation: "=== membandingkan nilai dan tipe. == melakukan type coercion.",
  },
  {
    id: "q3",
    topic: "fundamentals",
    difficulty: 1,
    type: "code-output",
    question: "Apa yang dicetak loop ini?",
    code: "for (let i = 0; i < 3; i++) {\n  console.log(i * 2);\n}",
    options: ["0 1 2", "0 2 4", "2 4 6", "1 2 3"],
    correctIndex: 1,
    explanation: "i = 0,1,2 → i*2 = 0, 2, 4.",
  },
  {
    id: "q4",
    topic: "functions",
    difficulty: 2,
    type: "code-output",
    question: "Apa return value dari fungsi ini?",
    code: "function greet(name = 'World') {\n  return `Hello, ${name}!`;\n}\ngreet();",
    options: ["Hello, undefined!", "Hello, World!", "Hello, !", "Error"],
    correctIndex: 1,
    explanation: "Parameter default 'World' dipakai jika tidak ada argumen.",
  },
  {
    id: "q5",
    topic: "functions",
    difficulty: 2,
    type: "multiple-choice",
    question: "Closure dalam JavaScript berarti…",
    options: [
      "Fungsi yang tidak punya parameter",
      "Fungsi yang mengingat variabel dari scope luarnya",
      "Fungsi yang selalu return undefined",
      "Fungsi yang hanya bisa dipanggil sekali",
    ],
    correctIndex: 1,
    explanation: "Closure = fungsi + referensi ke lexical environment tempat fungsi dibuat.",
  },
  {
    id: "q6",
    topic: "data-structures",
    difficulty: 2,
    type: "code-output",
    question: "Apa isi arr setelah baris terakhir?",
    code: "const arr = [1, 2, 3];\narr.push(4);\narr.pop();\nconsole.log(arr);",
    options: ["[1, 2, 3, 4]", "[1, 2, 3]", "[1, 2]", "[4]"],
    correctIndex: 1,
    explanation: "push(4) lalu pop() → kembali ke [1, 2, 3].",
  },
  {
    id: "q7",
    topic: "data-structures",
    difficulty: 2,
    type: "multiple-choice",
    question: "Cara mengakses nilai object berdasarkan key 'age':",
    code: "const user = { name: 'Ana', age: 25 };",
    options: ["user->age", "user.age atau user['age']", "user(age)", "get user.age"],
    correctIndex: 1,
    explanation: "Dot notation atau bracket notation untuk property object.",
  },
  {
    id: "q8",
    topic: "algorithms",
    difficulty: 2,
    type: "code-output",
    question: "Apa return dari fungsi ini?",
    code: "function sum(arr) {\n  return arr.reduce((a, b) => a + b, 0);\n}\nsum([2, 4, 6]);",
    options: ["246", "12", "[2, 4, 6]", "0"],
    correctIndex: 1,
    explanation: "reduce menjumlahkan: 2+4+6 = 12.",
  },
  {
    id: "q9",
    topic: "algorithms",
    difficulty: 3,
    type: "multiple-choice",
    question: "Kompleksitas waktu rata-rata pencarian di array terurut (binary search) adalah…",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctIndex: 1,
    explanation: "Binary search membagi ruang pencarian setengah setiap iterasi → O(log n).",
  },
  {
    id: "q10",
    topic: "async",
    difficulty: 3,
    type: "multiple-choice",
    question: "Urutan output yang benar:\n\nconsole.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');",
    options: ["A B C D", "A D C B", "A D B C", "C A D B"],
    correctIndex: 1,
    explanation: "Sync dulu (A, D), lalu microtask Promise (C), lalu macrotask setTimeout (B).",
  },
  {
    id: "q11",
    topic: "async",
    difficulty: 3,
    type: "multiple-choice",
    question: "async/await pada dasarnya adalah…",
    options: [
      "Cara menulis kode asynchronous dengan gaya synchronous",
      "Pengganti loop for",
      "Hanya untuk fetch API",
      "Cara membuat variabel global",
    ],
    correctIndex: 0,
    explanation: "async/await adalah syntactic sugar di atas Promise.",
  },
  {
    id: "q12",
    topic: "patterns",
    difficulty: 3,
    type: "multiple-choice",
    question: "Prinsip DRY dalam programming berarti…",
    options: [
      "Don't Repeat Yourself — hindari duplikasi logika",
      "Do Repeat Yourself — ulangi kode untuk kejelasan",
      "Debug Runtime Yearly",
      "Data Returns Yield",
    ],
    correctIndex: 0,
    explanation: "DRY = ekstrak logika berulang ke fungsi/modul reusable.",
  },
];

export const TRAINING_EXERCISES: TrainingExercise[] = [
  {
    id: "ex-b1",
    levels: ["beginner"],
    topic: "fundamentals",
    title: "Cek genap atau ganjil",
    description:
      "Tulis fungsi `isEven(n)` yang return `true` jika n genap, `false` jika ganjil.",
    starterCode: "function isEven(n) {\n  // tulis kode di sini\n}\n",
    hints: [
      "Gunakan operator modulo (%): n % 2 === 0 berarti genap.",
      "Return boolean, bukan string.",
    ],
    tests: [
      { args: [4], expected: true },
      { args: [7], expected: false },
      { args: [0], expected: true },
    ],
    solution: "function isEven(n) {\n  return n % 2 === 0;\n}\n",
  },
  {
    id: "ex-b2",
    levels: ["beginner"],
    topic: "fundamentals",
    title: "FizzBuzz lite",
    description:
      "Tulis fungsi `fizzBuzz(n)` yang return 'Fizz' jika kelipatan 3, 'Buzz' jika kelipatan 5, 'FizzBuzz' jika keduanya, atau angka sebagai string.",
    starterCode: "function fizzBuzz(n) {\n  // tulis kode di sini\n}\n",
    hints: [
      "Cek kelipatan 15 dulu (3 dan 5), baru 3, baru 5.",
      "Return String(n) untuk kasus lain.",
    ],
    tests: [
      { args: [3], expected: "Fizz" },
      { args: [5], expected: "Buzz" },
      { args: [15], expected: "FizzBuzz" },
      { args: [7], expected: "7" },
    ],
    solution:
      "function fizzBuzz(n) {\n  if (n % 15 === 0) return 'FizzBuzz';\n  if (n % 3 === 0) return 'Fizz';\n  if (n % 5 === 0) return 'Buzz';\n  return String(n);\n}\n",
  },
  {
    id: "ex-b3",
    levels: ["beginner", "intermediate"],
    topic: "functions",
    title: "Hitung rata-rata",
    description:
      "Tulis fungsi `average(nums)` yang return rata-rata array angka. Return 0 jika array kosong.",
    starterCode: "function average(nums) {\n  // tulis kode di sini\n}\n",
    hints: [
      "Jika nums.length === 0, return 0.",
      "Jumlahkan dengan reduce, bagi dengan length.",
    ],
    tests: [
      { args: [[2, 4, 6]], expected: 4 },
      { args: [[]], expected: 0 },
      { args: [[10]], expected: 10 },
    ],
    solution:
      "function average(nums) {\n  if (nums.length === 0) return 0;\n  return nums.reduce((a, b) => a + b, 0) / nums.length;\n}\n",
  },
  {
    id: "ex-i1",
    levels: ["intermediate"],
    topic: "data-structures",
    title: "Hapus duplikat",
    description:
      "Tulis fungsi `unique(arr)` yang return array baru tanpa elemen duplikat (pertahankan urutan pertama).",
    starterCode: "function unique(arr) {\n  // tulis kode di sini\n}\n",
    hints: [
      "Set bisa membantu melacak elemen yang sudah ada.",
      "Atau filter dengan indexOf === index.",
    ],
    tests: [
      { args: [[1, 2, 2, 3, 1]], expected: [1, 2, 3] },
      { args: [["a", "b", "a"]], expected: ["a", "b"] },
      { args: [[]], expected: [] },
    ],
    solution:
      "function unique(arr) {\n  return [...new Set(arr)];\n}\n",
  },
  {
    id: "ex-i2",
    levels: ["intermediate"],
    topic: "algorithms",
    title: "Palindrome checker",
    description:
      "Tulis fungsi `isPalindrome(str)` — return true jika string palindrome (abaikan case dan spasi).",
    starterCode: "function isPalindrome(str) {\n  // tulis kode di sini\n}\n",
    hints: [
      "Normalisasi: toLowerCase() dan hapus spasi dengan replace.",
      "Bandingkan dengan reverse string.",
    ],
    tests: [
      { args: ["katak"], expected: true },
      { args: ["hello"], expected: false },
      { args: ["A man a plan a canal Panama"], expected: true },
    ],
    solution:
      "function isPalindrome(str) {\n  const s = str.toLowerCase().replace(/\\s/g, '');\n  return s === s.split('').reverse().join('');\n}\n",
  },
  {
    id: "ex-i3",
    levels: ["intermediate", "advanced"],
    topic: "functions",
    title: "Counter dengan closure",
    description:
      "Tulis fungsi `createCounter()` yang return fungsi. Setiap kali dipanggil, return angka increment (1, 2, 3, …).",
    starterCode: "function createCounter() {\n  // tulis kode di sini\n}\n",
    hints: [
      "Simpan count di variabel dalam scope createCounter.",
      "Return fungsi yang menambah count lalu return nilainya.",
    ],
    tests: [
      { args: [], expected: "counter-test" },
    ],
    solution:
      "function createCounter() {\n  let count = 0;\n  return () => ++count;\n}\n",
  },
  {
    id: "ex-a1",
    levels: ["advanced"],
    topic: "algorithms",
    title: "Two sum",
    description:
      "Tulis fungsi `twoSum(nums, target)` — return indeks dua angka yang jumlahnya target. Asumsi: tepat satu solusi.",
    starterCode: "function twoSum(nums, target) {\n  // tulis kode di sini\n}\n",
    hints: [
      "Gunakan Map: simpan value → index saat iterasi.",
      "Cek apakah target - nums[i] sudah ada di map.",
    ],
    tests: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
    ],
    solution:
      "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (map.has(need)) return [map.get(need), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}\n",
  },
  {
    id: "ex-a2",
    levels: ["advanced", "expert"],
    topic: "async",
    title: "Delay promise",
    description:
      "Tulis fungsi `delay(ms)` yang return Promise resolve setelah ms millisecond.",
    starterCode: "function delay(ms) {\n  // tulis kode di sini\n}\n",
    hints: [
      "Return new Promise dengan callback resolve.",
      "Gunakan setTimeout untuk memanggil resolve.",
    ],
    tests: [
      { args: [10], expected: "delay-test" },
    ],
    solution:
      "function delay(ms) {\n  return new Promise((resolve) => setTimeout(resolve, ms));\n}\n",
  },
  {
    id: "ex-e1",
    levels: ["expert"],
    topic: "patterns",
    title: "Deep clone (JSON-safe)",
    description:
      "Tulis fungsi `deepClone(obj)` yang clone object/array nested (hanya JSON-safe: string, number, boolean, null, array, plain object).",
    starterCode: "function deepClone(obj) {\n  // tulis kode di sini\n}\n",
    hints: [
      "JSON.parse(JSON.stringify(obj)) adalah cara sederhana untuk JSON-safe.",
      "Untuk latihan manual: cek Array.isArray, recurse untuk object.",
    ],
    tests: [
      { args: [{ a: 1, b: { c: 2 } }], expected: { a: 1, b: { c: 2 } } },
      { args: [[1, [2, 3]]], expected: [1, [2, 3]] },
    ],
    solution:
      "function deepClone(obj) {\n  return JSON.parse(JSON.stringify(obj));\n}\n",
  },
];
