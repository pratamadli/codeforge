import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { summarizeProgress } from "@/lib/data";

export default async function KurikulumPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const summary = await summarizeProgress(user.id);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Kurikulum</h1>
      <p className="mt-1 text-sm text-muted">
        {summary.lessonsDone}/{summary.lessonsTotal} materi · {summary.problemsSolved}/
        {summary.problemsTotal} soal lulus.
      </p>
      <ul className="mt-6 space-y-3">
        {summary.tracks.map((track) => {
          const total = track.lessonsTotal + track.problemsTotal;
          const done = track.lessonsDone + track.problemsSolved;
          const pct = total === 0 ? 0 : Math.round((done / total) * 100);
          return (
            <li key={track.slug}>
              <Link
                href={`/kurikulum/${track.slug}`}
                className="block rounded-xl border border-steel-border bg-steel p-5 hover:border-ember"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-medium">{track.title}</h2>
                    <p className="mt-1 text-sm text-muted">
                      {track.lessonsDone}/{track.lessonsTotal} materi · {track.problemsSolved}/
                      {track.problemsTotal} soal
                    </p>
                  </div>
                  <span className="text-sm text-ember-soft">{pct}%</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-steel-raised">
                  <div className="h-full bg-ember" style={{ width: `${pct}%` }} />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
