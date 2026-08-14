import { NextResponse } from "next/server";
import { getAssessmentQuestions } from "@/lib/assessment";
import { CONCEPT_BITES, getNextConceptBite } from "@/lib/concept-bites";
import { TRAINING_EXERCISES } from "@/lib/curriculum";
import { getProgress } from "@/lib/progress";
import { allTracksSorted, PRIORITY_LABELS, TRACK_META, trackLabel } from "@/lib/tracks";
import type { TechTrack } from "@/lib/types";

export async function GET() {
  const progress = getProgress();
  const level = progress.assessment?.level ?? null;

  const weakTracks: TechTrack[] =
    progress.assessment?.trackScores
      .filter((t) => t.percent < 70)
      .map((t) => t.track) ?? [];

  const nextConcept = getNextConceptBite(progress.completedConcepts, weakTracks);

  const trackProgress = allTracksSorted().map((track) => {
    const concepts = CONCEPT_BITES.filter((c) => c.track === track);
    const done = concepts.filter((c) =>
      progress.completedConcepts.includes(c.id),
    ).length;
    return {
      track,
      label: trackLabel(track),
      priority: TRACK_META[track].priority,
      description: TRACK_META[track].description,
      conceptsTotal: concepts.length,
      conceptsDone: done,
    };
  });

  return NextResponse.json({
    questions: getAssessmentQuestions("full"),
    quickQuestions: getAssessmentQuestions("quick"),
    concepts: CONCEPT_BITES,
    exercises: TRAINING_EXERCISES,
    progress,
    recommendedLevel: level,
    tracks: trackProgress,
    priorityLabels: PRIORITY_LABELS,
    nextSession: {
      concept: nextConcept,
      weakTracks: weakTracks.map((t) => trackLabel(t)),
      estimatedMinutes: nextConcept.minutes + 2,
    },
  });
}
