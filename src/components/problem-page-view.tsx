"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ProblemWorkspace } from "@/components/problem-workspace";
import { useLocalProgress } from "@/hooks/use-local-progress";
import type { PublicProblem } from "@/lib/content";

export function ProblemPageView({ problem }: { problem: PublicProblem }) {
  const { progress, ready, touch, submit } = useLocalProgress();
  const stored = progress.problems[problem.slug];

  useEffect(() => {
    if (ready) touch("problem", problem.slug);
  }, [ready, problem.slug, touch]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-steel-border px-4 py-2 text-sm">
        <Link href={`/kurikulum/${problem.trackSlug}`} className="text-muted hover:text-ember">
          ← {problem.trackTitle}
        </Link>
        <span className="mx-2 text-muted">/</span>
        <span className="text-muted">{problem.moduleTitle}</span>
      </div>
      <div className="min-h-0 flex-1">
        <ProblemWorkspace
          slug={problem.slug}
          title={problem.title}
          prompt={problem.prompt}
          starterCode={problem.starterCode}
          language={problem.language}
          functionName={problem.functionName}
          sampleTests={problem.sampleTests}
          initialPembahasan={stored?.pembahasan}
          onSubmitted={(result) =>
            submit({
              slug: problem.slug,
              title: problem.title,
              status: result.status,
              runtimeMs: result.runtimeMs,
              pembahasan: result.pembahasan,
            })
          }
        />
      </div>
    </div>
  );
}
