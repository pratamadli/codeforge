# TypeScript yang ditanya di interview

TypeScript = JavaScript + tipe statis. Tipe hanya ada saat development/build, lalu dihapus (*type erasure*). Saat jalan tetap JS, jadi **tipe tidak melindungi data dari API/user**. Untuk itu validasi runtime (Zod).

## Konsep

Mengapa: tangkap bug sebelum jalan, autocomplete/refactor aman, kontrak FE–BE jadi dokumentasi hidup.

| Konsep | Inti |
| --- | --- |
| `interface` vs `type` | Interface bisa extends + declaration merging. Type untuk union, tuple, tipe turunan. |
| Union & narrowing | `typeof`, `in`, `===` mempersempit. |
| Discriminated union | Field penanda (`status`) agar TS tahu bentuk tiap kasus. |
| Generics | `function first<T>(a: T[]): T \| undefined` |
| `unknown` vs `any` | `any` mematikan cek. `unknown` harus dipersempit. Pilih `unknown`. |
| `never` | Exhaustive check: semua kasus union tertangani. |
| `as const` / `satisfies` | Literal read-only / cek tanpa melebarkan tipe. |

Utility: `Partial`, `Required`, `Pick`, `Omit`, `Record`, `ReturnType`, `Parameters`, `Awaited`, `Readonly`.

```ts
type Result<T> =
  | { status: "ok"; data: T }
  | { status: "error"; message: string };

function handle(r: Result<User>) {
  if (r.status === "ok") return r.data.name;
  return r.message;
}

const UserSchema = z.object({ id: z.string(), email: z.string().email() });
type User = z.infer<typeof UserSchema>;
```

Satu sumber kebenaran: skema Zod, tipe diturunkan darinya.

Di React: `useState<User | null>(null)`, `useRef<HTMLInputElement>(null)`, props = tipe sendiri `& React.ComponentPropsWithoutRef<"button">`.

## Tips menjawab

Klasik: "interface vs type?", "any vs unknown?", "Contoh generics", "Mengetik hasil API?", "Type guard?", "Mengapa tipe tidak menjamin runtime?"

Jawaban runtime: *"TS dihapus saat compile. Saya validasi di batas sistem dengan Zod, lalu `z.infer` supaya tipe dan runtime tidak divergensi."*

## Sudut pandang senior

Tipe yang terlalu pintar (conditional type 4 lapis) adalah utang. Jika manusia sulit membacanya, sederhanakan. Kontrak API lebih aman sebagai skema bersama, bukan `as ApiResponse` di setiap fetch.

## Kesalahan umum

- `any` atau `as` untuk membungkam error — bug pindah ke runtime.
- Percaya bentuk API tanpa validasi.
- Tipe terlalu rumit.
- `strict` dimatikan supaya "lebih cepat ngetik".
