import { NextResponse } from "next/server";
import { createSession, verifyPassword } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { jsonError } from "@/lib/http";
import { User } from "@/lib/models";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    email?: string;
    password?: string;
  } | null;

  const email = body?.email?.trim().toLowerCase() ?? "";
  const password = body?.password ?? "";
  if (!email || !password) return jsonError("Email dan password wajib diisi.", 400);

  await connectDB();
  const user = await User.findOne({ email });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return jsonError("Email atau password salah.", 401);
  }

  await createSession(String(user._id));
  return NextResponse.json({ ok: true });
}
