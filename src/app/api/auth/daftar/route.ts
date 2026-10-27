import { NextResponse } from "next/server";
import { createSession, hashPassword } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { jsonError } from "@/lib/http";
import { User } from "@/lib/models";

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    name?: string;
    email?: string;
    password?: string;
  } | null;

  const name = body?.name?.trim() ?? "";
  const email = body?.email?.trim().toLowerCase() ?? "";
  const password = body?.password ?? "";

  if (name.length < 2) return jsonError("Nama minimal 2 karakter.", 400);
  if (!validEmail(email)) return jsonError("Email tidak valid.", 400);
  if (password.length < 8) return jsonError("Password minimal 8 karakter.", 400);

  await connectDB();
  const exists = await User.findOne({ email });
  if (exists) return jsonError("Email sudah terdaftar. Silakan masuk.", 409);

  const user = await User.create({
    name,
    email,
    passwordHash: await hashPassword(password),
  });
  await createSession(String(user._id));
  return NextResponse.json({ ok: true });
}
