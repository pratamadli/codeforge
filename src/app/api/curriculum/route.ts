import { NextResponse } from "next/server";
import { getAssessmentQuestions } from "@/lib/assessment";
import { TRAINING_EXERCISES } from "@/lib/curriculum";
import { getProgress } from "@/lib/progress";

export async function GET() {
  const progress = getProgress();
  const level = progress.assessment?.level ?? null;

  return NextResponse.json({
    questions: getAssessmentQuestions(),
    exercises: TRAINING_EXERCISES,
    progress,
    recommendedLevel: level,
  });
}
