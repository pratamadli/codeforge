# Soal React (materi + pembahasan)

Judge v1 hanya menjalankan **satu fungsi JS/TS** plus tes. Komponen React, hook, dan `fetch` ke API tidak bisa di-sandbox di sini. Kerjakan di IDE/React sendiri, lalu pelajari pembahasan di bawah.

Soal 8–10: `useDebounce` + search tanpa race, `useFetch`, infinite scroll.

## Soal 8 · useDebounce + pencarian tanpa race

Buat hook debounce dan search yang tidak menimpa hasil baru dengan response lama.

### Pembahasan

```js
function useDebounce(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

function Search() {
  const [q, setQ] = useState("");
  const dq = useDebounce(q);
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (!dq) { setItems([]); return; }
    const c = new AbortController();
    fetch(`/api/search?q=${encodeURIComponent(dq)}`, { signal: c.signal })
      .then((r) => r.json())
      .then(setItems)
      .catch((e) => { if (e.name !== "AbortError") console.error(e); });
    return () => c.abort();
  }, [dq]);
  return (
    <>
      <input value={q} onChange={(e) => setQ(e.target.value)} />
      <ul>{items.map((i) => <li key={i.id}>{i.name}</li>)}</ul>
    </>
  );
}
```

Debounce mengurangi request. `AbortController` mencegah hasil lama menimpa hasil baru. Tambahkan state loading dan error untuk nilai lebih.

## Soal 9 · useFetch dengan loading, error, abort

### Pembahasan

```js
function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  useEffect(() => {
    const c = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    fetch(url, { signal: c.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (error.name !== "AbortError") setState({ data: null, loading: false, error });
      });
    return () => c.abort();
  }, [url]);
  return state;
}
```

`fetch` **tidak** melempar untuk 404/500 — cek `r.ok`. Di produksi biasanya TanStack Query; kamu harus paham apa yang library itu lakukan.

## Soal 10 · Infinite scroll

### Pembahasan

```js
function Feed() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const sentinel = useRef(null);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/items?page=${page}`).then((r) => r.json()).then((res) => {
      if (cancelled) return;
      setItems((prev) => [...prev, ...res.items]);
      setDone(res.items.length === 0);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [page]);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !loading && !done) setPage((p) => p + 1);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [loading, done]);
  return (
    <>
      {items.map((i) => <div key={i.id}>{i.name}</div>)}
      <div ref={sentinel} />
    </>
  );
}
```

`IntersectionObserver` lebih efisien daripada event `scroll`. Cleanup observer. Flag `cancelled` agar response halaman lama tidak menimpa. Untuk list sangat panjang, tambah virtualisasi.

## Tips menjawab

Sebut 4 keadaan UI: loading, error, kosong, sukses. Sebut race condition secara eksplisit.

## Sudut pandang senior

Jangan tulis `useFetch` generik di produksi jika tim sudah punya Query library — kecuali interview meminta kamu membangunnya dari nol untuk menunjukkan pemahaman.

## Kesalahan umum

- Tidak abort request lama.
- Mengandalkan `fetch` melempar pada HTTP error.
- Infinite scroll tanpa `done`/`loading` → request beruntun.
- Key pakai index pada list yang bertambah.
