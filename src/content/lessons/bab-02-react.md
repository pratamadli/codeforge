# React: konsep inti sampai concurrent

UI = fungsi dari `(state, props)`. Kalau data berubah, React hitung UI baru dan hanya menyentuh DOM yang berbeda.

## Konsep

### Inti

- **Komponen** — fungsi yang mengembalikan UI.
- **Props** — data parent → child. Satu arah, read-only.
- **State** — data milik komponen. Berubah = render ulang.
- **Virtual DOM + reconciliation** — bandingkan tree lama dan baru.
- **Key** — identitas stabil tiap item list. Jangan pakai index jika list bisa diurutkan/dihapus.

### Hooks utama

| Hook | Fungsi | Catatan |
| --- | --- | --- |
| `useState` | State lokal | Update async/batched. Pakai `setX(prev => prev + 1)` jika bergantung nilai lama. |
| `useEffect` | Efek samping setelah render | Cleanup jika subscribe. Dependency array harus jujur. |
| `useRef` | Nilai tanpa re-render / akses DOM | Mengubah `ref.current` tidak re-render. |
| `useMemo` | Cache hitungan mahal | Jangan di semua tempat. Ukur dulu. |
| `useCallback` | Cache referensi fungsi | Berguna jika dioper ke child yang di-memo. |
| `useContext` | Baca Context | Semua consumer re-render saat value berubah. |
| `useReducer` | State kompleks | Pengganti banyak `useState` yang saling terkait. |

Komponen re-render jika: state berubah, parent re-render (kecuali `React.memo`), context yang dibaca berubah, atau props berubah **referensi**.

```js
// Salah: object baru tiap render
<Child style={{ color: "red" }} onClick={() => save()} />

const style = useMemo(() => ({ color: "red" }), []);
const onClick = useCallback(() => save(), []);
<Child style={style} onClick={onClick} />
```

### useEffect: jebakan paling sering

```js
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/products?q=${q}`, { signal: controller.signal })
    .then((r) => r.json())
    .then(setData)
    .catch((e) => {
      if (e.name !== "AbortError") setError(e);
    });
  return () => controller.abort();
}, [q]);
```

Tanpa cleanup, request lama bisa selesai belakangan dan menimpa hasil baru (*race condition*). Ini pertanyaan favorit interviewer.

### State management

| Jenis data | Alat | Alasan |
| --- | --- | --- |
| UI sementara (modal, input) | `useState` | Hanya relevan di satu tempat |
| Data dari server | TanStack Query / SWR | Cache, refetch, loading/error, dedupe |
| Jarang berubah, dipakai luas | Context | Sederhana, bawaan React |
| Sering berubah, banyak tempat | Redux Toolkit / Zustand | Selector, DevTools |
| Harus bisa di-share lewat URL | Query string | Bisa di-bookmark |
| Form kompleks | React Hook Form | Minim re-render |

Redux dalam 1 menit: store menyimpan state → komponen `dispatch` → reducer murni hitung state baru → `useSelector` update. Redux Toolkit memakai Immer.

### Performa

Ukur dulu dengan Profiler. Lalu: code splitting (`React.lazy` + `Suspense`), virtualisasi list panjang, `React.memo` seperlunya, colocate state, debounce search, Core Web Vitals (LCP, INP, CLS).

Pola baik: controlled vs uncontrolled, custom hook, composition over inheritance, Error Boundary, lifting state up, a11y (button bukan `div onClick`).

### 2.8 Concurrent & React 19

- **Suspense** — fallback selagi menunggu data/kode (lazy). Dasar streaming Next.js.
- **`useTransition`** — update tidak mendesak; input tetap responsif, daftar filter berat menyusul.
- **`useDeferredValue`** — versi nilai yang "tertinggal" agar render berat tidak menghambat ketikan.
- **React 19** — `use()` baca Promise/Context saat render; Actions (`useActionState`, `useFormStatus`); `useOptimistic`; `ref` sebagai prop biasa.
- **Compiler** — memo otomatis saat build; tetap perlu paham konsepnya.
- **StrictMode (dev)** — effect dua kali untuk memunculkan bug cleanup. Normal, bukan bug React.
- **Portal** — render di luar hirarki DOM induk (modal, tooltip) tanpa kehilangan context.

```js
const [optimisticLikes, addLike] = useOptimistic(likes, (cur, n) => cur + n);
async function onLike() {
  addLike(1);
  await likeOnServer(postId); // jika error, nilai kembali
}
```

## Tips menjawab

Pola: definisi 1 kalimat, contoh nyata, jebakan yang pernah kamu temui.

Klasik: "Beda state dan props?", "Kenapa key penting?", "Kapan `useMemo`?", "Cegah re-render berlebih?", "Jelaskan cleanup `useEffect`."

Contoh `useMemo`: *"Saya pakai saat hitungannya terbukti mahal atau butuh referensi object yang stabil. Saya tidak memakainya di mana-mana karena memo punya biaya. Saya ukur dulu."*

## Ownership fitur, bukan tutorial hook

Di JD senior, React adalah setengah dari "build features across frontend and backend". Yang ditanya: bagaimana kamu merancang layar invoice supaya status `pending_payment` jujur, request tidak race, dan error dari API (`OUT_OF_STOCK`) tampil sebagai keputusan bisnis — bukan spinner. Hook hanyalah alat.

## Sudut pandang senior

Pisahkan **server state** (data API) dari **client state** (UI). Mayoritas bug datang dari mencampur keduanya. Server state sebaiknya TanStack Query; Redux sering tidak diperlukan.

- Context: murah, tapi tanpa selector — semua consumer re-render. Aman untuk data jarang berubah.
- Redux Toolkit: tim besar, audit, undo, banyak middleware. Trade-off: lebih banyak konsep.
- Zustand: ringan, selector bawaan. Tim besar perlu disiplin sendiri.

## Kesalahan umum

- Memakai `useEffect` untuk data turunan. Hitung langsung saat render atau `useMemo`.
- Mengubah state langsung (`cart.push(item)`). Buat array baru.
- Dependency array kosong padahal efek memakai state/props → *stale closure*.
- Object/fungsi baru tiap render sehingga `React.memo` sia-sia.
- `dangerouslySetInnerHTML` tanpa sanitasi.
