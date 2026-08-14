import { NextResponse } from "next/server";
import {
  createSnippet,
  listSnippets,
  validateNewSnippet,
} from "@/lib/snippets";

export async function GET() {
  return NextResponse.json({ snippets: listSnippets() });
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

  const parsed = validateNewSnippet(body);
  if (!parsed) {
    return NextResponse.json(
      { error: "Fields 'title' and 'code' are required." },
      { status: 422 },
    );
  }

  const snippet = createSnippet(parsed);
  return NextResponse.json({ snippet }, { status: 201 });
}
