import type { ConceptBite, TechTrack } from "@/lib/types";
import { compareTracks, TRACK_META } from "@/lib/tracks";

export const CONCEPT_BITES: ConceptBite[] = [
  // ── React (top) ──
  {
    id: "c-react-component",
    track: "react",
    title: "Component & JSX",
    minutes: 4,
    simpleExplanation:
      "Component = bagian UI yang reusable. JSX = syntax mirip HTML di dalam JavaScript.\n\nFunction component: fungsi yang return JSX. Props = input dari parent ke child.\n\nContoh: `<Button label=\"Simpan\" />` — Button terima prop `label`.",
    analogy:
      "Component seperti LEGO block — satukan block kecil jadi UI besar. Props seperti stiker label di kotak LEGO.",
    interviewTip:
      "Component reusable UI unit. Props readonly dari parent. Function component return JSX.",
    commonMistake:
      "Bingung JSX vs HTML — JSX butuh className (bukan class), satu root element atau Fragment.",
    checkQuestions: [
      {
        id: "c-react-component-1",
        question: "Apa beda props dan state?",
        answer: "Props dari parent (readonly). State internal component (bisa berubah).",
      },
    ],
  },
  {
    id: "c-react-hooks",
    track: "react",
    title: "Hooks: useState & useEffect",
    minutes: 5,
    simpleExplanation:
      "useState = simpan data yang bisa berubah. UI re-render saat state berubah.\n\nuseEffect = jalankan side effect (fetch, subscribe) setelah render.\n\nDependency array [] = jalan sekali. [value] = jalan saat value berubah.",
    analogy:
      "useState = papan skor di game. useEffect = alarm yang bunyi setelah layar tampil.",
    interviewTip:
      "useState untuk state lokal. useEffect untuk side effect — selalu sebut dependency array.",
    commonMistake:
      "Lupa dependency array → infinite loop atau stale data. Sebutkan kapan perlu cleanup return.",
    checkQuestions: [
      {
        id: "c-react-hooks-1",
        question: "useEffect(() => {}, []) artinya?",
        answer: "Jalan sekali setelah mount — seperti componentDidMount.",
      },
    ],
  },
  {
    id: "c-react-render",
    track: "react",
    title: "Re-render & memo",
    minutes: 4,
    simpleExplanation:
      "React re-render component saat state/props berubah.\n\nReact.memo = skip re-render kalau props sama.\n\nuseMemo/useCallback = cache nilai/fungsi supaya referensi stabil.",
    analogy:
      "Re-render = gambar ulang papan. memo = skip gambar ulang kalau isi papan sama persis.",
    interviewTip:
      "Re-render triggered by state/props change. memo/useMemo/useCallback untuk optimasi selektif, bukan default.",
    commonMistake:
      "Over-memoize semua — optimasi prematur. Pakai setelah ada masalah performance nyata.",
    checkQuestions: [
      {
        id: "c-react-render-1",
        question: "Kapan React re-render component?",
        answer: "Saat state atau props-nya berubah, atau parent re-render (kecuali di-memo).",
      },
    ],
  },

  // ── Next.js (top) ──
  {
    id: "c-next-app-router",
    track: "next",
    title: "App Router basics",
    minutes: 5,
    simpleExplanation:
      "Next.js App Router pakai folder `app/`.\n\n`page.tsx` = halaman. `layout.tsx` = wrapper shared. `loading.tsx` = skeleton.\n\nRoute = struktur folder: `app/blog/[slug]/page.tsx` → /blog/hello.",
    analogy:
      "Folder app/ seperti peta gedung — setiap lantai (folder) punya ruangan (page) sendiri.",
    interviewTip:
      "App Router file-based: page, layout, loading, error per segment. Dynamic route pakai [param].",
    commonMistake:
      "Campur Pages Router (pages/) dengan App Router tanpa paham perbedaan data fetching.",
    checkQuestions: [
      {
        id: "c-next-app-1",
        question: "File apa yang jadi halaman /about?",
        answer: "app/about/page.tsx",
      },
    ],
  },
  {
    id: "c-next-rsc",
    track: "next",
    title: "Server vs Client Component",
    minutes: 5,
    simpleExplanation:
      "Default di App Router = Server Component (jalan di server).\n\n`'use client'` = Client Component (interaktif, hooks, event).\n\nServer: fetch DB, no bundle JS ke client. Client: onClick, useState, useEffect.",
    analogy:
      "Server Component = dapur (masak di belakang). Client Component = meja tamu (interaksi langsung).",
    interviewTip:
      "Server Component default — data fetching di server, less JS. Client untuk interactivity. Pisahkan seperlunya.",
    commonMistake:
      "Taruh 'use client' di root layout — bloat bundle. Keep client boundary rendah.",
    checkQuestions: [
      {
        id: "c-next-rsc-1",
        question: "Kapan wajib 'use client'?",
        answer: "Butuh hooks, event handler, browser API, atau state interaktif.",
      },
    ],
  },

  // ── Node.js (top) ──
  {
    id: "c-node-runtime",
    track: "node",
    title: "Node.js itu apa?",
    minutes: 4,
    simpleExplanation:
      "Node.js = JavaScript di server (bukan browser).\n\nV8 engine + libuv untuk I/O async.\n\nCommonJS (require) vs ESM (import) — modern pakai import.",
    analogy:
      "Browser = panggung depan (UI). Node = dapur (backend, file, database).",
    interviewTip:
      "Node = JS runtime di server. Single-threaded event loop, non-blocking I/O untuk concurrent requests.",
    commonMistake:
      "Bilang Node multi-thread untuk JS — JS single-thread, I/O async via thread pool libuv.",
    checkQuestions: [
      {
        id: "c-node-1",
        question: "Node.js cocok untuk apa?",
        answer: "I/O-heavy apps: API, realtime, streaming — bukan CPU-heavy computation.",
      },
    ],
  },
  {
    id: "c-node-event-loop",
    track: "node",
    title: "Event loop Node",
    minutes: 5,
    simpleExplanation:
      "Event loop = antrian tugas async.\n\nUrutan: sync code → microtasks (Promise) → macrotasks (setTimeout, I/O callback).\n\nBlocking sync code = freeze server.",
    analogy:
      "Kasir restoran: terima order (sync), masak di dapur async, panggil nomor saat siap.",
    interviewTip:
      "Event loop handles async callbacks. Avoid sync blocking. Promise microtask before setTimeout.",
    commonMistake:
      "CPU-heavy loop di main thread — block event loop, semua request freeze.",
    checkQuestions: [
      {
        id: "c-node-el-1",
        question: "Apa bahaya while(true) di route handler?",
        answer: "Block event loop — server tidak bisa handle request lain.",
      },
    ],
  },

  // ── Testing (top) ──
  {
    id: "c-test-vitest",
    track: "testing",
    title: "Vitest basics",
    minutes: 4,
    simpleExplanation:
      "Vitest = test runner cepat (compatible Jest API).\n\n`describe` = grup test. `it`/`test` = satu case. `expect` = assertion.\n\n`npm run test` — watch mode untuk dev.",
    analogy:
      "Vitest = checklist quality control sebelum produk keluar gudang.",
    interviewTip:
      "Vitest: describe/it/expect. Fast, ESM-native, Jest-compatible. Unit test isolasi satu fungsi/module.",
    commonMistake:
      "Test terlalu banyak mock — test jadi tidak percaya. Test behavior, bukan implementation detail.",
    checkQuestions: [
      {
        id: "c-test-v-1",
        question: "Bedanya unit vs integration test?",
        answer: "Unit = satu unit isolasi. Integration = beberapa bagian bekerja bersama.",
      },
    ],
  },
  {
    id: "c-test-rtl",
    track: "testing",
    title: "React Testing Library",
    minutes: 5,
    simpleExplanation:
      "RTL = test component seperti user.\n\nQuery by role/label/text — bukan by class/id internal.\n\nrender(<App />) → screen.getByRole('button') → fireEvent.click → expect(...).",
    analogy:
      "RTL = QA tester yang klik tombol seperti user biasa, bukan bongkar mesin (implementation).",
    interviewTip:
      "RTL: test user behavior, query accessible roles/labels. Avoid testing internal state directly.",
    commonMistake:
      "getByTestId untuk semua — prefer getByRole, getByLabelText untuk accessibility.",
    checkQuestions: [
      {
        id: "c-test-rtl-1",
        question: "Kenapa getByRole lebih baik dari testId?",
        answer: "Mendorong accessible UI dan test seperti user nyata.",
      },
    ],
  },

  // ── TypeScript (top) ──
  {
    id: "c-ts-basic",
    track: "typescript",
    title: "Type dasar TS",
    minutes: 4,
    simpleExplanation:
      "TypeScript = JavaScript + type checking saat compile.\n\n`: string`, `: number`, `: boolean` — annotasi type.\n\nInterface/type alias untuk shape object.\n\nCompile error sebelum runtime.",
    analogy:
      "TS = label di kotak: 'isi harus angka' — salah isi ketahuan sebelum dikirim.",
    interviewTip:
      "TS adds static types. interface for object shapes. Catches errors at compile time, better IDE support.",
    commonMistake:
      "Pakai `any` everywhere — defeats purpose. Prefer unknown + narrowing untuk data eksternal.",
    checkQuestions: [
      {
        id: "c-ts-1",
        question: "Bedanya interface dan type?",
        answer: "Keduanya define shape. interface extendable/mergeable, type lebih fleksibel untuk union.",
      },
    ],
  },
  {
    id: "c-ts-generics",
    track: "typescript",
    title: "Generics singkat",
    minutes: 5,
    simpleExplanation:
      "Generic = type parameter — fungsi/type yang fleksibel tapi tetap type-safe.\n\n`function identity<T>(x: T): T`\n\nArray<T>, Promise<T> — T diganti saat dipakai.",
    analogy:
      "Generic = cetakan kue — bentuk sama, isi bisa coklat/vanila (type berbeda).",
    interviewTip:
      "Generics reuse logic with type safety. Common: Array<T>, API response wrapper, utility functions.",
    commonMistake:
      "Terlalu kompleks nested generics di interview — jelaskan dengan contoh sederhana identity atau Array.",
    checkQuestions: [
      {
        id: "c-ts-gen-1",
        question: "Apa arti Promise<User>?",
        answer: "Promise yang resolve ke object bertype User.",
      },
    ],
  },

  // ── Express (top) ──
  {
    id: "c-express-routing",
    track: "express",
    title: "Express routing",
    minutes: 4,
    simpleExplanation:
      "Express = framework minimal Node untuk HTTP API.\n\n`app.get('/users', handler)` — route + method.\n\nreq.params (URL), req.query (?search=), req.body (POST JSON).",
    analogy:
      "Express = resepsionis hotel: arahkan tamu (request) ke kamar yang tepat (handler).",
    interviewTip:
      "Express maps HTTP method + path to handler. params, query, body for input. res.json() for response.",
    commonMistake:
      "Lupa body parser middleware — req.body undefined tanpa express.json().",
    checkQuestions: [
      {
        id: "c-express-1",
        question: "GET /users/42 — params.id?",
        answer: "42 (dari route /users/:id).",
      },
    ],
  },
  {
    id: "c-express-middleware",
    track: "express",
    title: "Middleware chain",
    minutes: 5,
    simpleExplanation:
      "Middleware = fungsi (req, res, next) di antara request dan response.\n\nAuth check, logging, parse body — jalankan berurutan.\n\nPanggil next() untuk lanjut, atau res.status().json() untuk stop.",
    analogy:
      "Middleware = security check di bandara — satu per satu sebelum ke gate.",
    interviewTip:
      "Middleware pipeline: req flows through functions. next() continues, or send response to end.",
    commonMistake:
      "Lupa next() — request hang forever. Error middleware butuh 4 params (err, req, res, next).",
    checkQuestions: [
      {
        id: "c-express-mw-1",
        question: "Apa yang terjadi kalau lupa next()?",
        answer: "Request hang — tidak sampai ke handler berikutnya.",
      },
    ],
  },

  // ── Performance (top) ──
  {
    id: "c-perf-react",
    track: "performance",
    title: "Optimasi React",
    minutes: 5,
    simpleExplanation:
      "1. Profiling dulu — jangan tebak.\n2. Code split (dynamic import, lazy).\n3. memo / useMemo / useCallback selektif.\n4. Virtual list untuk list panjang.\n5. Hindari inline object/function di props tanpa perlu.",
    analogy:
      "Optimasi = buka lebar jalan macet — ukur dulu di mana macet, baru perbaiki titik itu.",
    interviewTip:
      "Measure first (React DevTools Profiler). Code splitting, memoization selective, avoid unnecessary re-renders.",
    commonMistake:
      "Langsung memo semua tanpa profiling — complexity tanpa benefit.",
    checkQuestions: [
      {
        id: "c-perf-1",
        question: "Langkah pertama optimasi React?",
        answer: "Measure/profil — identifikasi bottleneck nyata.",
      },
    ],
  },
  {
    id: "c-perf-web",
    track: "performance",
    title: "Web vitals & caching",
    minutes: 4,
    simpleExplanation:
      "LCP = loading konten utama. INP/FID = interactivity. CLS = layout shift.\n\nCaching: browser cache, CDN, stale-while-revalidate.\n\nNext.js: Image optimization, static generation, ISR.",
    analogy:
      "Web vitals = skor kesehatan website — loading, responsif, stabil visual.",
    interviewTip:
      "Core Web Vitals: LCP, INP, CLS. Optimize images, cache static assets, reduce JS bundle.",
    commonMistake:
      "Hanya fokus Lighthouse score tanpa real user metrics (RUM).",
    checkQuestions: [
      {
        id: "c-perf-wv-1",
        question: "CLS itu apa?",
        answer: "Cumulative Layout Shift — seberapa banyak layout 'loncat' saat load.",
      },
    ],
  },

  // ── NestJS (mid) ──
  {
    id: "c-nest-di",
    track: "nestjs",
    title: "NestJS & Dependency Injection",
    minutes: 5,
    simpleExplanation:
      "NestJS = framework Node structured (mirip Angular).\n\nModule = grup feature. Provider = service injectable. Controller = handle HTTP.\n\nDI = Nest inject dependency otomatis via constructor.",
    analogy:
      "Nest = pabrik terorganisir: modul = departemen, DI = HR assign staff ke project.",
    interviewTip:
      "Nest: Module/Controller/Provider. DI via constructor injection — testable, decoupled.",
    commonMistake:
      "Manual new Service() di controller — bypass DI, susah di-test.",
    checkQuestions: [
      {
        id: "c-nest-1",
        question: "Apa fungsi @Injectable()?",
        answer: "Mark class sebagai provider yang bisa di-inject Nest DI container.",
      },
    ],
  },

  // ── Nuxt (mid) ──
  {
    id: "c-nuxt-basics",
    track: "nuxt",
    title: "Nuxt 3 basics",
    minutes: 4,
    simpleExplanation:
      "Nuxt = meta-framework Vue (seperti Next untuk React).\n\nFile-based routing di pages/. Auto import composables.\n\nSSR/SSG/SPA mode configurable.",
    analogy:
      "Nuxt = Next.js versi Vue — routing + SSR out of the box.",
    interviewTip:
      "Nuxt: Vue meta-framework, file routing, SSR/SSG, composables auto-import.",
    commonMistake:
      "Bingung Nuxt vs Vue — Nuxt adds routing, SSR, build conventions on top of Vue.",
    checkQuestions: [
      {
        id: "c-nuxt-1",
        question: "Nuxt vs Vue vanilla?",
        answer: "Nuxt adds SSR, routing, conventions; Vue is UI library only.",
      },
    ],
  },

  // ── Flutter (mid) ──
  {
    id: "c-flutter-widget",
    track: "flutter",
    title: "Widget tree Flutter",
    minutes: 4,
    simpleExplanation:
      "Flutter UI = tree of widgets. Everything is widget.\n\nStatelessWidget = UI statis. StatefulWidget = UI bisa berubah (setState).\n\nComposition: Column, Row, Container, Text.",
    analogy:
      "Widget tree = matryoshka doll — widget besar berisi widget kecil.",
    interviewTip:
      "Flutter: everything is widget. Stateless vs Stateful. setState triggers rebuild subtree.",
    commonMistake:
      "Rebuild seluruh tree tanpa const/extract widget — performance issue.",
    checkQuestions: [
      {
        id: "c-flutter-1",
        question: "Kapan StatefulWidget?",
        answer: "UI berubah over time — form input, animation, toggle.",
      },
    ],
  },

  // ── Go (low) ──
  {
    id: "c-go-goroutine",
    track: "go",
    title: "Goroutine singkat",
    minutes: 4,
    simpleExplanation:
      "Goroutine = lightweight thread di Go. `go funcName()` — jalan concurrent.\n\nChannel = pipe komunikasi antar goroutine.\n\n`go` keyword — concurrency built-in, bukan library.",
    analogy:
      "Goroutine = banyak pegawai kecil kerja paralel. Channel = conveyor belt antar pegawai.",
    interviewTip:
      "Goroutines lightweight concurrency. Channels for communication. go keyword spawns goroutine.",
    commonMistake:
      "Share memory tanpa sync — race condition. Prefer channels or sync primitives.",
    checkQuestions: [
      {
        id: "c-go-1",
        question: "Apa fungsi channel?",
        answer: "Komunikasi aman antar goroutine — pass data, sync.",
      },
    ],
  },

  // ── Laravel (low) ──
  {
    id: "c-laravel-mvc",
    track: "laravel",
    title: "Laravel MVC",
    minutes: 4,
    simpleExplanation:
      "Laravel = PHP framework MVC.\n\nRoute → Controller → Model (Eloquent ORM) → View (Blade).\n\nArtisan CLI, migration, middleware mirip Express.",
    analogy:
      "Laravel = pabrik PHP terstruktur — route resepsionis, controller manajer, model gudang data.",
    interviewTip:
      "Laravel MVC: routes to controllers, Eloquent ORM for DB, Blade templates. Artisan for CLI tasks.",
    commonMistake:
      "Fat controller — logic harusnya di service/model, controller tipis.",
    checkQuestions: [
      {
        id: "c-laravel-1",
        question: "Eloquent itu apa?",
        answer: "ORM Laravel — model represent table DB, query dengan PHP syntax.",
      },
    ],
  },

  // ── Python (low) ──
  {
    id: "c-python-basics",
    track: "python",
    title: "Python essentials",
    minutes: 4,
    simpleExplanation:
      "Python = interpreted, indent-based syntax.\n\nlist = [1,2], dict = {'key': 'val'}.\n\ndef, class, import module.\n\nasync/await untuk asyncio (I/O async).",
    analogy:
      "Python = bahasa readable — pseudocode yang benar-benar jalan.",
    interviewTip:
      "Python: dynamic typing, list/dict core structures, indent syntax, great for scripting and data.",
    commonMistake:
      "Mutable default args — def f(x=[]) shares list across calls.",
    checkQuestions: [
      {
        id: "c-python-1",
        question: "list vs tuple?",
        answer: "list mutable, tuple immutable.",
      },
    ],
  },
];

export function getNextConceptBite(
  completedIds: string[],
  weakTracks?: TechTrack[],
): ConceptBite {
  const remaining = CONCEPT_BITES.filter((c) => !completedIds.includes(c.id));
  if (remaining.length === 0) return CONCEPT_BITES[0]!;

  remaining.sort((a, b) => compareTracks(a.track, b.track));

  if (weakTracks && weakTracks.length > 0) {
    const match = remaining.find((c) => weakTracks.includes(c.track));
    if (match) return match;
  }

  return remaining[0]!;
}

export function conceptsForTrack(track: TechTrack): ConceptBite[] {
  return CONCEPT_BITES.filter((c) => c.track === track);
}

export function conceptCountByPriority(): Record<string, number> {
  const counts = { top: 0, mid: 0, low: 0 };
  for (const concept of CONCEPT_BITES) {
    counts[TRACK_META[concept.track].priority] += 1;
  }
  return counts;
}
