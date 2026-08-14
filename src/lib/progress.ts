import { TRAINING_EXERCISES } from "@/lib/curriculum";
import type {
  AssessmentResult,
  SkillLevel,
  TrainingExercise,
  UserProgress,
} from "@/lib/types";

type ProgressStore = { progress: UserProgress };

const globalForProgress = globalThis as unknown as {
  __codeforgeProgress?: ProgressStore;
};

const emptyProgress = (): UserProgress => ({
  assessment: null,
  completedExercises: [],
  exerciseAttempts: {},
  updatedAt: new Date().toISOString(),
});

const store: ProgressStore =
  globalForProgress.__codeforgeProgress ??
  (globalForProgress.__codeforgeProgress = {
    progress: emptyProgress(),
  });

export function getProgress(): UserProgress {
  return { ...store.progress, completedExercises: [...store.progress.completedExercises] };
}

export function saveAssessmentResult(result: AssessmentResult): UserProgress {
  store.progress = {
    ...store.progress,
    assessment: result,
    updatedAt: new Date().toISOString(),
  };
  return getProgress();
}

export function markExerciseComplete(exerciseId: string): UserProgress | null {
  const exists = TRAINING_EXERCISES.some((ex) => ex.id === exerciseId);
  if (!exists) return null;

  const completed = new Set(store.progress.completedExercises);
  completed.add(exerciseId);

  store.progress = {
    ...store.progress,
    completedExercises: [...completed],
    updatedAt: new Date().toISOString(),
  };
  return getProgress();
}

export function recordExerciseAttempt(exerciseId: string): UserProgress | null {
  const exists = TRAINING_EXERCISES.some((ex) => ex.id === exerciseId);
  if (!exists) return null;

  const attempts = { ...store.progress.exerciseAttempts };
  attempts[exerciseId] = (attempts[exerciseId] ?? 0) + 1;

  store.progress = {
    ...store.progress,
    exerciseAttempts: attempts,
    updatedAt: new Date().toISOString(),
  };
  return getProgress();
}

export function resetProgress(): UserProgress {
  store.progress = emptyProgress();
  return getProgress();
}

export function getExercisesForLevel(level: SkillLevel | null): TrainingExercise[] {
  const target = level ?? "beginner";
  return TRAINING_EXERCISES.filter((ex) => ex.levels.includes(target));
}
