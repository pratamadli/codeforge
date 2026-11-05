import { notFound } from "next/navigation";
import { LessonView } from "@/components/lesson-view";
import { getLessonBySlug } from "@/lib/content";

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) notFound();
  return (
    <LessonView
      slug={lesson.slug}
      title={lesson.title}
      markdown={lesson.markdown}
      moduleTitle={lesson.moduleTitle}
      trackSlug={lesson.trackSlug}
      trackTitle={lesson.trackTitle}
    />
  );
}
