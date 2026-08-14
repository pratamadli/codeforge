import type { NewSnippet, Snippet } from "@/lib/types";

export type { NewSnippet, Snippet } from "@/lib/types";
export { LANGUAGES } from "@/lib/types";

// In-memory store. Persisted on globalThis so it survives Next.js module
// reloads in development. This is intentionally simple: swap for a real
// database when persistence beyond the process lifetime is required.
type SnippetStore = { items: Snippet[] };

const globalForSnippets = globalThis as unknown as {
  __codeforgeSnippets?: SnippetStore;
};

const store: SnippetStore =
  globalForSnippets.__codeforgeSnippets ??
  (globalForSnippets.__codeforgeSnippets = {
    items: [
      {
        id: "seed-hello",
        title: "Hello, CodeForge",
        language: "typescript",
        code: "export const greet = (name: string) => `Hello, ${name}!`;",
        createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
      },
      {
        id: "seed-anvil",
        title: "Forge a hash",
        language: "python",
        code: "def forge(metal: str) -> str:\n    return metal.upper().replace(' ', '_')\n\nprint(forge('raw iron'))",
        createdAt: new Date("2026-01-02T00:00:00.000Z").toISOString(),
      },
      {
        id: "seed-spark",
        title: "Spark check",
        language: "bash",
        code: '#!/usr/bin/env bash\nset -euo pipefail\necho "CodeForge is hot. Temperature: ${TEMP:-unknown}"',
        createdAt: new Date("2026-01-03T00:00:00.000Z").toISOString(),
      },
    ],
  });

export function listSnippets(): Snippet[] {
  return [...store.items].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function createSnippet(input: NewSnippet): Snippet {
  const snippet: Snippet = {
    id: `snip_${Math.random().toString(36).slice(2, 10)}`,
    title: input.title.trim(),
    language: input.language.trim() || "plaintext",
    code: input.code,
    createdAt: new Date().toISOString(),
  };
  store.items.push(snippet);
  return snippet;
}

export function deleteSnippet(id: string): boolean {
  const index = store.items.findIndex((item) => item.id === id);
  if (index === -1) return false;
  store.items.splice(index, 1);
  return true;
}

export function validateNewSnippet(body: unknown): NewSnippet | null {
  if (typeof body !== "object" || body === null) return null;
  const { title, language, code } = body as Record<string, unknown>;
  if (typeof title !== "string" || title.trim().length === 0) return null;
  if (typeof code !== "string" || code.length === 0) return null;
  return {
    title,
    language: typeof language === "string" ? language : "plaintext",
    code,
  };
}
