"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLocalProgress } from "@/hooks/use-local-progress";
import type { TrackTree } from "@/lib/content";
import { DIFFICULTY_LABEL, LANGUAGE_LABEL } from "@/lib/labels";
import { getPracticeList } from "@/lib/stats";

const STATUS: Record<string, string> = {
  solved: "Lulus",
  attempted: "Dicoba",
  open: "Belum",
};

export function LatihanView({ tree }: { tree: TrackTree[] }) {
  const { progress, ready } = useLocalProgress();
  const problems = useMemo(() => getPracticeList(tree, progress), [tree, progress]);
  const solved = problems.filter((p) => p.status === "solved").length;

  if (!ready) {
    return <div className="mx-auto max-w-4xl px-4 py-8 text-sm text-muted">Memuat progress…</div>;
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Latihan</h1>
      <p className="mt-1 text-sm text-muted">
        Soal JS/TS bab 13 yang di-judge. {solved}/{problems.length} lulus.
      </p>
      <ul className="mt-6 divide-y divide-steel-border overflow-hidden rounded-xl border border-steel-border">
        {problems.map((problem) => (
          <li key={problem.slug}>
            <Link
              href={`/soal/${problem.slug}`}
              className="flex items-center justify-between gap-3 bg-steel px-4 py-3 hover:bg-steel-raised"
            >
              <span>
                <span className="text-sm font-medium">{problem.title}</span>
                <span className="mt-0.5 block text-xs text-muted">
                  {problem.trackTitle} · {LANGUAGE_LABEL[problem.language]} ·{" "}
                  {DIFFICULTY_LABEL[problem.difficulty]}
                </span>
              </span>
              <span
                className={`text-xs ${
                  problem.status === "solved"
                    ? "text-good"
                    : problem.status === "attempted"
                      ? "text-ember-soft"
                      : "text-muted"
                }`}
              >
                {STATUS[problem.status]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
