import { CONCEPT_BITES } from "@/lib/concept-bites";
import { TRAINING_EXERCISES } from "@/lib/curriculum";
import type {
  AssessmentResult,
  SkillLevel,
  TechTrack,
  TrackScore,
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
  completedConcepts: [],
  exerciseAttempts: {},
  sessionsCompleted: 0,
  updatedAt: new Date().toISOString(),
});

const store: ProgressStore =
  globalForProgress.__codeforgeProgress ??
  (globalForProgress.__codeforgeProgress = {
    progress: emptyProgress(),
  });

function normalizeProgress(raw: UserProgress): UserProgress {
  const rawAssessment = raw.assessment as AssessmentResult & {
    topicScores?: AssessmentResult["trackScores"];
  } | null;

  const assessment = rawAssessment
    ? {
        ...rawAssessment,
        mode: rawAssessment.mode ?? "full",
        trackScores:
          rawAssessment.trackScores ??
          rawAssessment.topicScores?.map((s) => {
            const legacy = s as TrackScore & { topic?: TechTrack };
            return {
              track: legacy.track ?? legacy.topic ?? "react",
              correct: legacy.correct,
              total: legacy.total,
              percent: legacy.percent,
            };
          }) ??
          [],
      }
    : null;

  return {
    ...emptyProgress(),
    ...raw,
    assessment,
    completedExercises: raw.completedExercises ?? [],
    completedConcepts: raw.completedConcepts ?? [],
    exerciseAttempts: raw.exerciseAttempts ?? {},
    sessionsCompleted: raw.sessionsCompleted ?? 0,
  };
}

export function getProgress(): UserProgress {
  store.progress = normalizeProgress(store.progress);
  return {
    ...store.progress,
    completedExercises: [...store.progress.completedExercises],
    completedConcepts: [...store.progress.completedConcepts],
  };
}

export function saveAssessmentResult(result: AssessmentResult): UserProgress {
  store.progress = {
    ...normalizeProgress(store.progress),
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
    ...normalizeProgress(store.progress),
    completedExercises: [...completed],
    updatedAt: new Date().toISOString(),
  };
  return getProgress();
}

export function markConceptComplete(conceptId: string): UserProgress | null {
  const exists = CONCEPT_BITES.some((c) => c.id === conceptId);
  if (!exists) return null;

  const completed = new Set(store.progress.completedConcepts);
  completed.add(conceptId);

  store.progress = {
    ...normalizeProgress(store.progress),
    completedConcepts: [...completed],
    updatedAt: new Date().toISOString(),
  };
  return getProgress();
}

export function completeSession(conceptId: string): UserProgress | null {
  const exists = CONCEPT_BITES.some((c) => c.id === conceptId);
  if (!exists) return null;

  const completed = new Set(store.progress.completedConcepts);
  completed.add(conceptId);

  store.progress = {
    ...normalizeProgress(store.progress),
    completedConcepts: [...completed],
    sessionsCompleted: store.progress.sessionsCompleted + 1,
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
    ...normalizeProgress(store.progress),
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
