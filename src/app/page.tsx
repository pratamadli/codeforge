import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect("/kurikulum");

  return (
    <main className="mx-auto max-w-3xl px-4 py-20">
      <p className="mb-3 text-sm uppercase tracking-[0.18em] text-ember">Codexercise</p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Latihan coding sampai lolos interview.
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted">
        Baca materi dalam bahasa Indonesia, kerjakan soal JS/TS gaya LeetCode di editor, sistem
        menjalankan kodemu sungguhan, lalu buka pembahasan. Progress tersimpan per akun.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/daftar"
          className="rounded-lg bg-ember px-5 py-2.5 font-medium text-black hover:bg-ember-soft"
        >
          Daftar gratis
        </Link>
        <Link
          href="/masuk"
          className="rounded-lg border border-steel-border px-5 py-2.5 hover:border-ember"
        >
          Masuk
        </Link>
      </div>
      <ul className="mt-14 grid gap-4 text-sm sm:grid-cols-2">
        {[
          ["Kurikulum berjenjang", "JS → TS → DS/Algo → arsitektur. Mulai dari yang kecil."],
          ["Judge sungguhan", "Run contoh tes, Submit tes tersembunyi, timeout ~2 detik."],
          ["Pembahasan ramah", "Analogi dulu, baru kode. Muncul setelah submit pertama."],
          ["Progress per user", "Materi selesai dan soal lulus tidak ketuker antar akun."],
        ].map(([title, body]) => (
          <li key={title} className="rounded-xl border border-steel-border bg-steel/50 p-4">
            <p className="font-medium">{title}</p>
            <p className="mt-1 text-muted">{body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
