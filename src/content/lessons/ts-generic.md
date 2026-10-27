# Generic sederhana

Kadang fungsi yang sama bekerja untuk banyak tipe. Generic adalah **placeholder tipe**.

```ts
function ambilPertama<T>(items: T[]): T | undefined {
  return items[0];
}

ambilPertama([1, 2, 3]); // T = number
ambilPertama(["a", "b"]); // T = string
```

Tanpa generic, kamu terpaksa tulis `any` — dan `any` menghapus manfaat TypeScript.

## Analogi

Kotak makan siang *bento* yang muat apa saja: nasi, buah, atau kue. Label `<T>` = “isi kotak ini seragam.” Kalau kotaknya `T[]`, semua sekat berisi tipe yang sama.

## Yang cukup untuk interview junior/mid

- `<T>` di fungsi dan interface
- Constraint sederhana: `T extends { id: string }`
- Jangan memaksakan generic 3 tingkat di soal array — itu biasanya *over-engineering*
