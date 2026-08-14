import { NextResponse } from "next/server";
import {
  getProgress,
  markExerciseComplete,
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

  const { action, exerciseId } = body as Record<string, unknown>;

  if (action === "reset") {
    return NextResponse.json({ progress: resetProgress() });
  }

  if (typeof exerciseId !== "string") {
    return NextResponse.json({ error: "exerciseId wajib diisi." }, { status: 422 });
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
