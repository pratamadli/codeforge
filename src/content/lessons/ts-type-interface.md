# Type dan interface

TypeScript menambahkan **kontrak** di atas JavaScript. Kamu memberitahu bentuk data, compiler mengomel sebelum runtime.

```ts
type User = {
  nama: string;
  usia: number;
};

interface Produk {
  id: string;
  harga: number;
}

function label(user: User): string {
  return `${user.nama} (${user.usia})`;
}
```

## `type` vs `interface`

Untuk object, keduanya hampir sama. Aturan praktis:

- `interface` — bentuk object yang mungkin di-*extend*.
- `type` — union, primitive alias, atau kombinasi (`string | null`).

Interviewer tidak mencari dogmatis. Yang dinilai: kamu bisa menulis kontrak yang jelas.

## Analogi

Type = cetakan kue. Adonan (nilai JS) harus muat di cetakan. Kalau kamu tuang kerikil ke cetakan donat, TypeScript protes saat compile, bukan saat tamu gigit.
