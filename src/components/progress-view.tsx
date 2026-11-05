"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLocalProgress } from "@/hooks/use-local-progress";
import type { TrackTree } from "@/lib/content";
import { summarizeProgress } from "@/lib/stats";

export function ProgressView({ tree }: { tree: TrackTree[] }) {
  const { progress, ready } = useLocalProgress();
  const summary = useMemo(() => summarizeProgress(tree, progress), [tree, progress]);

  if (!ready) {
    return <div className="mx-auto max-w-3xl px-4 py-8 text-sm text-muted">Memuat progress…</div>;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Progress</h1>
      <p className="mt-1 text-sm text-muted">
        Materi, soal, dan review tersimpan di localStorage browser ini. Tidak ada akun — hapus data
        situs jika ingin mulai ulang.
      </p>
      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Materi selesai" value={`${summary.lessonsDone}/${summary.lessonsTotal}`} />
        <Stat label="Soal lulus" value={`${summary.problemsSolved}/${summary.problemsTotal}`} />
        <Stat label="Soal dicoba" value={`${summary.problemsAttempted}`} />
        <Stat label="Sisa soal" value={`${summary.problemsTotal - summary.problemsSolved}`} />
      </dl>
      <ul className="mt-6 space-y-3">
        {summary.tracks.map((track) => (
          <li key={track.slug} className="rounded-xl border border-steel-border bg-steel p-4">
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
    <div className="rounded-xl border border-steel-border bg-steel p-4">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 text-xl font-semibold">{value}</dd>
    </div>
  );
}
