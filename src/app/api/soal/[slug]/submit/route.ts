import { NextResponse } from "next/server";
import { getJudgeProblem } from "@/lib/content";
import { jsonError } from "@/lib/http";
import { runJudge } from "@/lib/judge";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body = (await req.json().catch(() => null)) as { code?: string } | null;
  const code = body?.code;
  if (typeof code !== "string" || code.trim().length === 0) {
    return jsonError("Kode tidak boleh kosong.", 400);
  }

  const problem = getJudgeProblem(slug);
  if (!problem) return jsonError("Soal tidak ditemukan.", 404);

  const source = problem.driverCode ? `${code}\n${problem.driverCode}` : code;
  const functionName = problem.judgeFunctionName ?? problem.functionName;

  const tests = [
    ...problem.sampleTests.map((t) => ({ args: t.args, expected: t.expected, hidden: false })),
    ...problem.hiddenTests.map((t) => ({ args: t.args, expected: t.expected, hidden: true })),
  ];

  const outcome = await runJudge({
    code: source,
    language: problem.language,
    functionName,
    tests,
    mode: "submit",
  });

  return NextResponse.json({
    ...outcome,
    pembahasan: problem.pembahasan,
  });
}
