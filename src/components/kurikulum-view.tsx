"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLocalProgress } from "@/hooks/use-local-progress";
import type { TrackTree } from "@/lib/content";
import { DIFFICULTY_LABEL, LANGUAGE_LABEL } from "@/lib/labels";
import { summarizeProgress } from "@/lib/stats";

export function KurikulumList({ tree }: { tree: TrackTree[] }) {
  const { progress, ready } = useLocalProgress();
  const summary = useMemo(() => summarizeProgress(tree, progress), [tree, progress]);

  if (!ready) {
    return <div className="mx-auto max-w-4xl px-4 py-8 text-sm text-muted">Memuat progress…</div>;
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Kurikulum</h1>
      <p className="mt-1 text-sm text-muted">
        {summary.lessonsDone}/{summary.lessonsTotal} materi · {summary.problemsSolved}/{summary.problemsTotal}{" "}
        soal lulus. 14 bab latihan MERN plus review contekan. Disimpan di localStorage.
      </p>
      <ul className="mt-6 space-y-3">
        {summary.tracks.map((track) => {
          const total = track.lessonsTotal + track.problemsTotal;
          const done = track.lessonsDone + track.problemsSolved;
          const pct = total === 0 ? 0 : Math.round((done / total) * 100);
          const meta = tree.find((t) => t.slug === track.slug);
          return (
            <li key={track.slug}>
              <Link
                href={`/kurikulum/${track.slug}`}
                className="block rounded-xl border border-steel-border bg-steel p-5 hover:border-ember"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-medium">{track.title}</h2>
                    {meta && <p className="mt-1 text-sm text-muted">{meta.description}</p>}
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

export function TrackView({ track }: { track: TrackTree }) {
  const { progress, ready } = useLocalProgress();
  const completed = new Set(progress.completedLessons);

  if (!ready) {
    return <div className="mx-auto max-w-4xl px-4 py-8 text-sm text-muted">Memuat progress…</div>;
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <Link href="/kurikulum" className="text-sm text-muted hover:text-ember">
        ← Semua track
      </Link>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">{track.title}</h1>
      <p className="mt-2 text-muted">{track.description}</p>

      <div className="mt-8 space-y-8">
        {track.modules.map((mod) => {
          const items = [
            ...mod.lessons.map((lesson) => ({ kind: "lesson" as const, order: lesson.order, lesson })),
            ...mod.problems.map((problem) => ({ kind: "problem" as const, order: problem.order, problem })),
          ].sort((a, b) => a.order - b.order);

          return (
            <section key={mod.slug}>
              <h2 className="text-lg font-medium">{mod.title}</h2>
              <p className="mt-1 mb-3 text-sm text-muted">{mod.description}</p>
              <ul className="divide-y divide-steel-border overflow-hidden rounded-xl border border-steel-border">
                {items.map((item) => {
                  if (item.kind === "lesson") {
                    const done = completed.has(item.lesson.slug);
                    return (
                      <li key={item.lesson.slug}>
                        <Link
                          href={`/pelajaran/${item.lesson.slug}`}
                          className="flex items-center justify-between gap-3 bg-steel px-4 py-3 hover:bg-steel-raised"
                        >
                          <span>
                            <span className="mr-2 rounded bg-steel-raised px-2 py-0.5 text-xs text-muted">
                              Materi
                            </span>
                            {item.lesson.title}
                          </span>
                          <span className={done ? "text-xs text-good" : "text-xs text-muted"}>
                            {done ? "Selesai" : "Baca"}
                          </span>
                        </Link>
                      </li>
                    );
                  }
                  const state = progress.problems[item.problem.slug];
                  const badge = state?.status === "solved" ? "Lulus" : state ? "Dicoba" : "Kerjakan";
                  return (
                    <li key={item.problem.slug}>
                      <Link
                        href={`/soal/${item.problem.slug}`}
                        className="flex items-center justify-between gap-3 bg-steel px-4 py-3 hover:bg-steel-raised"
                      >
                        <span>
                          <span className="mr-2 rounded bg-ember/15 px-2 py-0.5 text-xs text-ember-soft">
                            Soal {LANGUAGE_LABEL[item.problem.language] ?? item.problem.language}
                          </span>
                          {item.problem.title}
                          <span className="ml-2 text-xs text-muted">
                            {DIFFICULTY_LABEL[item.problem.difficulty]}
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
          );
        })}
      </div>
    </main>
  );
}
