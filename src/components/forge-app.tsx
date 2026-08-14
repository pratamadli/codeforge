"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { LANGUAGES, type Snippet } from "@/lib/types";

const LANGUAGE_OPTIONS = ["all", ...LANGUAGES] as const;

export function ForgeApp() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState<string>("typescript");
  const [code, setCode] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [status, setStatus] = useState<"idle" | "loading" | "saving">("loading");
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadSnippets = useCallback(async () => {
    const response = await fetch("/api/snippets");
    if (!response.ok) {
      throw new Error("Could not load snippets.");
    }
    const data = (await response.json()) as { snippets: Snippet[] };
    setSnippets(data.snippets);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadSnippets();
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load.");
        }
      } finally {
        if (!cancelled) setStatus("idle");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadSnippets]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return snippets.filter((snippet) => {
      const matchesLanguage = filter === "all" || snippet.language === filter;
      const matchesQuery =
        needle.length === 0 ||
        snippet.title.toLowerCase().includes(needle) ||
        snippet.code.toLowerCase().includes(needle) ||
        snippet.language.toLowerCase().includes(needle);
      return matchesLanguage && matchesQuery;
    });
  }, [snippets, query, filter]);

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus("saving");
    try {
      const response = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, language, code }),
      });
      const data = (await response.json()) as { snippet?: Snippet; error?: string };
      if (!response.ok || !data.snippet) {
        throw new Error(data.error ?? "Could not forge snippet.");
      }
      setSnippets((current) => [data.snippet!, ...current]);
      setTitle("");
      setCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not forge snippet.");
    } finally {
      setStatus("idle");
    }
  }

  async function onDelete(id: string) {
    setError(null);
    const response = await fetch(`/api/snippets/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Could not quench snippet.");
      return;
    }
    setSnippets((current) => current.filter((snippet) => snippet.id !== id));
  }

  async function onCopy(snippet: Snippet) {
    await navigator.clipboard.writeText(snippet.code);
    setCopiedId(snippet.id);
    window.setTimeout(() => setCopiedId((current) => (current === snippet.id ? null : current)), 1400);
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-steel-border/80 bg-steel/70 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-3">
            <AnvilMark />
            <div>
              <p className="font-mono text-[11px] tracking-[0.28em] text-ember uppercase">
                Workshop
              </p>
              <h1 className="text-xl font-semibold tracking-tight">CodeForge</h1>
            </div>
          </div>
          <p className="hidden max-w-sm text-right text-sm text-muted sm:block">
            A tiny snippet forge — create and browse code snippets.
          </p>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[minmax(280px,380px)_1fr]">
        <section className="h-fit rounded-2xl border border-steel-border bg-steel/80 p-5 shadow-[0_0_80px_rgba(255,122,24,0.08)]">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Heat the metal</h2>
            <p className="mt-1 text-sm text-muted">
              Name the piece, pick a language, then strike the code into the library.
            </p>
          </div>
          <form className="flex flex-col gap-4" onSubmit={onCreate}>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-muted">Title</span>
              <input
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Binary search helper"
                className="rounded-lg border border-steel-border bg-steel-raised px-3 py-2 text-foreground outline-none ring-ember/40 placeholder:text-muted/60 focus:ring-2"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-muted">Language</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="rounded-lg border border-steel-border bg-steel-raised px-3 py-2 text-foreground outline-none ring-ember/40 focus:ring-2"
              >
                {LANGUAGES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-muted">Code</span>
              <textarea
                required
                value={code}
                onChange={(event) => setCode(event.target.value)}
                rows={10}
                spellCheck={false}
                placeholder="function forge() { return 'spark'; }"
                className="resize-y rounded-lg border border-steel-border bg-[#0e0b08] px-3 py-2 font-mono text-[13px] leading-6 text-ember-soft outline-none ring-ember/40 placeholder:text-muted/50 focus:ring-2"
              />
            </label>
            {error ? (
              <p className="rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={status === "saving"}
              className="rounded-lg bg-ember px-4 py-2.5 text-sm font-semibold text-[#1a0f05] transition hover:bg-ember-soft disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "saving" ? "Forging…" : "Forge snippet"}
            </button>
          </form>
        </section>

        <section className="min-w-0">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Library</h2>
              <p className="text-sm text-muted">
                {status === "loading"
                  ? "Pulling stock from the rack…"
                  : `${visible.length} piece${visible.length === 1 ? "" : "s"} on the bench`}
              </p>
            </div>
            <div className="flex flex-1 gap-2 sm:max-w-md">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title or code"
                className="min-w-0 flex-1 rounded-lg border border-steel-border bg-steel px-3 py-2 text-sm outline-none ring-ember/40 placeholder:text-muted/60 focus:ring-2"
              />
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="rounded-lg border border-steel-border bg-steel px-3 py-2 text-sm outline-none ring-ember/40 focus:ring-2"
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option === "all" ? "All languages" : option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {status === "loading" ? (
            <div className="rounded-2xl border border-dashed border-steel-border px-6 py-16 text-center text-muted">
              Heating the forge…
            </div>
          ) : visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-steel-border px-6 py-16 text-center text-muted">
              No snippets on the rack. Forge the first one.
            </div>
          ) : (
            <ul className="grid gap-4">
              {visible.map((snippet) => (
                <li
                  key={snippet.id}
                  className="overflow-hidden rounded-2xl border border-steel-border bg-steel/70"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-steel-border px-4 py-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{snippet.title}</h3>
                      <p className="font-mono text-xs text-muted">
                        {new Date(snippet.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-ember/30 bg-ember/10 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide text-ember-soft">
                        {snippet.language}
                      </span>
                      <button
                        type="button"
                        onClick={() => onCopy(snippet)}
                        className="rounded-md border border-steel-border px-2.5 py-1 text-xs text-muted transition hover:border-ember/50 hover:text-foreground"
                      >
                        {copiedId === snippet.id ? "Copied" : "Copy"}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(snippet.id)}
                        className="rounded-md border border-steel-border px-2.5 py-1 text-xs text-muted transition hover:border-red-500/50 hover:text-red-200"
                      >
                        Quench
                      </button>
                    </div>
                  </div>
                  <pre className="overflow-x-auto bg-[#0e0b08] px-4 py-4 font-mono text-[13px] leading-6 text-ember-soft">
                    <code>{snippet.code}</code>
                  </pre>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

function AnvilMark() {
  return (
    <span
      aria-hidden
      className="grid h-11 w-11 place-items-center rounded-xl border border-ember/40 bg-gradient-to-br from-ember to-[#9a3412] text-lg font-black text-[#1a0f05] shadow-[0_0_24px_rgba(255,122,24,0.45)]"
    >
      CF
    </span>
  );
}
