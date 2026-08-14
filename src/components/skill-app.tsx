"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { runExerciseTests } from "@/lib/run-tests";
import type {
  AssessmentQuestion,
  AssessmentResult,
  SkillLevel,
  TrainingExercise,
  UserProgress,
} from "@/lib/types";
import {
  LEVEL_DESCRIPTIONS,
  LEVEL_LABELS,
  TOPIC_LABELS,
} from "@/lib/types";

type View = "home" | "assessment" | "results" | "training";

type CurriculumPayload = {
  questions: AssessmentQuestion[];
  exercises: TrainingExercise[];
  progress: UserProgress;
};

export function SkillApp() {
  const [view, setView] = useState<View>("home");
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [exercises, setExercises] = useState<TrainingExercise[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCurriculum = useCallback(async () => {
    const response = await fetch("/api/curriculum");
    if (!response.ok) throw new Error("Gagal memuat data.");
    const data = (await response.json()) as CurriculumPayload;
    setQuestions(data.questions);
    setExercises(data.exercises);
    setProgress(data.progress);
    if (data.progress.assessment) {
      setView("home");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadCurriculum();
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Gagal memuat.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadCurriculum]);

  const level = progress?.assessment?.level ?? null;
  const recommendedExercises = useMemo(() => {
    if (!level) {
      return exercises.filter((ex) => ex.levels.includes("beginner"));
    }
    return exercises.filter((ex) => ex.levels.includes(level));
  }, [exercises, level]);

  const completedCount = progress?.completedExercises.length ?? 0;
  const totalRecommended = recommendedExercises.length;

  async function onAssessmentComplete(result: AssessmentResult) {
    setProgress((current) =>
      current
        ? { ...current, assessment: result }
        : {
            assessment: result,
            completedExercises: [],
            exerciseAttempts: {},
            updatedAt: result.completedAt,
          },
    );
    setView("results");
  }

  async function onReset() {
    setError(null);
    const response = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset" }),
    });
    if (!response.ok) {
      setError("Gagal reset progress.");
      return;
    }
    const data = (await response.json()) as { progress: UserProgress };
    setProgress(data.progress);
    setView("home");
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex flex-1 items-center justify-center px-6 py-24 text-muted">
          Memuat CodeForge…
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <header className="border-b border-steel-border/80 bg-steel/70 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-3">
            <LogoMark />
            <div>
              <p className="font-mono text-[11px] tracking-[0.28em] text-ember uppercase">
                Skill Lab
              </p>
              <h1 className="text-xl font-semibold tracking-tight">CodeForge</h1>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {(
              [
                ["home", "Beranda"],
                ["assessment", "Assessment"],
                ["training", "Latihan"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setView(key)}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  view === key
                    ? "bg-ember text-[#1a0f05] font-semibold"
                    : "border border-steel-border text-muted hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
            {progress?.assessment ? (
              <button
                type="button"
                onClick={() => setView("results")}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  view === "results"
                    ? "bg-ember text-[#1a0f05] font-semibold"
                    : "border border-steel-border text-muted hover:text-foreground"
                }`}
              >
                Hasil
              </button>
            ) : null}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        {error ? (
          <p className="mb-6 rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        {view === "home" ? (
          <HomeView
            progress={progress}
            completedCount={completedCount}
            totalRecommended={totalRecommended}
            onStartAssessment={() => setView("assessment")}
            onStartTraining={() => setView("training")}
            onViewResults={() => setView("results")}
            onReset={onReset}
          />
        ) : null}

        {view === "assessment" ? (
          <AssessmentView
            questions={questions}
            onComplete={onAssessmentComplete}
            onCancel={() => setView("home")}
            setError={setError}
          />
        ) : null}

        {view === "results" && progress?.assessment ? (
          <ResultsView
            result={progress.assessment}
            onRetake={() => setView("assessment")}
            onTrain={() => setView("training")}
          />
        ) : view === "results" ? (
          <EmptyResults onStart={() => setView("assessment")} />
        ) : null}

        {view === "training" ? (
          <TrainingView
            exercises={recommendedExercises}
            allExercises={exercises}
            progress={progress}
            level={level}
            onProgressChange={setProgress}
            setError={setError}
          />
        ) : null}
      </main>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-full flex-1 flex-col">{children}</div>;
}

function LogoMark() {
  return (
    <span
      aria-hidden
      className="grid h-11 w-11 place-items-center rounded-xl border border-ember/40 bg-gradient-to-br from-ember to-[#9a3412] text-lg font-black text-[#1a0f05] shadow-[0_0_24px_rgba(255,122,24,0.45)]"
    >
      CF
    </span>
  );
}

function HomeView({
  progress,
  completedCount,
  totalRecommended,
  onStartAssessment,
  onStartTraining,
  onViewResults,
  onReset,
}: {
  progress: UserProgress | null;
  completedCount: number;
  totalRecommended: number;
  onStartAssessment: () => void;
  onStartTraining: () => void;
  onViewResults: () => void;
  onReset: () => void;
}) {
  const assessment = progress?.assessment;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <section className="rounded-2xl border border-steel-border bg-steel/80 p-6 shadow-[0_0_80px_rgba(255,122,24,0.08)]">
        <h2 className="text-2xl font-semibold tracking-tight">
          Belajar ngoding lagi? Mulai di sini.
        </h2>
        <p className="mt-3 text-muted leading-relaxed">
          CodeForge menilai level skill kamu lewat assessment singkat, lalu
          memberi latihan coding yang disesuaikan — dari pemula sampai mahir.
        </p>
        <ol className="mt-6 space-y-3 text-sm">
          <li className="flex gap-3">
            <StepBadge n={1} />
            <span>
              <strong className="text-foreground">Assessment</strong> — 12
              pertanyaan tentang dasar, algoritma, async, dan pola.
            </span>
          </li>
          <li className="flex gap-3">
            <StepBadge n={2} />
            <span>
              <strong className="text-foreground">Hasil & level</strong> — tahu
              di level mana kamu dan topik mana yang perlu diperkuat.
            </span>
          </li>
          <li className="flex gap-3">
            <StepBadge n={3} />
            <span>
              <strong className="text-foreground">Latihan</strong> — kerjakan
              soal coding dengan hint, test otomatis, dan solusi.
            </span>
          </li>
        </ol>
        <div className="mt-8 flex flex-wrap gap-3">
          <PrimaryButton onClick={onStartAssessment}>
            {assessment ? "Ulangi assessment" : "Mulai assessment"}
          </PrimaryButton>
          <SecondaryButton onClick={onStartTraining}>Buka latihan</SecondaryButton>
          {assessment ? (
            <SecondaryButton onClick={onViewResults}>Lihat hasil</SecondaryButton>
          ) : null}
        </div>
      </section>

      <aside className="space-y-4">
        <StatCard
          title="Level kamu"
          value={assessment ? LEVEL_LABELS[assessment.level] : "Belum diukur"}
          hint={
            assessment
              ? `${assessment.score}% benar · ${LEVEL_DESCRIPTIONS[assessment.level]}`
              : "Kerjakan assessment untuk mengetahui level."
          }
        />
        <StatCard
          title="Progress latihan"
          value={`${completedCount} / ${totalRecommended}`}
          hint="Latihan selesai di level rekomendasi."
        />
        {assessment ? (
          <button
            type="button"
            onClick={onReset}
            className="w-full rounded-lg border border-steel-border px-4 py-2 text-sm text-muted transition hover:border-red-500/40 hover:text-red-200"
          >
            Reset semua progress
          </button>
        ) : null}
      </aside>
    </div>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ember/15 font-mono text-xs text-ember-soft">
      {n}
    </span>
  );
}

function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-steel-border bg-steel/70 p-5">
      <p className="text-sm text-muted">{title}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-muted leading-relaxed">{hint}</p>
    </div>
  );
}

function AssessmentView({
  questions,
  onComplete,
  onCancel,
  setError,
}: {
  questions: AssessmentQuestion[];
  onComplete: (result: AssessmentResult) => void;
  onCancel: () => void;
  setError: (msg: string | null) => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const question = questions[index];
  const selected = question ? answers[question.id] : undefined;
  const isLast = index === questions.length - 1;

  async function submitAll(finalAnswers: Record<string, number>) {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      const data = (await response.json()) as {
        result?: AssessmentResult;
        error?: string;
      };
      if (!response.ok || !data.result) {
        throw new Error(data.error ?? "Gagal submit assessment.");
      }
      onComplete(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal submit.");
    } finally {
      setSubmitting(false);
    }
  }

  function onNext() {
    if (!question || selected === undefined) return;
    if (isLast) {
      void submitAll(answers);
      return;
    }
    setIndex((current) => current + 1);
  }

  if (!question) {
    return (
      <p className="text-muted">Tidak ada pertanyaan assessment.</p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted">
          Pertanyaan {index + 1} dari {questions.length}
        </p>
        <div className="h-2 flex-1 max-w-xs overflow-hidden rounded-full bg-steel-raised">
          <div
            className="h-full bg-ember transition-all"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <article className="rounded-2xl border border-steel-border bg-steel/80 p-6">
        <p className="font-mono text-xs uppercase tracking-wide text-ember-soft">
          {TOPIC_LABELS[question.topic]}
        </p>
        <h2 className="mt-2 whitespace-pre-line text-lg font-semibold leading-relaxed">
          {question.question}
        </h2>
        {question.code ? (
          <pre className="mt-4 overflow-x-auto rounded-lg bg-[#0e0b08] px-4 py-3 font-mono text-[13px] leading-6 text-ember-soft">
            <code>{question.code}</code>
          </pre>
        ) : null}

        <ul className="mt-6 space-y-2">
          {question.options.map((option, optionIndex) => (
            <li key={option}>
              <button
                type="button"
                onClick={() =>
                  setAnswers((current) => ({
                    ...current,
                    [question.id]: optionIndex,
                  }))
                }
                className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition ${
                  selected === optionIndex
                    ? "border-ember bg-ember/10 text-foreground"
                    : "border-steel-border bg-steel-raised text-muted hover:border-ember/40 hover:text-foreground"
                }`}
              >
                <span className="font-mono text-ember-soft mr-2">
                  {String.fromCharCode(65 + optionIndex)}.
                </span>
                {option}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <SecondaryButton
            onClick={() => (index === 0 ? onCancel() : setIndex((c) => c - 1))}
          >
            {index === 0 ? "Batal" : "Sebelumnya"}
          </SecondaryButton>
          <PrimaryButton
            onClick={onNext}
            disabled={selected === undefined || submitting}
          >
            {submitting ? "Menghitung…" : isLast ? "Lihat hasil" : "Berikutnya"}
          </PrimaryButton>
        </div>
      </article>
    </div>
  );
}

function ResultsView({
  result,
  onRetake,
  onTrain,
}: {
  result: AssessmentResult;
  onRetake: () => void;
  onTrain: () => void;
}) {
  const weakTopics = result.topicScores
    .filter((t) => t.percent < 70)
    .map((t) => TOPIC_LABELS[t.topic]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <section className="rounded-2xl border border-steel-border bg-steel/80 p-6">
        <p className="font-mono text-xs uppercase tracking-wide text-ember-soft">
          Hasil assessment
        </p>
        <p className="mt-4 text-5xl font-bold text-ember">{result.score}%</p>
        <h2 className="mt-2 text-2xl font-semibold">
          Level: {result.levelLabel}
        </h2>
        <p className="mt-3 text-muted leading-relaxed">
          {LEVEL_DESCRIPTIONS[result.level]}
        </p>
        {weakTopics.length > 0 ? (
          <p className="mt-4 rounded-lg border border-amber-900/40 bg-amber-950/30 px-4 py-3 text-sm text-amber-100">
            Fokus latihan: <strong>{weakTopics.join(", ")}</strong>
          </p>
        ) : (
          <p className="mt-4 rounded-lg border border-emerald-900/40 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100">
            Semua topik di atas 70%. Tantang diri dengan latihan level lebih tinggi.
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <PrimaryButton onClick={onTrain}>Mulai latihan</PrimaryButton>
          <SecondaryButton onClick={onRetake}>Ulangi assessment</SecondaryButton>
        </div>
      </section>

      <section className="rounded-2xl border border-steel-border bg-steel/70 p-6">
        <h3 className="font-semibold">Breakdown per topik</h3>
        <ul className="mt-4 space-y-4">
          {result.topicScores.map((topic) => (
            <li key={topic.topic}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{TOPIC_LABELS[topic.topic]}</span>
                <span className="text-muted">
                  {topic.correct}/{topic.total} ({topic.percent}%)
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-steel-raised">
                <div
                  className={`h-full transition-all ${
                    topic.percent >= 70 ? "bg-emerald-500" : "bg-ember"
                  }`}
                  style={{ width: `${topic.percent}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function EmptyResults({ onStart }: { onStart: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-steel-border px-6 py-16 text-center">
      <p className="text-muted">Belum ada hasil assessment.</p>
      <div className="mt-4">
        <PrimaryButton onClick={onStart}>Mulai assessment</PrimaryButton>
      </div>
    </div>
  );
}

function TrainingView({
  exercises,
  allExercises,
  progress,
  level,
  onProgressChange,
  setError,
}: {
  exercises: TrainingExercise[];
  allExercises: TrainingExercise[];
  progress: UserProgress | null;
  level: SkillLevel | null;
  onProgressChange: (p: UserProgress) => void;
  setError: (msg: string | null) => void;
}) {
  const firstExercise = exercises[0];
  const [activeId, setActiveId] = useState<string | null>(
    firstExercise?.id ?? null,
  );
  const [code, setCode] = useState(firstExercise?.starterCode ?? "");
  const [hintIndex, setHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [testResult, setTestResult] = useState<ReturnType<
    typeof runExerciseTests
  > | null>(null);
  const [checking, setChecking] = useState(false);

  function selectExercise(id: string) {
    const next =
      exercises.find((ex) => ex.id === id) ??
      allExercises.find((ex) => ex.id === id);
    if (!next) return;
    setActiveId(id);
    setCode(next.starterCode);
    setHintIndex(0);
    setShowSolution(false);
    setTestResult(null);
  }

  const active =
    exercises.find((ex) => ex.id === activeId) ??
    allExercises.find((ex) => ex.id === activeId) ??
    null;

  async function onRunTests(event: FormEvent) {
    event.preventDefault();
    if (!active) return;
    setChecking(true);
    setError(null);
    setTestResult(null);

    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "attempt", exerciseId: active.id }),
    });

    const result = runExerciseTests(code, active);
    setTestResult(result);

    if (result.passed) {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete", exerciseId: active.id }),
      });
      if (response.ok) {
        const data = (await response.json()) as { progress: UserProgress };
        onProgressChange(data.progress);
      }
    }

    setChecking(false);
  }

  const completed = new Set(progress?.completedExercises ?? []);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-2xl border border-steel-border bg-steel/70 p-4">
        <h3 className="font-semibold">Latihan</h3>
        <p className="mt-1 text-sm text-muted">
          Level {level ? LEVEL_LABELS[level] : "Pemula"} · {exercises.length}{" "}
          soal rekomendasi
        </p>
        <ul className="mt-4 space-y-2">
          {exercises.map((exercise) => (
            <li key={exercise.id}>
              <button
                type="button"
                onClick={() => selectExercise(exercise.id)}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                  activeId === exercise.id
                    ? "border-ember bg-ember/10"
                    : "border-steel-border hover:border-ember/40"
                }`}
              >
                <span className="block font-medium">{exercise.title}</span>
                <span className="text-xs text-muted">
                  {TOPIC_LABELS[exercise.topic]}
                  {completed.has(exercise.id) ? " · ✓ selesai" : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
        {allExercises.length > exercises.length ? (
          <details className="mt-4 text-sm">
            <summary className="cursor-pointer text-muted hover:text-foreground">
              Semua latihan ({allExercises.length})
            </summary>
            <ul className="mt-2 space-y-1">
              {allExercises
                .filter((ex) => !exercises.some((r) => r.id === ex.id))
                .map((exercise) => (
                  <li key={exercise.id}>
                    <button
                      type="button"
                      onClick={() => selectExercise(exercise.id)}
                      className="w-full rounded px-2 py-1 text-left text-xs text-muted hover:bg-steel-raised hover:text-foreground"
                    >
                      {exercise.title}
                    </button>
                  </li>
                ))}
            </ul>
          </details>
        ) : null}
      </aside>

      {active ? (
        <section className="rounded-2xl border border-steel-border bg-steel/80 p-5">
          <p className="font-mono text-xs uppercase tracking-wide text-ember-soft">
            {TOPIC_LABELS[active.topic]}
          </p>
          <h2 className="mt-1 text-xl font-semibold">{active.title}</h2>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            {active.description}
          </p>

          <form className="mt-5 flex flex-col gap-4" onSubmit={onRunTests}>
            <textarea
              value={code}
              onChange={(event) => setCode(event.target.value)}
              rows={14}
              spellCheck={false}
              className="resize-y rounded-lg border border-steel-border bg-[#0e0b08] px-4 py-3 font-mono text-[13px] leading-6 text-ember-soft outline-none ring-ember/40 focus:ring-2"
            />

            <div className="flex flex-wrap gap-2">
              <PrimaryButton disabled={checking}>
                {checking ? "Mengetes…" : "Jalankan test"}
              </PrimaryButton>
              {active.hints.length > 0 ? (
                <SecondaryButton
                  type="button"
                  onClick={() =>
                    setHintIndex((current) =>
                      Math.min(current + 1, active.hints.length),
                    )
                  }
                >
                  Hint ({Math.min(hintIndex, active.hints.length)}/
                  {active.hints.length})
                </SecondaryButton>
              ) : null}
              <SecondaryButton
                type="button"
                onClick={() => setShowSolution((current) => !current)}
              >
                {showSolution ? "Sembunyikan solusi" : "Lihat solusi"}
              </SecondaryButton>
            </div>

            {hintIndex > 0 ? (
              <ul className="rounded-lg border border-amber-900/40 bg-amber-950/20 px-4 py-3 text-sm text-amber-100">
                {active.hints.slice(0, hintIndex).map((hint) => (
                  <li key={hint} className="list-disc ml-4">
                    {hint}
                  </li>
                ))}
              </ul>
            ) : null}

            {showSolution ? (
              <pre className="overflow-x-auto rounded-lg border border-steel-border bg-[#0e0b08] px-4 py-3 font-mono text-[13px] leading-6 text-ember-soft">
                <code>{active.solution}</code>
              </pre>
            ) : null}

            {testResult ? (
              <div
                className={`rounded-lg border px-4 py-3 text-sm ${
                  testResult.passed
                    ? "border-emerald-800/50 bg-emerald-950/30 text-emerald-100"
                    : "border-red-900/50 bg-red-950/30 text-red-100"
                }`}
              >
                <p className="font-semibold">
                  {testResult.passed
                    ? "Semua test lulus! Latihan ditandai selesai."
                    : "Belum lulus. Perbaiki kode dan coba lagi."}
                </p>
                <ul className="mt-2 space-y-2">
                  {testResult.results.map((item) => (
                    <li key={item.label} className="font-mono text-xs">
                      {item.passed ? "✓" : "✗"} {item.label}
                      {!item.passed ? (
                        <span className="block text-muted mt-0.5">
                          expected {item.expected} · got {item.actual}
                          {item.error ? ` · ${item.error}` : ""}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </form>
        </section>
      ) : (
        <div className="rounded-2xl border border-dashed border-steel-border px-6 py-16 text-center text-muted">
          Pilih latihan dari daftar.
        </div>
      )}
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg bg-ember px-4 py-2.5 text-sm font-semibold text-[#1a0f05] transition hover:bg-ember-soft disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg border border-steel-border px-4 py-2.5 text-sm text-muted transition hover:border-ember/50 hover:text-foreground disabled:opacity-60"
    >
      {children}
    </button>
  );
}
