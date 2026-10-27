import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { summarizeProgress } from "@/lib/data";

export default async function ProgressPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const summary = await summarizeProgress(user.id);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Progress</h1>
      <p className="mt-2 text-muted">Hanya milik akun {user.email}. Tidak dipakai user lain.</p>
      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Materi selesai" value={`${summary.lessonsDone}/${summary.lessonsTotal}`} />
        <Stat label="Soal lulus" value={`${summary.problemsSolved}/${summary.problemsTotal}`} />
        <Stat label="Soal dicoba" value={`${summary.problemsAttempted}`} />
        <Stat
          label="Sisa soal"
          value={`${summary.problemsTotal - summary.problemsSolved}`}
        />
      </dl>
      <ul className="mt-8 space-y-3">
        {summary.tracks.map((track) => (
          <li key={track.slug} className="rounded-xl border border-steel-border bg-steel/40 p-4">
            <Link href={`/kurikulum/${track.slug}`} className="font-medium hover:text-ember">
              {track.title}
            </Link>
            <p className="mt-1 text-sm text-muted">
              Materi {track.lessonsDone}/{track.lessonsTotal} · Soal {track.problemsSolved}/
              {track.problemsTotal}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-steel-border bg-steel/40 p-4">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 text-xl font-semibold">{value}</dd>
    </div>
  );
}
