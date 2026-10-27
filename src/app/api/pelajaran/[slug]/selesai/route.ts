import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { jsonError } from "@/lib/http";
import { Lesson } from "@/lib/models";
import { recordLessonComplete } from "@/lib/data";

export async function POST(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Silakan masuk dulu.", 401);

  const { slug } = await params;
  await connectDB();
  const lesson = await Lesson.findOne({ slug });
  if (!lesson) return jsonError("Materi tidak ditemukan.", 404);

  await recordLessonComplete(user.id, String(lesson._id));
  return NextResponse.json({ ok: true });
}
