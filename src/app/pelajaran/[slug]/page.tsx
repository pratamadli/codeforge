import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonCompleteButton } from "@/components/lesson-complete-button";
import { Markdown } from "@/components/markdown";
import { getCurrentUser } from "@/lib/auth";
import { getLessonBySlug, getProgress, lessonDone } from "@/lib/data";

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await getCurrentUser();
  if (!user) return null;
  const lesson = await getLessonBySlug(slug);
  if (!lesson) notFound();
  const progress = await getProgress(user.id);
  const done = lessonDone(progress, lesson.id);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href={`/kurikulum/${lesson.trackSlug}`} className="text-sm text-muted hover:text-ember">
        ← {lesson.trackTitle}
      </Link>
      <p className="mt-3 text-xs uppercase tracking-wide text-muted">{lesson.moduleTitle}</p>
      <article className="mt-4">
        <Markdown content={lesson.markdown} />
      </article>
      <div className="mt-10">
        <LessonCompleteButton slug={lesson.slug} done={done} />
      </div>
    </main>
  );
}
