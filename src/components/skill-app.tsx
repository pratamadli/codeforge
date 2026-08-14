"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { runExerciseTests } from "@/lib/run-tests";
import type {
  AssessmentMode,
  AssessmentQuestion,
  AssessmentResult,
  ConceptBite,
  SkillLevel,
  TrainingExercise,
  UserProgress,
} from "@/lib/types";
import {
  LEVEL_DESCRIPTIONS,
  LEVEL_LABELS,
  TOPIC_LABELS,
} from "@/lib/types";

type View = "home" | "session" | "concepts" | "assessment" | "results" | "training";

type NextSession = {
  concept: ConceptBite;
  weakTopics: string[];
  estimatedMinutes: number;
};

type CurriculumPayload = {
  questions: AssessmentQuestion[];
  quickQuestions: AssessmentQuestion[];
  concepts: ConceptBite[];
  exercises: TrainingExercise[];
  progress: UserProgress;
  nextSession: NextSession;
};

export function SkillApp() {
  const [view, setView] = useState<View>("home");
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [quickQuestions, setQuickQuestions] = useState<AssessmentQuestion[]>([]);
  const [concepts, setConcepts] = useState<ConceptBite[]>([]);
  const [exercises, setExercises] = useState<TrainingExercise[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [nextSession, setNextSession] = useState<NextSession | null>(null);
  const [assessmentMode, setAssessmentMode] = useState<AssessmentMode>("quick");
  const [sessionConcept, setSessionConcept] = useState<ConceptBite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCurriculum = useCallback(async () => {
    const response = await fetch("/api/curriculum");
    if (!response.ok) throw new Error("Gagal memuat data.");
    const data = (await response.json()) as CurriculumPayload;
    setQuestions(data.questions);
    setQuickQuestions(data.quickQuestions);
    setConcepts(data.concepts);
    setExercises(data.exercises);
    setProgress(data.progress);
    setNextSession(data.nextSession);
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
    if (!level) return exercises.filter((ex) => ex.levels.includes("beginner"));
    return exercises.filter((ex) => ex.levels.includes(level));
  }, [exercises, level]);

  const completedConcepts = progress?.completedConcepts.length ?? 0;
  const completedExercises = progress?.completedExercises.length ?? 0;

  function startSession(concept?: ConceptBite) {
    setSessionConcept(concept ?? nextSession?.concept ?? concepts[0] ?? null);
    setView("session");
  }

  function startAssessment(mode: AssessmentMode) {
    setAssessmentMode(mode);
    setView("assessment");
  }

  async function onAssessmentComplete() {
    await loadCurriculum();
    setView("results");
  }

  async function onSessionComplete(conceptId: string) {
    setError(null);
    const response = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "completeSession", conceptId }),
    });
    if (response.ok) {
      const data = (await response.json()) as { progress: UserProgress };
      setProgress(data.progress);
      await loadCurriculum();
    }
    setView("home");
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
    await loadCurriculum();
    setView("home");
  }

  const activeQuestions =
    assessmentMode === "quick" ? quickQuestions : questions;

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
      <Header
        view={view}
        onNavigate={setView}
        onSession={() => startSession()}
        hasResult={!!progress?.assessment}
      />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        {error ? (
          <p className="mb-6 rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        {view === "home" ? (
          <HomeView
            progress={progress}
            nextSession={nextSession}
            completedConcepts={completedConcepts}
            totalConcepts={concepts.length}
            completedExercises={completedExercises}
            totalExercises={recommendedExercises.length}
            onStartSession={() => startSession()}
            onStartQuickAssessment={() => startAssessment("quick")}
            onStartFullAssessment={() => startAssessment("full")}
            onViewConcepts={() => setView("concepts")}
            onViewResults={() => setView("results")}
            onStartTraining={() => setView("training")}
            onReset={onReset}
          />
        ) : null}

        {view === "session" && sessionConcept ? (
          <SessionView
            concept={sessionConcept}
            onComplete={() => onSessionComplete(sessionConcept.id)}
            onBack={() => setView("home")}
          />
        ) : null}

        {view === "concepts" ? (
          <ConceptsView
            concepts={concepts}
            completed={new Set(progress?.completedConcepts ?? [])}
            onSelect={(concept) => startSession(concept)}
          />
        ) : null}

        {view === "assessment" ? (
          <AssessmentView
            questions={activeQuestions}
            mode={assessmentMode}
            onComplete={onAssessmentComplete}
            onCancel={() => setView("home")}
            setError={setError}
          />
        ) : null}

        {view === "results" && progress?.assessment ? (
          <ResultsView
            result={progress.assessment}
            onRetakeQuick={() => startAssessment("quick")}
            onTrain={() => setView("training")}
            onSession={() => startSession()}
          />
        ) : view === "results" ? (
          <EmptyResults onStart={() => startAssessment("quick")} />
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

function Header({
  view,
  onNavigate,
  onSession,
  hasResult,
}: {
  view: View;
  onNavigate: (v: View) => void;
  onSession: () => void;
  hasResult: boolean;
}) {
  const links: { key: View; label: string; action?: () => void }[] = [
    { key: "home", label: "Beranda" },
    { key: "session", label: "Sesi", action: onSession },
    { key: "concepts", label: "Konsep" },
    { key: "training", label: "Latihan" },
  ];

  return (
    <header className="border-b border-steel-border/80 bg-steel/70 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <div className="flex items-center gap-3">
          <LogoMark />
          <div>
            <p className="font-mono text-[11px] tracking-[0.28em] text-ember uppercase">
              Interview Prep
            </p>
            <h1 className="text-xl font-semibold tracking-tight">CodeForge</h1>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          {links.map(({ key, label, action }) => (
            <NavButton
              key={key}
              active={view === key}
              onClick={() => (action ? action() : onNavigate(key))}
            >
              {label}
            </NavButton>
          ))}
          {hasResult ? (
            <NavButton active={view === "results"} onClick={() => onNavigate("results")}>
              Hasil
            </NavButton>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

function HomeView({
  progress,
  nextSession,
  completedConcepts,
  totalConcepts,
  completedExercises,
  totalExercises,
  onStartSession,
  onStartQuickAssessment,
  onStartFullAssessment,
  onViewConcepts,
  onViewResults,
  onStartTraining,
  onReset,
}: {
  progress: UserProgress | null;
  nextSession: NextSession | null;
  completedConcepts: number;
  totalConcepts: number;
  completedExercises: number;
  totalExercises: number;
  onStartSession: () => void;
  onStartQuickAssessment: () => void;
  onStartFullAssessment: () => void;
  onViewConcepts: () => void;
  onViewResults: () => void;
  onStartTraining: () => void;
  onReset: () => void;
}) {
  const assessment = progress?.assessment;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <section className="rounded-2xl border border-steel-border bg-steel/80 p-6 shadow-[0_0_80px_rgba(255,122,24,0.08)]">
        <p className="font-mono text-xs uppercase tracking-wide text-ember-soft">
          Buat yang sibuk
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Pahami konsep, bukan hafalan panjang
        </h2>
        <p className="mt-3 text-muted leading-relaxed">
          Banyak gagal interview bukan karena tidak bisa kode, tapi sulit{" "}
          <strong className="text-foreground">menjelaskan konsep</strong> dengan
          bahasa sederhana. CodeForge bantu latihan itu — modul pendek, ~5 menit
          per sesi.
        </p>

        {nextSession ? (
          <div className="mt-6 rounded-xl border border-ember/30 bg-ember/5 p-4">
            <p className="text-sm font-medium">Sesi berikutnya · ~{nextSession.estimatedMinutes} menit</p>
            <p className="mt-1 text-lg font-semibold">{nextSession.concept.title}</p>
            <p className="mt-1 text-sm text-muted">
              {TOPIC_LABELS[nextSession.concept.topic]}
              {nextSession.weakTopics.length > 0
                ? ` · fokus: ${nextSession.weakTopics.join(", ")}`
                : ""}
            </p>
            <div className="mt-4">
              <PrimaryButton onClick={onStartSession}>Mulai sesi 5 menit</PrimaryButton>
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <SecondaryButton onClick={onStartQuickAssessment}>
            Cek cepat (~3 menit)
          </SecondaryButton>
          <SecondaryButton onClick={onStartFullAssessment}>
            Assessment lengkap (~10 menit)
          </SecondaryButton>
          <SecondaryButton onClick={onViewConcepts}>Lihat semua konsep</SecondaryButton>
          <SecondaryButton onClick={onStartTraining}>Latihan kode</SecondaryButton>
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
              ? `${assessment.score}% · ${assessment.mode === "quick" ? "cek cepat" : "lengkap"}`
              : "Mulai cek cepat 5 pertanyaan dulu."
          }
        />
        <StatCard
          title="Konsep selesai"
          value={`${completedConcepts} / ${totalConcepts}`}
          hint="Modul penjelasan singkat + latihan interview."
        />
        <StatCard
          title="Sesi selesai"
          value={String(progress?.sessionsCompleted ?? 0)}
          hint="Setiap sesi ~5 menit. Konsisten > marathon."
        />
        <StatCard
          title="Latihan kode"
          value={`${completedExercises} / ${totalExercises}`}
          hint="Opsional — kalau ada waktu extra."
        />
        {assessment || completedConcepts > 0 ? (
          <button
            type="button"
            onClick={onReset}
            className="w-full rounded-lg border border-steel-border px-4 py-2 text-sm text-muted transition hover:border-red-500/40 hover:text-red-200"
          >
            Reset progress
          </button>
        ) : null}
      </aside>
    </div>
  );
}

function SessionView({
  concept,
  onComplete,
  onBack,
}: {
  concept: ConceptBite;
  onComplete: () => void;
  onBack: () => void;
}) {
  const [step, setStep] = useState(0);
  const [revealedChecks, setRevealedChecks] = useState<Set<string>>(new Set());

  const steps = [
    { title: "Penjelasan", key: "explain" },
    { title: "Analogi", key: "analogy" },
    { title: "Tips interview", key: "interview" },
    { title: "Cek pemahaman", key: "check" },
  ] as const;

  const isLast = step === steps.length - 1;

  function revealCheck(id: string) {
    setRevealedChecks((current) => new Set(current).add(id));
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-muted">
          Sesi · {concept.minutes} menit · {TOPIC_LABELS[concept.topic]}
        </p>
        <p className="text-sm text-muted">
          Langkah {step + 1}/{steps.length}
        </p>
      </div>

      <div className="mb-6 h-2 overflow-hidden rounded-full bg-steel-raised">
        <div
          className="h-full bg-ember transition-all"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      <article className="rounded-2xl border border-steel-border bg-steel/80 p-6">
        <h2 className="text-xl font-semibold">{concept.title}</h2>
        <p className="mt-1 text-sm text-muted">{steps[step]?.title}</p>

        {step === 0 ? (
          <div className="mt-4 space-y-3 text-sm leading-relaxed whitespace-pre-line">
            {concept.simpleExplanation}
          </div>
        ) : null}

        {step === 1 ? (
          <div className="mt-4 rounded-lg border border-steel-border bg-steel-raised p-4 text-sm leading-relaxed">
            <p className="font-medium text-ember-soft mb-2">Bayangkan seperti ini:</p>
            {concept.analogy}
          </div>
        ) : null}

        {step === 2 ? (
          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-emerald-900/40 bg-emerald-950/25 p-4">
              <p className="text-xs font-mono uppercase tracking-wide text-emerald-300 mb-2">
                Kalau ditanya interviewer, coba jawab:
              </p>
              <p className="text-sm leading-relaxed">{concept.interviewTip}</p>
            </div>
            <div className="rounded-lg border border-red-900/30 bg-red-950/20 p-4 text-sm">
              <p className="font-medium text-red-200 mb-1">Hindari:</p>
              <p className="text-muted">{concept.commonMistake}</p>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-muted">
              Jawab di kepala dulu, baru buka jawaban. Latihan menjelaskan dengan
              mulut/kata-kata sendiri.
            </p>
            {concept.checkQuestions.map((check) => (
              <div
                key={check.id}
                className="rounded-lg border border-steel-border bg-steel-raised p-4"
              >
                <p className="text-sm font-medium">{check.question}</p>
                {revealedChecks.has(check.id) ? (
                  <p className="mt-2 text-sm text-ember-soft">{check.answer}</p>
                ) : (
                  <button
                    type="button"
                    onClick={() => revealCheck(check.id)}
                    className="mt-2 text-sm text-muted underline hover:text-foreground"
                  >
                    Lihat jawaban
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <SecondaryButton onClick={() => (step === 0 ? onBack() : setStep((s) => s - 1))}>
            {step === 0 ? "Kembali" : "Sebelumnya"}
          </SecondaryButton>
          {isLast ? (
            <PrimaryButton onClick={onComplete}>Selesai sesi ✓</PrimaryButton>
          ) : (
            <PrimaryButton onClick={() => setStep((s) => s + 1)}>Lanjut</PrimaryButton>
          )}
        </div>
      </article>
    </div>
  );
}

function ConceptsView({
  concepts,
  completed,
  onSelect,
}: {
  concepts: ConceptBite[];
  completed: Set<string>;
  onSelect: (concept: ConceptBite) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold">Konsep singkat</h2>
      <p className="mt-1 text-sm text-muted">
        Tiap modul 3–5 menit. Penjelasan awam + tips interview.
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {concepts.map((concept) => (
          <li key={concept.id}>
            <button
              type="button"
              onClick={() => onSelect(concept)}
              className="h-full w-full rounded-xl border border-steel-border bg-steel/70 p-4 text-left transition hover:border-ember/40"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{concept.title}</p>
                <span className="shrink-0 font-mono text-[11px] text-muted">
                  {concept.minutes}m
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">{TOPIC_LABELS[concept.topic]}</p>
              {completed.has(concept.id) ? (
                <p className="mt-2 text-xs text-emerald-400">✓ selesai</p>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AssessmentView({
  questions,
  mode,
  onComplete,
  onCancel,
  setError,
}: {
  questions: AssessmentQuestion[];
  mode: AssessmentMode;
  onComplete: () => void;
  onCancel: () => void;
  setError: (msg: string | null) => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const question = questions[index];
  const selected = question ? answers[question.id] : undefined;
  const isLast = index === questions.length - 1;
  const isCorrect = question && selected === question.correctIndex;

  async function submitAll(finalAnswers: Record<string, number>) {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers, mode }),
      });
      const data = (await response.json()) as {
        result?: AssessmentResult;
        error?: string;
      };
      if (!response.ok || !data.result) {
        throw new Error(data.error ?? "Gagal submit assessment.");
      }
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal submit.");
    } finally {
      setSubmitting(false);
    }
  }

  function onNext() {
    if (!question || selected === undefined) return;
    if (!showFeedback) {
      setShowFeedback(true);
      return;
    }
    setShowFeedback(false);
    if (isLast) {
      void submitAll(answers);
      return;
    }
    setIndex((current) => current + 1);
  }

  if (!question) {
    return <p className="text-muted">Tidak ada pertanyaan.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="mb-2 text-sm text-muted">
        {mode === "quick" ? "Cek cepat" : "Assessment lengkap"} · {index + 1}/
        {questions.length}
      </p>

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

        {!showFeedback ? (
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
        ) : (
          <div
            className={`mt-6 rounded-lg border p-4 text-sm ${
              isCorrect
                ? "border-emerald-800/50 bg-emerald-950/30 text-emerald-100"
                : "border-amber-900/50 bg-amber-950/30 text-amber-100"
            }`}
          >
            <p className="font-semibold">{isCorrect ? "Benar!" : "Belum tepat — pelajari:"}</p>
            <p className="mt-2">{question.explanation}</p>
            <div className="mt-3 rounded border border-steel-border/50 bg-steel/40 p-3">
              <p className="text-xs font-mono uppercase tracking-wide text-ember-soft mb-1">
                Cara jelaskan di interview
              </p>
              <p>{question.interviewAnswer}</p>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <SecondaryButton
            onClick={() => {
              if (showFeedback) setShowFeedback(false);
              else if (index === 0) onCancel();
              else setIndex((c) => c - 1);
            }}
          >
            {showFeedback ? "Ubah jawaban" : index === 0 ? "Batal" : "Sebelumnya"}
          </SecondaryButton>
          <PrimaryButton
            onClick={onNext}
            disabled={selected === undefined || submitting}
          >
            {submitting
              ? "Menghitung…"
              : !showFeedback
                ? "Cek jawaban"
                : isLast
                  ? "Lihat hasil"
                  : "Berikutnya"}
          </PrimaryButton>
        </div>
      </article>
    </div>
  );
}

function ResultsView({
  result,
  onRetakeQuick,
  onTrain,
  onSession,
}: {
  result: AssessmentResult;
  onRetakeQuick: () => void;
  onTrain: () => void;
  onSession: () => void;
}) {
  const weakTopics = result.topicScores
    .filter((t) => t.percent < 70)
    .map((t) => TOPIC_LABELS[t.topic]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <section className="rounded-2xl border border-steel-border bg-steel/80 p-6">
        <p className="font-mono text-xs uppercase tracking-wide text-ember-soft">
          Hasil · {result.mode === "quick" ? "cek cepat" : "lengkap"}
        </p>
        <p className="mt-4 text-5xl font-bold text-ember">{result.score}%</p>
        <h2 className="mt-2 text-2xl font-semibold">Level: {result.levelLabel}</h2>
        <p className="mt-3 text-muted leading-relaxed">
          {LEVEL_DESCRIPTIONS[result.level]}
        </p>
        {weakTopics.length > 0 ? (
          <p className="mt-4 rounded-lg border border-amber-900/40 bg-amber-950/30 px-4 py-3 text-sm text-amber-100">
            Latih penjelasan konsep: <strong>{weakTopics.join(", ")}</strong>
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <PrimaryButton onClick={onSession}>Sesi 5 menit</PrimaryButton>
          <SecondaryButton onClick={onTrain}>Latihan kode</SecondaryButton>
          <SecondaryButton onClick={onRetakeQuick}>Ulangi cek cepat</SecondaryButton>
        </div>
      </section>

      <section className="rounded-2xl border border-steel-border bg-steel/70 p-6">
        <h3 className="font-semibold">Skor per topik</h3>
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
                  className={`h-full ${topic.percent >= 70 ? "bg-emerald-500" : "bg-ember"}`}
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
      <p className="text-muted">Belum ada hasil. Cek cepat cuma ~3 menit.</p>
      <div className="mt-4">
        <PrimaryButton onClick={onStart}>Mulai cek cepat</PrimaryButton>
      </div>
    </div>
  );
}

function TrainingView({
  exercises,
  allExercises,
  progress,
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
  const [activeId, setActiveId] = useState<string | null>(firstExercise?.id ?? null);
  const [code, setCode] = useState(firstExercise?.starterCode ?? "");
  const [hintIndex, setHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [testResult, setTestResult] = useState<ReturnType<typeof runExerciseTests> | null>(null);
  const [checking, setChecking] = useState(false);

  function selectExercise(id: string) {
    const next =
      exercises.find((ex) => ex.id === id) ?? allExercises.find((ex) => ex.id === id);
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
    <div>
      <p className="mb-4 text-sm text-muted">
        Opsional — latihan kode kalau ada waktu extra. Fokus utama tetap sesi konsep.
      </p>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-2xl border border-steel-border bg-steel/70 p-4">
          <h3 className="font-semibold">Latihan kode</h3>
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
                    ~{exercise.minutes}m · {TOPIC_LABELS[exercise.topic]}
                    {completed.has(exercise.id) ? " · ✓" : ""}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {active ? (
          <section className="rounded-2xl border border-steel-border bg-steel/80 p-5">
            <h2 className="text-xl font-semibold">{active.title}</h2>
            <p className="mt-2 text-sm text-muted">{active.description}</p>
            <form className="mt-5 flex flex-col gap-4" onSubmit={onRunTests}>
              <textarea
                value={code}
                onChange={(event) => setCode(event.target.value)}
                rows={12}
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
                      setHintIndex((c) => Math.min(c + 1, active.hints.length))
                    }
                  >
                    Hint ({Math.min(hintIndex, active.hints.length)}/{active.hints.length})
                  </SecondaryButton>
                ) : null}
                <SecondaryButton
                  type="button"
                  onClick={() => setShowSolution((c) => !c)}
                >
                  {showSolution ? "Sembunyikan solusi" : "Lihat solusi"}
                </SecondaryButton>
              </div>
              {hintIndex > 0 ? (
                <ul className="rounded-lg border border-amber-900/40 bg-amber-950/20 px-4 py-3 text-sm text-amber-100">
                  {active.hints.slice(0, hintIndex).map((hint) => (
                    <li key={hint} className="ml-4 list-disc">
                      {hint}
                    </li>
                  ))}
                </ul>
              ) : null}
              {showSolution ? (
                <pre className="overflow-x-auto rounded-lg border border-steel-border bg-[#0e0b08] px-4 py-3 font-mono text-[13px] text-ember-soft">
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
                    {testResult.passed ? "Lulus!" : "Belum lulus — coba lagi."}
                  </p>
                </div>
              ) : null}
            </form>
          </section>
        ) : null}
      </div>
    </div>
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

function NavButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm transition ${
        active
          ? "bg-ember font-semibold text-[#1a0f05]"
          : "border border-steel-border text-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function StatCard({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-steel-border bg-steel/70 p-5">
      <p className="text-sm text-muted">{title}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-muted leading-relaxed">{hint}</p>
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
