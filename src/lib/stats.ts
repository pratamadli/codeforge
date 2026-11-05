import type { TrackTree } from "@/lib/content";
import type { LocalProgress } from "@/lib/progress";

export type ContinueItem = {
  href: string;
  title: string;
  kind: "lesson" | "problem";
  trackTitle: string;
  hint: string;
};

export type FocusItem = {
  href: string;
  title: string;
  kind: "lesson" | "problem";
  meta: string;
};

export type ActivityItem = {
  href: string;
  title: string;
  status: "passed" | "failed" | "error";
  at: string;
};

export type DayCount = {
  date: string;
  count: number;
};

export type TrackSummary = {
  slug: string;
  title: string;
  lessonsDone: number;
  lessonsTotal: number;
  problemsSolved: number;
  problemsAttempted: number;
  problemsTotal: number;
};

export type ProgressSummary = {
  lessonsDone: number;
  lessonsTotal: number;
  problemsSolved: number;
  problemsAttempted: number;
  problemsTotal: number;
  tracks: TrackSummary[];
};

export type DashboardData = {
  lessonsDone: number;
  lessonsTotal: number;
  problemsSolved: number;
  problemsTotal: number;
  problemsAttempted: number;
  tracksInProgress: number;
  percent: number;
  continueItem: ContinueItem | null;
  focus: FocusItem[];
  recent: ActivityItem[];
  activity: DayCount[];
  streak: number;
};

type OrderedItem = {
  href: string;
  title: string;
  kind: "lesson" | "problem";
  trackTitle: string;
  moduleTitle: string;
  slug: string;
  done: boolean;
};

function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function streakFromDays(days: Set<string>): number {
  const today = startOfUtcDay(new Date());
  let cursor = today;
  if (!days.has(isoDay(cursor))) {
    cursor = new Date(cursor.getTime() - 86400000);
  }
  let n = 0;
  while (days.has(isoDay(cursor))) {
    n += 1;
    cursor = new Date(cursor.getTime() - 86400000);
  }
  return n;
}

function orderedItems(tree: TrackTree[], progress: LocalProgress): OrderedItem[] {
  const completed = new Set(progress.completedLessons);
  const items: OrderedItem[] = [];
  for (const track of tree) {
    for (const mod of track.modules) {
      const mixed = [
        ...mod.lessons.map((lesson) => ({
          href: `/pelajaran/${lesson.slug}`,
          title: lesson.title,
          kind: "lesson" as const,
          slug: lesson.slug,
          order: lesson.order,
          done: completed.has(lesson.slug),
        })),
        ...mod.problems.map((problem) => ({
          href: `/soal/${problem.slug}`,
          title: problem.title,
          kind: "problem" as const,
          slug: problem.slug,
          order: problem.order,
          done: progress.problems[problem.slug]?.status === "solved",
        })),
      ].sort((a, b) => a.order - b.order);
      for (const item of mixed) {
        items.push({
          href: item.href,
          title: item.title,
          kind: item.kind,
          trackTitle: track.title,
          moduleTitle: mod.title,
          slug: item.slug,
          done: item.done,
        });
      }
    }
  }
  return items;
}

export function summarizeProgress(tree: TrackTree[], progress: LocalProgress): ProgressSummary {
  const completed = new Set(progress.completedLessons);
  const tracks = tree.map((track) => {
    const lessons = track.modules.flatMap((m) => m.lessons);
    const problems = track.modules.flatMap((m) => m.problems);
    const lessonsDone = lessons.filter((l) => completed.has(l.slug)).length;
    const problemsSolved = problems.filter((p) => progress.problems[p.slug]?.status === "solved").length;
    const problemsAttempted = problems.filter((p) => progress.problems[p.slug]).length;
    return {
      slug: track.slug,
      title: track.title,
      lessonsDone,
      lessonsTotal: lessons.length,
      problemsSolved,
      problemsAttempted,
      problemsTotal: problems.length,
    };
  });
  return {
    lessonsDone: tracks.reduce((sum, t) => sum + t.lessonsDone, 0),
    lessonsTotal: tracks.reduce((sum, t) => sum + t.lessonsTotal, 0),
    problemsSolved: tracks.reduce((sum, t) => sum + t.problemsSolved, 0),
    problemsAttempted: tracks.reduce((sum, t) => sum + t.problemsAttempted, 0),
    problemsTotal: tracks.reduce((sum, t) => sum + t.problemsTotal, 0),
    tracks,
  };
}

export function buildDashboard(tree: TrackTree[], progress: LocalProgress): DashboardData {
  const summary = summarizeProgress(tree, progress);
  const totalItems = summary.lessonsTotal + summary.problemsTotal;
  const doneItems = summary.lessonsDone + summary.problemsSolved;
  const percent = totalItems === 0 ? 0 : Math.round((doneItems / totalItems) * 100);
  const tracksInProgress = summary.tracks.filter((t) => {
    const tTotal = t.lessonsTotal + t.problemsTotal;
    const tDone = t.lessonsDone + t.problemsSolved;
    return tDone > 0 && tDone < tTotal;
  }).length;

  const ordered = orderedItems(tree, progress);
  const nextOpen = ordered.find((item) => !item.done) ?? null;
  let continueItem: ContinueItem | null = null;

  if (progress.lastItem) {
    const match = ordered.find(
      (item) => item.kind === progress.lastItem?.kind && item.slug === progress.lastItem.slug,
    );
    if (match && !match.done) {
      continueItem = {
        href: match.href,
        title: match.title,
        kind: match.kind,
        trackTitle: match.trackTitle,
        hint:
          match.kind === "problem" && progress.problems[match.slug]?.status === "attempted"
            ? `Percobaan terakhir belum lulus · ${match.moduleTitle}`
            : `${match.moduleTitle} · terakhir dibuka`,
      };
    }
  }

  if (!continueItem && nextOpen) {
    continueItem = {
      href: nextOpen.href,
      title: nextOpen.title,
      kind: nextOpen.kind,
      trackTitle: nextOpen.trackTitle,
      hint: `${nextOpen.moduleTitle} · ${nextOpen.kind === "lesson" ? "materi berikutnya" : "soal berikutnya"}`,
    };
  }

  const focus = ordered
    .filter((item) => !item.done && item.href !== continueItem?.href)
    .slice(0, 4)
    .map((item) => ({
      href: item.href,
      title: item.title,
      kind: item.kind,
      meta: `${item.trackTitle} · ${item.kind === "lesson" ? "Materi" : "Soal"}`,
    }));

  const recent: ActivityItem[] = progress.submissions.slice(0, 8).map((row) => ({
    href: `/soal/${row.slug}`,
    title: row.title,
    status: row.status,
    at: row.at,
  }));

  const windowDays = 84;
  const since = new Date(Date.now() - (windowDays - 1) * 86400000);
  const counts = new Map<string, number>();
  for (const row of progress.submissions) {
    const key = isoDay(new Date(row.at));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const activity: DayCount[] = [];
  const start = startOfUtcDay(since);
  for (let i = 0; i < windowDays; i++) {
    const day = new Date(start.getTime() + i * 86400000);
    const key = isoDay(day);
    activity.push({ date: key, count: counts.get(key) ?? 0 });
  }

  const activeDays = new Set(activity.filter((d) => d.count > 0).map((d) => d.date));

  return {
    lessonsDone: summary.lessonsDone,
    lessonsTotal: summary.lessonsTotal,
    problemsSolved: summary.problemsSolved,
    problemsTotal: summary.problemsTotal,
    problemsAttempted: summary.problemsAttempted,
    tracksInProgress,
    percent,
    continueItem,
    focus,
    recent,
    activity,
    streak: streakFromDays(activeDays),
  };
}

export type PracticeProblem = {
  slug: string;
  title: string;
  language: "js" | "ts";
  difficulty: string;
  trackTitle: string;
  status: "solved" | "attempted" | "open";
};

export function getPracticeList(tree: TrackTree[], progress: LocalProgress): PracticeProblem[] {
  const list: PracticeProblem[] = [];
  for (const track of tree) {
    for (const mod of track.modules) {
      for (const problem of mod.problems) {
        const state = progress.problems[problem.slug];
        list.push({
          slug: problem.slug,
          title: problem.title,
          language: problem.language,
          difficulty: problem.difficulty,
          trackTitle: track.title,
          status: state?.status === "solved" ? "solved" : state ? "attempted" : "open",
        });
      }
    }
  }
  return list;
}
