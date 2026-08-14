export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type TechTrack =
  | "react"
  | "next"
  | "node"
  | "testing"
  | "typescript"
  | "express"
  | "performance"
  | "nestjs"
  | "nuxt"
  | "flutter"
  | "go"
  | "laravel"
  | "python";

export type TrackPriority = "top" | "mid" | "low";

export type AssessmentMode = "quick" | "full";

export type AssessmentQuestion = {
  id: string;
  track: TechTrack;
  difficulty: 1 | 2 | 3;
  type: "multiple-choice" | "code-output";
  question: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  interviewAnswer: string;
};

export type ConceptBite = {
  id: string;
  track: TechTrack;
  title: string;
  minutes: number;
  simpleExplanation: string;
  analogy: string;
  interviewTip: string;
  commonMistake: string;
  checkQuestions: {
    id: string;
    question: string;
    answer: string;
  }[];
};

export type TrainingExercise = {
  id: string;
  levels: SkillLevel[];
  track: TechTrack;
  title: string;
  description: string;
  minutes: number;
  starterCode: string;
  hints: string[];
  tests: { args: unknown[]; expected: unknown }[];
  solution: string;
};

export type TrackScore = {
  track: TechTrack;
  correct: number;
  total: number;
  percent: number;
};

export type AssessmentResult = {
  score: number;
  level: SkillLevel;
  levelLabel: string;
  trackScores: TrackScore[];
  completedAt: string;
  answers: Record<string, number>;
  mode: AssessmentMode;
};

export type UserProgress = {
  assessment: AssessmentResult | null;
  completedExercises: string[];
  completedConcepts: string[];
  exerciseAttempts: Record<string, number>;
  sessionsCompleted: number;
  updatedAt: string;
};

export const LEVEL_LABELS: Record<SkillLevel, string> = {
  beginner: "Pemula",
  intermediate: "Menengah",
  advanced: "Lanjutan",
  expert: "Mahir",
};

export const LEVEL_DESCRIPTIONS: Record<SkillLevel, string> = {
  beginner:
    "Fondasi stack JS/React perlu diperkuat. Fokus ke React, TypeScript, dan konsep dasar Node.",
  intermediate:
    "Dasar ada. Perdalam Next.js, testing, dan latih jelaskan konsep di interview.",
  advanced:
    "Stack utama sudah kuat. Tuning performance, Express/Nest, dan edge case interview.",
  expert:
    "Level solid di stack prioritas. Pertahankan dengan sesi singkat dan mock interview.",
};

export const QUICK_ASSESSMENT_IDS = [
  "q-react-1",
  "q-next-1",
  "q-node-1",
  "q-ts-1",
  "q-test-1",
] as const;

/** @deprecated use trackScores — kept for normalizeProgress migration */
export type TopicScore = TrackScore;
