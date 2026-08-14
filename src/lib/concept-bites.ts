import type { ConceptBite } from "@/lib/types";

export const CONCEPT_BITES: ConceptBite[] = [
  {
    id: "c-var",
    topic: "fundamentals",
    title: "Variabel itu apa?",
    minutes: 3,
    simpleExplanation:
      "Variabel = kotak berlabel tempat kamu simpan data.\n\nContoh: `let umur = 25` artinya kotak bernama 'umur' berisi angka 25. Nanti bisa kamu ganti isinya.\n\n`const` = kotak yang isinya tidak boleh diganti. `let` = boleh diganti.",
    analogy:
      "Seperti sticky note di meja: tulis nama di atas, isi catatan di bawah. Kamu bisa ganti isinya (let) atau tempel permanen (const).",
    interviewTip:
      "Variabel tempat menyimpan data. Pakai const kalau nilainya tidak berubah, let kalau berubah.",
    commonMistake:
      "Hanya sebut 'tempat simpan data' tanpa bedain const vs let — interviewer ingin tahu kamu paham kapan pakai masing-masing.",
    checkQuestions: [
      {
        id: "c-var-1",
        question: "Bedanya const dan let?",
        answer: "const tidak bisa di-assign ulang, let bisa.",
      },
    ],
  },
  {
    id: "c-loop",
    topic: "fundamentals",
    title: "Loop — ulang sampai selesai",
    minutes: 3,
    simpleExplanation:
      "Loop = jalankan kode yang sama berkali-kali.\n\n`for` dipakai kalau kamu tahu mau ulang berapa kali.\n`while` dipakai kalau ulang sampai kondisi terpenuhi.\n\nContoh: cetak angka 1 sampai 5 → for lebih pas.",
    analogy:
      "Seperti mengocok adonan 10 kali. For = hitung '1, 2, 3… 10, selesai'. While = 'adonan belum halus? kocok lagi'.",
    interviewTip:
      "Loop mengulang kode. For untuk jumlah pasti, while untuk kondisi yang belum tentu berapa kali.",
    commonMistake:
      "Tidak bisa kasih contoh kapan pakai for vs while — pilih satu contoh konkret saat diinterview.",
    checkQuestions: [
      {
        id: "c-loop-1",
        question: "Kapan pakai for, kapan while?",
        answer: "For = jumlah iterasi jelas. While = ulang selama kondisi true.",
      },
    ],
  },
  {
    id: "c-func",
    topic: "functions",
    title: "Fungsi — bungkus langkah jadi satu",
    minutes: 4,
    simpleExplanation:
      "Fungsi = resep kecil. Kamu kasih nama, isi langkah-langkah, panggil kapan perlu.\n\nManfaat: tidak menulis ulang kode yang sama, lebih rapi, lebih gampang di-test.\n\nInput = parameter. Output = return value.",
    analogy:
      "Tombol 'rebus air' di rice cooker: sekali tekan, langkah yang sama jalan otomatis.",
    interviewTip:
      "Fungsi memecah kode jadi bagian reusable. Terima input, proses, return hasil.",
    commonMistake:
      "Hanya bilang 'supaya rapi' — tambahkan 'supaya tidak duplikasi dan gampang di-test'.",
    checkQuestions: [
      {
        id: "c-func-1",
        question: "Kenapa pakai fungsi, bukan copy-paste kode?",
        answer: "Hindari duplikasi, lebih mudah dibaca dan di-test.",
      },
    ],
  },
  {
    id: "c-closure",
    topic: "functions",
    title: "Closure — fungsi ingat rumahnya",
    minutes: 5,
    simpleExplanation:
      "Closure = fungsi dalam fungsi yang masih 'ingat' variabel dari fungsi luarnya.\n\nContoh: createCounter() buat variabel count, return fungsi yang menambah count. Fungsi dalam itu masih akses count meski createCounter sudah selesai.",
    analogy:
      "Seperti anak yang sudah pindah kos tapi masih ingat nomor rumah orang tua — fungsi 'anak' ingat variabel 'rumah orang tua'.",
    interviewTip:
      "Closure: fungsi inner masih akses variabel outer meski outer sudah selesai dieksekusi.",
    commonMistake:
      "Menjelaskan terlalu teknis ('lexical environment') — pakai contoh counter atau factory function.",
    checkQuestions: [
      {
        id: "c-closure-1",
        question: "Closure itu apa, dengan satu kalimat?",
        answer: "Fungsi yang masih punya akses ke variabel dari scope tempat dia dibuat.",
      },
    ],
  },
  {
    id: "c-array-object",
    topic: "data-structures",
    title: "Array vs Object",
    minutes: 4,
    simpleExplanation:
      "Array = daftar berurutan. Akses pakai index: [0], [1].\n\nObject = data berlabel. Akses pakai key: user.name, user['age'].\n\nArray untuk list (daftar produk). Object untuk satu entitas dengan banyak atribut (profil user).",
    analogy:
      "Array = antrian nomor di bank. Object = kartu identitas dengan field nama, alamat, umur.",
    interviewTip:
      "Array untuk list terurut, object untuk data dengan key/nama field.",
    commonMistake:
      "Bingung kapan pakai yang mana — ingat: list → array, record/entity → object.",
    checkQuestions: [
      {
        id: "c-array-1",
        question: "Simpan 10 nama mahasiswa — array atau object?",
        answer: "Array, karena list berurutan.",
      },
    ],
  },
  {
    id: "c-big-o",
    topic: "algorithms",
    title: "Big O versi simpel",
    minutes: 4,
    simpleExplanation:
      "Big O = seberapa lambat kode kalau datanya makin banyak.\n\nO(1) = tetap cepat. O(n) = naik seiring jumlah data. O(n²) = makin lambat banget.\n\nInterview sering tanya: 'solusi ini efisien?' — jawab dengan perkiraan Big O.",
    analogy:
      "O(n) = cek satu per satu daftar tamu. O(log n) = buka buku telepon setengah-setengah (binary search).",
    interviewTip:
      "Big O ukur pertumbuhan waktu/ruang saat input membesar. Linear O(n), konstan O(1), kuadrat O(n²).",
    commonMistake:
      "Hafal definisi tanpa contoh — selalu sertakan satu contoh: 'loop satu array = O(n)'.",
    checkQuestions: [
      {
        id: "c-bigo-1",
        question: "Loop sekali lewat array 100 elemen — Big O?",
        answer: "O(n) — linear, proporsional dengan jumlah elemen.",
      },
    ],
  },
  {
    id: "c-async",
    topic: "async",
    title: "Async — tunggu tanpa freeze",
    minutes: 5,
    simpleExplanation:
      "Kode normal jalan atas ke bawah. Operasi lambat (fetch API, baca file) kalau sync akan bikin app nge-freeze.\n\nAsync = mulai pekerjaan, lanjut kode lain, dapat hasil nanti lewat Promise/callback.\n\nasync/await = cara tulis async yang terbaca seperti sync.",
    analogy:
      "Pesan kopi di kiosk: pesan → ambil nomor → duduk dulu → dipanggil saat jadi. Tidak berdiri diam di depan mesin.",
    interviewTip:
      "Async untuk operasi yang butuh waktu (network, I/O) tanpa blocking thread utama.",
    commonMistake:
      "Bilang 'async lebih cepat' — yang benar: non-blocking, app tetap responsif.",
    checkQuestions: [
      {
        id: "c-async-1",
        question: "Kenapa butuh async, bukan tunggu biasa?",
        answer: "Supaya app tidak freeze menunggu operasi lambat seperti network.",
      },
    ],
  },
  {
    id: "c-promise",
    topic: "async",
    title: "Promise — janji hasil nanti",
    minutes: 4,
    simpleExplanation:
      "Promise = wadah 'janji' hasil di masa depan: sukses (resolve) atau gagal (reject).\n\n`.then()` jalan kalau sukses, `.catch()` kalau error.\n\nawait menunggu Promise selesai di dalam fungsi async.",
    analogy:
      "Resi pengiriman paket: belum ada paket sekarang, tapi kamu punya bukti akan dapat nanti.",
    interviewTip:
      "Promise representasi hasil async. Tiga state: pending, fulfilled, rejected.",
    commonMistake:
      "Lupa sebut error handling — sebut .catch() atau try/catch dengan await.",
    checkQuestions: [
      {
        id: "c-promise-1",
        question: "Tiga state Promise?",
        answer: "Pending, fulfilled (sukses), rejected (gagal).",
      },
    ],
  },
  {
    id: "c-rest",
    topic: "patterns",
    title: "REST API — pintu ke server",
    minutes: 4,
    simpleExplanation:
      "REST = cara client (browser/app) minta data ke server lewat HTTP.\n\nGET = ambil data. POST = buat baru. PUT/PATCH = update. DELETE = hapus.\n\nURL = alamat resource. Response biasanya JSON.",
    analogy:
      "Menu restoran: GET = lihat menu, POST = pesan makanan, DELETE = batalkan pesanan.",
    interviewTip:
      "REST memakai HTTP methods pada resource URL. GET baca, POST buat, PUT/PATCH update, DELETE hapus.",
    commonMistake:
      "Campur GET dengan body request atau pakai POST untuk semua — jelaskan per method.",
    checkQuestions: [
      {
        id: "c-rest-1",
        question: "Mau ambil daftar user — method apa?",
        answer: "GET — operasi baca data.",
      },
    ],
  },
];

export function getNextConceptBite(
  completedIds: string[],
  weakTopics?: string[],
): ConceptBite {
  const remaining = CONCEPT_BITES.filter((c) => !completedIds.includes(c.id));
  if (remaining.length === 0) return CONCEPT_BITES[0]!;

  if (weakTopics && weakTopics.length > 0) {
    const match = remaining.find((c) => weakTopics.includes(c.topic));
    if (match) return match;
  }

  return remaining[0]!;
}
