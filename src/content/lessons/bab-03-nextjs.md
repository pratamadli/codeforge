# Next.js App Router

Next.js adalah React plus routing, rendering di server, optimasi gambar/font, API route, dan caching. Detail caching berubah antar versi — sebutkan bahwa kamu cek dokumentasi versi perusahaan.

## Konsep

### Strategi rendering

| Strategi | Kapan HTML dibuat | Cocok untuk | Trade-off |
| --- | --- | --- | --- |
| CSR | Di browser | Dashboard di balik login | Initial load lambat, SEO lemah |
| SSR | Tiap request | Data personal / selalu baru + SEO | Beban server, TTFB lebih lambat |
| SSG | Saat build | Blog, docs, landing | Data bisa basi |
| ISR | Build + dibuat ulang berkala | Katalog, artikel | Ada jeda stale |

Di App Router kombinasi ini diatur **per halaman atau per fetch**, bukan satu pilihan untuk seluruh app.

### Server vs Client Component

- **Server Component** (default): dirender di server, tidak mengirim JS komponen itu ke browser. Boleh akses DB/secret. Tidak bisa `useState` / `useEffect` / event handler.
- **Client Component** (`'use client'`): interaktif di browser.
- Aturan praktis: Client Component **sekecil mungkin** di ujung tree (tombol, form). Sisanya tetap Server Component.

```tsx
// app/products/[id]/page.tsx  (Server Component)
export default async function Page({ params }) {
  const { id } = await params;
  const product = await db.product.findById(id);
  return (
    <>
      <h1>{product.name}</h1>
      <AddToCartButton productId={id} />
    </>
  );
}
```

Fitur penting: file-based routing (`page`, `layout`, `loading`, `error`, `not-found`), Route Handler, Server Actions, middleware (jaga tetap ringan), `next/image`, `next/font`, Metadata API, streaming + Suspense.

### Caching: 3 lapis

1. Cache data/fetch di server (revalidate waktu atau tag).
2. Cache halaman/rute (HTML / RSC payload).
3. Cache browser dan CDN (`Cache-Control`, router cache).

Jawaban aman: *"Saya selalu menetapkan cache dan revalidate secara eksplisit, dan mengetes bahwa data tidak basi di skenario penting."*

Next 15: fetch tidak lagi di-cache default. Next 16: Cache Components (`'use cache'`). Satu pemakaian `cookies()` / `headers()` / `searchParams` bisa membuat rute dinamis.

### Auth di App Router

- Session di cookie HttpOnly, Secure, SameSite.
- Middleware hanya cek ringan. Bukan satu-satunya benteng.
- Otorisasi sedekat mungkin dengan data: Server Component, Route Handler, Server Action (Data Access Layer).
- Jangan kirim data sensitif ke Client Component lewat props.

Hindari waterfall: `Promise.all` untuk fetch yang tidak saling bergantung.

## Tips menjawab

Klasik: "SSR vs SSG vs ISR?", "Apa hydration?", "Server vs Client Component?", "SEO di Next?", "Optimasi LCP?"

LCP: gambar utama `next/image` + `priority`, font via `next/font`, kurangi JS client, stream konten, manfaatkan CDN.

Hydration: React di browser "menghidupkan" HTML server dengan menempelkan event handler dan state.

## Sudut pandang senior

Halaman daftar/detail produk: ISR atau cache + revalidate. SEO bagus, CDN cepat, beban server rendah.

Harga/stok real-time: jangan di-cache. Ambil di client atau Server Component dinamis kecil, kerangka halaman tetap statis.

Cart, akun, checkout: dinamis/CSR — personal, tidak perlu SEO.

Prinsip: **statis sebanyak mungkin, dinamis seperlunya.**

## Kesalahan umum

- `'use client'` di layout paling atas → seluruh app jadi client-side.
- Secret di Client Component atau `NEXT_PUBLIC_*` (itu publik).
- Hydration mismatch: `Date.now()` / `window` saat render.
- Menganggap Server Action otomatis aman. Tetap validasi + cek login di dalamnya.
- Waterfall fetch yang seharusnya paralel.
