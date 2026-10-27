import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { jsonError } from "@/lib/http";
import { runJudge } from "@/lib/judge";
import { Problem } from "@/lib/models";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Silakan masuk dulu.", 401);

  const { slug } = await params;
  const body = (await req.json().catch(() => null)) as { code?: string } | null;
  const code = body?.code;
  if (typeof code !== "string" || code.trim().length === 0) {
    return jsonError("Kode tidak boleh kosong.", 400);
  }

  await connectDB();
  const problem = await Problem.findOne({ slug }).select(
    "language functionName sampleTests",
  );
  if (!problem) return jsonError("Soal tidak ditemukan.", 404);

  const outcome = await runJudge({
    code,
    language: problem.language as "js" | "ts",
    functionName: problem.functionName,
    tests: problem.sampleTests.map((t: { args: unknown[]; expected: unknown }) => ({
      args: t.args,
      expected: t.expected,
    })),
    mode: "run",
  });

  return NextResponse.json(outcome);
}
