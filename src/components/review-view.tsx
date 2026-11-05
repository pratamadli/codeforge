"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CONTEKAN_CARDS } from "@/content/contekan";
import { useLocalProgress } from "@/hooks/use-local-progress";
import { getPracticeList } from "@/lib/stats";
import { emptyReview, gradeCard, loadReview, pickCard, type ReviewGrade, type ReviewState } from "@/lib/review";
import type { TrackTree } from "@/lib/content";

export function ReviewView({ tree }: { tree: TrackTree[] }) {
  const { progress, ready } = useLocalProgress();
  const [state, setState] = useState<ReviewState>(emptyReview);
  const [cardId, setCardId] = useState(CONTEKAN_CARDS[0].id);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadReview();
    setState(stored);
    setCardId(pickCard(CONTEKAN_CARDS, stored.grades).id);
    setHydrated(true);
  }, []);

  const card = CONTEKAN_CARDS.find((item) => item.id === cardId) ?? CONTEKAN_CARDS[0];
  const grade = state.grades[card.id];
  const goyangCount = Object.values(state.grades).filter((g) => g === "goyang").length;

  const ulangan = useMemo(() => {
    if (!ready) return [];
    return getPracticeList(tree, progress).filter((p) => p.status === "attempted");
  }, [ready, tree, progress]);

  function reveal() {
    setOpen(true);
  }

  function mark(next: ReviewGrade) {
    const stored = gradeCard(card.id, next);
    setState(stored);
    const following = pickCard(CONTEKAN_CARDS, stored.grades, card.id);
    setCardId(following.id);
    setOpen(false);
  }

  if (!hydrated) {
    return <div className="mx-auto max-w-2xl px-4 py-8 text-sm text-muted">Memuat review…</div>;
  }

  return (
    <main className="mx-auto max-w-2xl space-y-8 px-4 py-8 lg:px-8">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted">Bab 14.1 · Review</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Contekan cepat</h1>
        <p className="mt-2 text-sm text-muted">
          Bukan pilihan ganda. Jawab lantang seperti di interview, lalu bandingkan jawaban satu
          kalimat. Kartu berikutnya mengutamakan yang masih goyang.
        </p>
      </div>

      <section className="rounded-xl border border-steel-border bg-steel p-6">
        <p className="text-xs text-muted">Jawab lantang dulu, 20–30 detik</p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight">{card.q}</h2>

        {open ? (
          <div className="mt-5 space-y-4">
            <p className="rounded-lg border border-l-4 border-steel-border border-l-[var(--tip-blue)] bg-steel-raised p-4 text-sm leading-relaxed">
              {card.a}
            </p>
            <Link href={card.babHref} className="text-sm text-ember hover:underline">
              Baca materi lengkap · {card.babLabel}
            </Link>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => mark("lancar")}
                className="rounded-md bg-ember px-4 py-2 text-sm font-medium text-black hover:bg-ember-soft"
              >
                Lancar
              </button>
              <button
                type="button"
                onClick={() => mark("goyang")}
                className="rounded-md border border-steel-border px-4 py-2 text-sm hover:border-ember"
              >
                Masih goyang
              </button>
            </div>
            {grade && (
              <p className="text-xs text-muted">
                Penilaian terakhir: {grade === "lancar" ? "Lancar" : "Masih goyang"}
              </p>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={reveal}
            className="mt-6 rounded-md bg-ember px-4 py-2 text-sm font-medium text-black hover:bg-ember-soft"
          >
            Tampilkan jawaban
          </button>
        )}
      </section>

      {goyangCount > 0 && (
        <p className="text-sm text-muted">{goyangCount} kartu masih goyang — diprioritaskan berikutnya.</p>
      )}

      {ulangan.length > 0 && (
        <section>
          <h2 className="text-sm font-medium">Soal ulangan</h2>
          <p className="mt-1 text-sm text-muted">
            Sudah dikumpulkan tapi belum lulus. Besok tulis ulang dari nol tanpa lihat.
          </p>
          <ul className="mt-3 divide-y divide-steel-border overflow-hidden rounded-xl border border-steel-border">
            {ulangan.map((problem) => (
              <li key={problem.slug}>
                <Link
                  href={`/soal/${problem.slug}`}
                  className="block bg-steel px-4 py-3 text-sm hover:bg-steel-raised"
                >
                  {problem.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
