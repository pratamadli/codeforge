import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getTrackBySlug, summarizeProgress } from "@/lib/data";
import { DIFFICULTY_LABEL, LANGUAGE_LABEL } from "@/lib/labels";

export default async function TrackPage({ params }: { params: Promise<{ track: string }> }) {
  const { track: slug } = await params;
  const user = await getCurrentUser();
  if (!user) return null;
  const track = await getTrackBySlug(slug);
  if (!track) notFound();
  const summary = await summarizeProgress(user.id);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <Link href="/kurikulum" className="text-sm text-muted hover:text-ember">
        ← Semua track
      </Link>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">{track.title}</h1>
      <p className="mt-2 text-muted">{track.description}</p>

      <div className="mt-8 space-y-8">
        {track.modules.map((mod) => (
          <section key={mod.id}>
            <h2 className="text-lg font-medium">{mod.title}</h2>
            <p className="mt-1 mb-3 text-sm text-muted">{mod.description}</p>
            <ul className="divide-y divide-steel-border overflow-hidden rounded-xl border border-steel-border">
              {mod.lessons.map((lesson) => {
                const done = summary.completedLessons.has(lesson.id);
                return (
                  <li key={lesson.id}>
                    <Link
                      href={`/pelajaran/${lesson.slug}`}
                      className="flex items-center justify-between gap-3 bg-steel px-4 py-3 hover:bg-steel-raised"
                    >
                      <span>
                        <span className="mr-2 rounded bg-steel-raised px-2 py-0.5 text-xs text-muted">
                          Materi
                        </span>
                        {lesson.title}
                      </span>
                      <span className={done ? "text-xs text-good" : "text-xs text-muted"}>
                        {done ? "Selesai" : "Baca"}
                      </span>
                    </Link>
                  </li>
                );
              })}
              {mod.problems.map((problem) => {
                const state = summary.problemMap.get(problem.id);
                const badge =
                  state?.status === "solved" ? "Lulus" : state ? "Dicoba" : "Kerjakan";
                return (
                  <li key={problem.id}>
                    <Link
                      href={`/soal/${problem.slug}`}
                      className="flex items-center justify-between gap-3 bg-steel px-4 py-3 hover:bg-steel-raised"
                    >
                      <span>
                        <span className="mr-2 rounded bg-ember/15 px-2 py-0.5 text-xs text-ember-soft">
                          Soal {LANGUAGE_LABEL[problem.language] ?? problem.language}
                        </span>
                        {problem.title}
                        <span className="ml-2 text-xs text-muted">
                          {DIFFICULTY_LABEL[problem.difficulty]}
                        </span>
                      </span>
                      <span
                        className={
                          state?.status === "solved" ? "text-xs text-good" : "text-xs text-muted"
                        }
                      >
                        {badge}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
