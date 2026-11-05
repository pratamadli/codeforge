import { notFound } from "next/navigation";
import { ProblemPageView } from "@/components/problem-page-view";
import { getPublicProblem } from "@/lib/content";

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const problem = getPublicProblem(slug);
  if (!problem) notFound();
  return <ProblemPageView problem={problem} />;
}
