import { NextResponse } from "next/server";
import { deleteSnippet } from "@/lib/snippets";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing snippet id." }, { status: 400 });
  }

  const deleted = deleteSnippet(id);
  if (!deleted) {
    return NextResponse.json({ error: "Snippet not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
