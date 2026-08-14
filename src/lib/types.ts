export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type Topic =
  | "fundamentals"
  | "functions"
  | "data-structures"
  | "algorithms"
  | "async"
  | "patterns";

export type AssessmentMode = "quick" | "full";

export type AssessmentQuestion = {
  id: string;
  topic: Topic;
  difficulty: 1 | 2 | 3;
  type: "multiple-choice" | "code-output";
  question: string;
  code?: string;
  options: string[];
  correctIndex: number;
  /** Penjelasan singkat, bahasa awam */
  explanation: string;
  /** Kalimat siap pakai saat interview */
  interviewAnswer: string;
};

export type ConceptBite = {
  id: string;
  topic: Topic;
  title: string;
  minutes: number;
  /** Penjelasan utama — maksimal 2–3 paragraf pendek */
  simpleExplanation: string;
  /** Analogi dari kehidupan sehari-hari */
  analogy: string;
  /** Template jawaban interview (1–2 kalimat) */
  interviewTip: string;
  /** Kesalahan umum yang bikin interviewer ragu */
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
  topic: Topic;
  title: string;
  description: string;
  minutes: number;
  starterCode: string;
  hints: string[];
  tests: { args: unknown[]; expected: unknown }[];
  solution: string;
};

export type TopicScore = {
  topic: Topic;
  correct: number;
  total: number;
  percent: number;
};

export type AssessmentResult = {
  score: number;
  level: SkillLevel;
  levelLabel: string;
  topicScores: TopicScore[];
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

export const TOPIC_LABELS: Record<Topic, string> = {
  fundamentals: "Dasar-dasar",
  functions: "Fungsi & scope",
  "data-structures": "Struktur data",
  algorithms: "Algoritma",
  async: "Async & promise",
  patterns: "Pola & OOP",
};

export const LEVEL_LABELS: Record<SkillLevel, string> = {
  beginner: "Pemula",
  intermediate: "Menengah",
  advanced: "Lanjutan",
  expert: "Mahir",
};

export const LEVEL_DESCRIPTIONS: Record<SkillLevel, string> = {
  beginner:
    "Fondasi masih perlu diperkuat. Mulai dari konsep dasar — variabel, loop, dan baca kode sederhana.",
  intermediate:
    "Dasar sudah ada. Latih penjelasan konsep + latihan kecil supaya interview terdengar meyakinkan.",
  advanced:
    "Logika sudah kuat. Fokus latih menjelaskan async, algoritma, dan pola dengan bahasa sederhana.",
  expert:
    "Skill solid. Pertahankan dengan sesi singkat dan latihan jelaskan konsep tanpa jargon.",
};

export const QUICK_ASSESSMENT_IDS = [
  "q1",
  "q4",
  "q6",
  "q8",
  "q10",
] as const;
