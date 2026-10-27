"use client";

import { useEffect, useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { Markdown } from "@/components/markdown";
import type { PresentedResult } from "@/lib/judge/types";

type Props = {
  slug: string;
  title: string;
  prompt: string;
  starterCode: string;
  language: "js" | "ts";
  functionName: string;
  pembahasan: string | null;
  hasSubmitted: boolean;
  sampleTests: { args: unknown[]; expected: unknown }[];
};

type JudgeResponse = {
  status: "passed" | "failed" | "error";
  runtimeMs: number;
  stdout: string;
  error?: string;
  results: PresentedResult[];
  pembahasan?: string;
};

export function ProblemWorkspace(props: Props) {
  const storageKey = `ce-code:${props.slug}`;
  const [code, setCode] = useState(props.starterCode);
  const [pending, setPending] = useState<"run" | "submit" | null>(null);
  const [outcome, setOutcome] = useState<JudgeResponse | null>(null);
  const [pembahasan, setPembahasan] = useState(props.pembahasan);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem(storageKey);
    if (saved) setCode(saved);
  }, [storageKey]);

  function updateCode(next: string) {
    setCode(next);
    sessionStorage.setItem(storageKey, next);
  }

  async function call(mode: "run" | "submit") {
    setPending(mode);
    setError("");
    const res = await fetch(`/api/soal/${props.slug}/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = (await res.json().catch(() => ({}))) as JudgeResponse & { error?: string };
    setPending(null);
    if (!res.ok) {
      setError(data.error || "Gagal menjalankan kode.");
      return;
    }
    setOutcome(data);
    if (data.pembahasan) setPembahasan(data.pembahasan);
  }

  return (
    <div className="grid h-full min-h-0 lg:grid-cols-2">
      <section className="min-h-0 overflow-y-auto border-b border-steel-border p-5 lg:border-b-0 lg:border-r">
        <p className="mb-1 text-xs uppercase tracking-wide text-muted">
          {props.language === "ts" ? "TypeScript" : "JavaScript"} · {props.functionName}
        </p>
        <h1 className="mb-4 text-2xl font-semibold tracking-tight">{props.title}</h1>
        <Markdown content={props.prompt} />
        <div className="mt-6 rounded-lg border border-steel-border bg-steel/60 p-3 text-sm">
          <p className="mb-2 font-medium text-ember-soft">Contoh tes (tombol Jalankan)</p>
          <ul className="space-y-1 font-mono text-xs text-muted">
            {props.sampleTests.map((test, i) => (
              <li key={i}>
                {JSON.stringify(test.args)} → {JSON.stringify(test.expected)}
              </li>
            ))}
          </ul>
        </div>
        {pembahasan ? (
          <div className="mt-8 rounded-xl border border-ember/30 bg-steel-raised p-4">
            <h2 className="mb-3 text-lg font-semibold text-ember-soft">Pembahasan</h2>
            <Markdown content={pembahasan} />
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted">
            Pembahasan terbuka setelah kamu menekan <strong className="text-foreground">Kumpulkan</strong>{" "}
            pertama kali — lulus atau pun belum.
          </p>
        )}
      </section>

      <section className="flex min-h-[28rem] min-h-0 flex-col bg-[#0e0c0a] lg:min-h-0">
        <div className="min-h-[16rem] flex-1">
          <CodeEditor
            value={code}
            onChange={updateCode}
            language={props.language === "ts" ? "typescript" : "javascript"}
          />
        </div>
        <div className="border-t border-steel-border bg-steel p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => call("run")}
              disabled={pending !== null}
              data-testid="jalankan"
              className="rounded-md border border-steel-border px-4 py-2 text-sm hover:border-ember disabled:opacity-60"
            >
              {pending === "run" ? "Menjalankan…" : "Jalankan contoh"}
            </button>
            <button
              type="button"
              onClick={() => call("submit")}
              disabled={pending !== null}
              data-testid="kumpulkan"
              className="rounded-md bg-ember px-4 py-2 text-sm font-medium text-black hover:bg-ember-soft disabled:opacity-60"
            >
              {pending === "submit" ? "Menguji…" : "Kumpulkan"}
            </button>
          </div>
          {error && <p className="text-sm text-bad">{error}</p>}
          {outcome && <ResultPanel outcome={outcome} />}
        </div>
      </section>
    </div>
  );
}

function ResultPanel({ outcome }: { outcome: JudgeResponse }) {
  const tone =
    outcome.status === "passed" ? "text-good" : outcome.status === "error" ? "text-bad" : "text-ember-soft";
  const label =
    outcome.status === "passed"
      ? "Lulus semua tes"
      : outcome.status === "error"
        ? "Error"
        : "Belum lulus";

  return (
    <div className="space-y-3 text-sm">
      <p className={tone}>
        {label}
        <span className="ml-2 text-muted">({outcome.runtimeMs} ms)</span>
      </p>
      {outcome.error && <p className="text-bad">{outcome.error}</p>}
      {outcome.stdout ? (
        <pre className="overflow-x-auto rounded-md bg-black/40 p-2 font-mono text-xs text-muted">
          {outcome.stdout}
        </pre>
      ) : null}
      <ul className="space-y-2">
        {outcome.results.map((result) => (
          <li
            key={result.label}
            className="rounded-md border border-steel-border bg-background/40 px-3 py-2"
          >
            <div className="flex items-center justify-between gap-3">
              <span>{result.label}</span>
              <span className={result.passed ? "text-good" : "text-bad"}>
                {result.passed ? "Lulus" : "Gagal"}
              </span>
            </div>
            {result.input !== undefined && (
              <p className="mt-1 font-mono text-xs text-muted">
                input {result.input} · expected {result.expected} · actual {result.actual ?? "—"}
              </p>
            )}
            {result.error && <p className="mt-1 text-xs text-bad">{result.error}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
