"use client";

import Link from "next/link";
import { useEffect } from "react";
import { LessonCompleteButton } from "@/components/lesson-complete-button";
import { Markdown } from "@/components/markdown";
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
      <article className="mt-4">
        <Markdown content={markdown} />
      </article>
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
