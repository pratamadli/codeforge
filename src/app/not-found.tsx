import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-muted">Cek URL, atau kembali ke dasbor.</p>
      <Link href="/dashboard" className="mt-6 inline-block text-ember hover:underline">
        Ke dasbor
      </Link>
    </main>
  );
}
