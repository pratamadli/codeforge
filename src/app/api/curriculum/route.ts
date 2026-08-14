import { NextResponse } from "next/server";
import { getAssessmentQuestions } from "@/lib/assessment";
import { CONCEPT_BITES, getNextConceptBite } from "@/lib/concept-bites";
import { TRAINING_EXERCISES } from "@/lib/curriculum";
import { getProgress } from "@/lib/progress";
import { TOPIC_LABELS } from "@/lib/types";

export async function GET() {
  const progress = getProgress();
  const level = progress.assessment?.level ?? null;

  const weakTopics =
    progress.assessment?.topicScores
      .filter((t) => t.percent < 70)
      .map((t) => t.topic) ?? [];

  const nextConcept = getNextConceptBite(progress.completedConcepts, weakTopics);

  return NextResponse.json({
    questions: getAssessmentQuestions("full"),
    quickQuestions: getAssessmentQuestions("quick"),
    concepts: CONCEPT_BITES,
    exercises: TRAINING_EXERCISES,
    progress,
    recommendedLevel: level,
    nextSession: {
      concept: nextConcept,
      weakTopics: weakTopics.map((t) => TOPIC_LABELS[t]),
      estimatedMinutes: nextConcept.minutes + 2,
    },
  });
}
