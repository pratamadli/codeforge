import { ASSESSMENT_QUESTIONS } from "@/lib/curriculum";
import type {
  AssessmentMode,
  AssessmentQuestion,
  AssessmentResult,
  SkillLevel,
  TechTrack,
  TrackScore,
} from "@/lib/types";
import { LEVEL_LABELS, QUICK_ASSESSMENT_IDS } from "@/lib/types";

export function getAssessmentQuestions(mode: AssessmentMode = "full"): AssessmentQuestion[] {
  if (mode === "quick") {
    return ASSESSMENT_QUESTIONS.filter((q) =>
      (QUICK_ASSESSMENT_IDS as readonly string[]).includes(q.id),
    );
  }
  return ASSESSMENT_QUESTIONS;
}

export function scoreAssessment(
  answers: Record<string, number>,
  mode: AssessmentMode = "full",
): AssessmentResult {
  const questions = getAssessmentQuestions(mode);
  const trackMap = new Map<TechTrack, { correct: number; total: number }>();

  for (const question of questions) {
    const current = trackMap.get(question.track) ?? { correct: 0, total: 0 };
    current.total += 1;
    if (answers[question.id] === question.correctIndex) {
      current.correct += 1;
    }
    trackMap.set(question.track, current);
  }

  const correctCount = questions.filter(
    (q) => answers[q.id] === q.correctIndex,
  ).length;
  const score = Math.round((correctCount / questions.length) * 100);

  const trackScores: TrackScore[] = Array.from(trackMap.entries()).map(
    ([track, { correct, total }]) => ({
      track,
      correct,
      total,
      percent: total === 0 ? 0 : Math.round((correct / total) * 100),
    }),
  );

  const level = levelFromScore(score);

  return {
    score,
    level,
    levelLabel: LEVEL_LABELS[level],
    trackScores,
    completedAt: new Date().toISOString(),
    answers,
    mode,
  };
}

export function levelFromScore(score: number): SkillLevel {
  if (score >= 90) return "expert";
  if (score >= 70) return "advanced";
  if (score >= 40) return "intermediate";
  return "beginner";
}

export function validateAnswers(
  body: unknown,
  mode: AssessmentMode = "full",
): Record<string, number> | null {
  if (typeof body !== "object" || body === null) return null;
  const { answers } = body as Record<string, unknown>;
  if (typeof answers !== "object" || answers === null) return null;

  const questions = getAssessmentQuestions(mode);
  const parsed: Record<string, number> = {};

  for (const question of questions) {
    const value = (answers as Record<string, unknown>)[question.id];
    if (typeof value !== "number" || value < 0 || value >= question.options.length) {
      return null;
    }
    parsed[question.id] = value;
  }

  const keys = Object.keys(answers as Record<string, unknown>);
  if (keys.length !== questions.length) return null;

  return parsed;
}

export function parseAssessmentMode(body: unknown): AssessmentMode {
  if (typeof body !== "object" || body === null) return "full";
  const mode = (body as Record<string, unknown>).mode;
  return mode === "quick" ? "quick" : "full";
}
