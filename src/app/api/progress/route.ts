import { NextResponse } from "next/server";
import {
  getProgress,
  markConceptComplete,
  markExerciseComplete,
  completeSession,
  recordExerciseAttempt,
  resetProgress,
} from "@/lib/progress";

export async function GET() {
  return NextResponse.json({ progress: getProgress() });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid body." }, { status: 422 });
  }

  const { action, exerciseId, conceptId } = body as Record<string, unknown>;

  if (action === "reset") {
    return NextResponse.json({ progress: resetProgress() });
  }

  if (action === "completeSession" && typeof conceptId === "string") {
    const progress = completeSession(conceptId);
    if (!progress) {
      return NextResponse.json({ error: "Konsep tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ progress });
  }

  if (action === "completeConcept" && typeof conceptId === "string") {
    const progress = markConceptComplete(conceptId);
    if (!progress) {
      return NextResponse.json({ error: "Konsep tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ progress });
  }

  if (typeof exerciseId !== "string") {
    return NextResponse.json(
      { error: "exerciseId atau conceptId wajib diisi." },
      { status: 422 },
    );
  }

  if (action === "complete") {
    const progress = markExerciseComplete(exerciseId);
    if (!progress) {
      return NextResponse.json({ error: "Latihan tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ progress });
  }

  if (action === "attempt") {
    const progress = recordExerciseAttempt(exerciseId);
    if (!progress) {
      return NextResponse.json({ error: "Latihan tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ progress });
  }

  return NextResponse.json({ error: "Action tidak dikenal." }, { status: 422 });
}
