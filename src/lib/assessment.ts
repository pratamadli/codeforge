import { ASSESSMENT_QUESTIONS } from "@/lib/curriculum";
import type {
  AssessmentQuestion,
  AssessmentResult,
  SkillLevel,
  Topic,
  TopicScore,
} from "@/lib/types";
import { LEVEL_LABELS } from "@/lib/types";

export function getAssessmentQuestions(): AssessmentQuestion[] {
  return ASSESSMENT_QUESTIONS;
}

export function scoreAssessment(
  answers: Record<string, number>,
): AssessmentResult {
  const topicMap = new Map<Topic, { correct: number; total: number }>();

  for (const question of ASSESSMENT_QUESTIONS) {
    const current = topicMap.get(question.topic) ?? { correct: 0, total: 0 };
    current.total += 1;
    if (answers[question.id] === question.correctIndex) {
      current.correct += 1;
    }
    topicMap.set(question.topic, current);
  }

  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const correctCount = ASSESSMENT_QUESTIONS.filter(
    (q) => answers[q.id] === q.correctIndex,
  ).length;
  const score = Math.round((correctCount / totalQuestions) * 100);

  const topicScores: TopicScore[] = Array.from(topicMap.entries()).map(
    ([topic, { correct, total }]) => ({
      topic,
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
    topicScores,
    completedAt: new Date().toISOString(),
    answers,
  };
}

export function levelFromScore(score: number): SkillLevel {
  if (score >= 90) return "expert";
  if (score >= 70) return "advanced";
  if (score >= 40) return "intermediate";
  return "beginner";
}

export function validateAnswers(body: unknown): Record<string, number> | null {
  if (typeof body !== "object" || body === null) return null;
  const { answers } = body as Record<string, unknown>;
  if (typeof answers !== "object" || answers === null) return null;

  const parsed: Record<string, number> = {};
  for (const question of ASSESSMENT_QUESTIONS) {
    const value = (answers as Record<string, unknown>)[question.id];
    if (typeof value !== "number" || value < 0 || value >= question.options.length) {
      return null;
    }
    parsed[question.id] = value;
  }

  const keys = Object.keys(answers as Record<string, unknown>);
  if (keys.length !== ASSESSMENT_QUESTIONS.length) return null;

  return parsed;
}
