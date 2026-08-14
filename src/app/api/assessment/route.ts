import { NextResponse } from "next/server";
import { scoreAssessment, validateAnswers } from "@/lib/assessment";
import { saveAssessmentResult } from "@/lib/progress";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const answers = validateAnswers(body);
  if (!answers) {
    return NextResponse.json(
      { error: "Jawaban assessment tidak lengkap atau tidak valid." },
      { status: 422 },
    );
  }

  const result = scoreAssessment(answers);
  const progress = saveAssessmentResult(result);

  return NextResponse.json({ result, progress });
}
