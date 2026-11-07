"use client";

import Link from "next/link";
import { useEffect } from "react";
import { FlashDrill } from "@/components/flash-drill";
import { LessonCompleteButton } from "@/components/lesson-complete-button";
import { LessonPlayer } from "@/components/lesson-player";
import { Markdown } from "@/components/markdown";
import { STUDI_KASUS } from "@/content/studi-kasus";
import { useLocalProgress } from "@/hooks/use-local-progress";

export function LessonView({
  slug,
  title,
  markdown,
  moduleTitle,
  trackSlug,
  trackTitle,
}: {
  slug: string;
  title: string;
  markdown: string;
  moduleTitle: string;
  trackSlug: string;
  trackTitle: string;
}) {
  const { progress, ready, completeLesson, touch } = useLocalProgress();
  const done = progress.completedLessons.includes(slug);

  useEffect(() => {
    if (ready) touch("lesson", slug);
  }, [ready, slug, touch]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <Link href={`/kurikulum/${trackSlug}`} className="text-sm text-muted hover:text-ember">
        ← {trackTitle}
      </Link>
      <p className="mt-3 text-xs uppercase tracking-wide text-muted">{moduleTitle}</p>
      <h1 className="sr-only">{title}</h1>
      <div className="mt-4">
        <LessonPlayer slug={slug}>
          <Markdown content={markdown} />
        </LessonPlayer>
      </div>
      {slug === "bab-10-studi-kasus" && (
        <div className="mt-8">
          <FlashDrill
            storageKey="studi-kasus-10"
            cards={STUDI_KASUS.map((kasus) => ({
              id: kasus.id,
              title: kasus.title,
              prompt: kasus.prompt,
              answer: kasus.answer,
            }))}
            promptLabel="Jelaskan 3–5 menit seperti di interview, baru buka kerangka."
          />
        </div>
      )}
      {slug === "bab-14-contekan" && (
        <p className="mt-6 text-sm">
          Drill kartu 16.1 ada di{" "}
          <Link href="/review" className="text-ember hover:underline">
            Review
          </Link>
          : jawab lantang, buka jawaban satu kalimat, nilai Lancar / Masih goyang.
        </p>
      )}
      <div className="mt-10">
        {ready ? (
          <LessonCompleteButton done={done} onComplete={() => completeLesson(slug)} />
        ) : (
          <p className="text-sm text-muted">Memuat progress…</p>
        )}
      </div>
    </main>
  );
}
