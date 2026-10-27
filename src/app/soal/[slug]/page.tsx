import Link from "next/link";
import { notFound } from "next/navigation";
import { ProblemWorkspace } from "@/components/problem-workspace";
import { getCurrentUser } from "@/lib/auth";
import { getPublicProblem } from "@/lib/data";

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await getCurrentUser();
  if (!user) return null;
  const problem = await getPublicProblem(slug, user.id);
  if (!problem) notFound();

  return (
    <div>
      <div className="border-b border-steel-border px-4 py-2 text-sm">
        <Link href={`/kurikulum/${problem.trackSlug}`} className="text-muted hover:text-ember">
          ← {problem.trackTitle}
        </Link>
        <span className="mx-2 text-muted">/</span>
        <span className="text-muted">{problem.moduleTitle}</span>
      </div>
      <ProblemWorkspace
        slug={problem.slug}
        title={problem.title}
        prompt={problem.prompt}
        starterCode={problem.starterCode}
        language={problem.language}
        functionName={problem.functionName}
        pembahasan={problem.pembahasan}
        hasSubmitted={problem.hasSubmitted}
        sampleTests={problem.sampleTests}
      />
    </div>
  );
}
