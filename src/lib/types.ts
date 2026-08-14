export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type Topic =
  | "fundamentals"
  | "functions"
  | "data-structures"
  | "algorithms"
  | "async"
  | "patterns";

export type AssessmentQuestion = {
  id: string;
  topic: Topic;
  difficulty: 1 | 2 | 3;
  type: "multiple-choice" | "code-output";
  question: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type TrainingExercise = {
  id: string;
  levels: SkillLevel[];
  topic: Topic;
  title: string;
  description: string;
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
};

export type UserProgress = {
  assessment: AssessmentResult | null;
  completedExercises: string[];
  exerciseAttempts: Record<string, number>;
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
    "Kamu perlu memperkuat fondasi: variabel, kondisi, loop, dan membaca kode sederhana.",
  intermediate:
    "Dasar sudah cukup. Fokus ke fungsi, array/object, dan pemecahan masalah kecil.",
  advanced:
    "Kamu nyaman dengan logika kompleks. Latihan algoritma dan async akan membantu naik level.",
  expert:
    "Skill solid. Tantangan lanjutan dan pola desain akan menjaga ketajamanmu.",
};
