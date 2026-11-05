export const PROGRESS_KEY = "ce-progress-v1";
export const CODE_KEY_PREFIX = "ce-code:";

export type SubmissionStatus = "passed" | "failed" | "error";

export type StoredSubmission = {
  slug: string;
  title: string;
  status: SubmissionStatus;
  at: string;
  runtimeMs: number;
};

export type ProblemProgress = {
  status: "attempted" | "solved";
  attempts: number;
  hasSubmitted: boolean;
  pembahasan?: string;
};

export type LastItem = {
  kind: "lesson" | "problem";
  slug: string;
};

export type LocalProgress = {
  v: 1;
  completedLessons: string[];
  lastItem: LastItem | null;
  problems: Record<string, ProblemProgress>;
  submissions: StoredSubmission[];
};

export const EMPTY_PROGRESS: LocalProgress = {
  v: 1,
  completedLessons: [],
  lastItem: null,
  problems: {},
  submissions: [],
};

export function emptyProgress(): LocalProgress {
  return {
    v: 1,
    completedLessons: [],
    lastItem: null,
    problems: {},
    submissions: [],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseProgress(raw: string | null): LocalProgress {
  if (!raw) return emptyProgress();
  try {
    const data = JSON.parse(raw) as unknown;
    if (!isRecord(data) || data.v !== 1) return emptyProgress();
    const completedLessons = Array.isArray(data.completedLessons)
      ? data.completedLessons.filter((s): s is string => typeof s === "string")
      : [];
    const lastKind = isRecord(data.lastItem) ? data.lastItem.kind : null;
    const lastItem: LastItem | null =
      (lastKind === "lesson" || lastKind === "problem") &&
      isRecord(data.lastItem) &&
      typeof data.lastItem.slug === "string"
        ? { kind: lastKind, slug: data.lastItem.slug }
        : null;
    const problems: Record<string, ProblemProgress> = {};
    if (isRecord(data.problems)) {
      for (const [slug, value] of Object.entries(data.problems)) {
        if (!isRecord(value)) continue;
        if (value.status !== "attempted" && value.status !== "solved") continue;
        problems[slug] = {
          status: value.status,
          attempts: typeof value.attempts === "number" ? value.attempts : 0,
          hasSubmitted: Boolean(value.hasSubmitted),
          pembahasan: typeof value.pembahasan === "string" ? value.pembahasan : undefined,
        };
      }
    }
    const submissions: StoredSubmission[] = [];
    if (Array.isArray(data.submissions)) {
      for (const row of data.submissions) {
        if (!isRecord(row)) continue;
        if (typeof row.slug !== "string" || typeof row.title !== "string") continue;
        if (row.status !== "passed" && row.status !== "failed" && row.status !== "error") continue;
        if (typeof row.at !== "string") continue;
        submissions.push({
          slug: row.slug,
          title: row.title,
          status: row.status,
          at: row.at,
          runtimeMs: typeof row.runtimeMs === "number" ? row.runtimeMs : 0,
        });
      }
    }
    return { v: 1, completedLessons, lastItem, problems, submissions };
  } catch {
    return emptyProgress();
  }
}

export function loadProgress(): LocalProgress {
  if (typeof window === "undefined") return emptyProgress();
  try {
    return parseProgress(window.localStorage.getItem(PROGRESS_KEY));
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress: LocalProgress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function loadCode(slug: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  try {
    return window.localStorage.getItem(CODE_KEY_PREFIX + slug) ?? fallback;
  } catch {
    return fallback;
  }
}

export function saveCode(slug: string, code: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CODE_KEY_PREFIX + slug, code);
}

export function markLessonComplete(slug: string): LocalProgress {
  const progress = loadProgress();
  if (!progress.completedLessons.includes(slug)) {
    progress.completedLessons = [...progress.completedLessons, slug];
  }
  progress.lastItem = { kind: "lesson", slug };
  saveProgress(progress);
  return progress;
}

export function touchLastItem(kind: "lesson" | "problem", slug: string): LocalProgress {
  const progress = loadProgress();
  progress.lastItem = { kind, slug };
  saveProgress(progress);
  return progress;
}

export function recordSubmission(input: {
  slug: string;
  title: string;
  status: SubmissionStatus;
  runtimeMs: number;
  pembahasan?: string;
}): LocalProgress {
  const progress = loadProgress();
  const existing = progress.problems[input.slug];
  const nextStatus =
    input.status === "passed" || existing?.status === "solved" ? "solved" : "attempted";
  progress.problems[input.slug] = {
    status: nextStatus,
    attempts: (existing?.attempts ?? 0) + 1,
    hasSubmitted: true,
    pembahasan: input.pembahasan ?? existing?.pembahasan,
  };
  progress.submissions = [
    {
      slug: input.slug,
      title: input.title,
      status: input.status,
      at: new Date().toISOString(),
      runtimeMs: input.runtimeMs,
    },
    ...progress.submissions,
  ].slice(0, 200);
  progress.lastItem = { kind: "problem", slug: input.slug };
  saveProgress(progress);
  return progress;
}
