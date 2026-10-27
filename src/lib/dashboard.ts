import { connectDB } from "@/lib/db";
import { getTrackTree, summarizeProgress } from "@/lib/data";
import { Problem, Submission } from "@/lib/models";

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

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const [summary, tree] = await Promise.all([summarizeProgress(userId), getTrackTree()]);
  const totalItems = summary.lessonsTotal + summary.problemsTotal;
  const doneItems = summary.lessonsDone + summary.problemsSolved;
  const percent = totalItems === 0 ? 0 : Math.round((doneItems / totalItems) * 100);
  const tracksInProgress = summary.tracks.filter((t) => {
    const tTotal = t.lessonsTotal + t.problemsTotal;
    const tDone = t.lessonsDone + t.problemsSolved;
    return tDone > 0 && tDone < tTotal;
  }).length;

  type Ordered = {
    href: string;
    title: string;
    kind: "lesson" | "problem";
    trackTitle: string;
    moduleTitle: string;
    id: string;
    done: boolean;
  };

  const ordered: Ordered[] = [];
  for (const track of tree) {
    for (const mod of track.modules) {
      for (const lesson of mod.lessons) {
        ordered.push({
          href: `/pelajaran/${lesson.slug}`,
          title: lesson.title,
          kind: "lesson",
          trackTitle: track.title,
          moduleTitle: mod.title,
          id: lesson.id,
          done: summary.completedLessons.has(lesson.id),
        });
      }
      for (const problem of mod.problems) {
        ordered.push({
          href: `/soal/${problem.slug}`,
          title: problem.title,
          kind: "problem",
          trackTitle: track.title,
          moduleTitle: mod.title,
          id: problem.id,
          done: summary.problemMap.get(problem.id)?.status === "solved",
        });
      }
    }
  }

  const nextOpen = ordered.find((item) => !item.done) ?? null;
  let continueItem: ContinueItem | null = null;

  await connectDB();
  const lastFail = await Submission.findOne({
    userId,
    status: { $in: ["failed", "error"] },
  })
    .sort({ createdAt: -1 })
    .lean<{ problemId: { toString(): string }; createdAt: Date }>();

  if (lastFail) {
    const pid = String(lastFail.problemId);
    const stat = summary.problemMap.get(pid);
    if (stat && stat.status !== "solved") {
      const match = ordered.find((item) => item.kind === "problem" && item.id === pid);
      if (match) {
        continueItem = {
          href: match.href,
          title: match.title,
          kind: "problem",
          trackTitle: match.trackTitle,
          hint: `Percobaan terakhir belum lulus · ${match.moduleTitle}`,
        };
      }
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

  const recentRows = await Submission.find({ userId })
    .sort({ createdAt: -1 })
    .limit(8)
    .lean<{ problemId: { toString(): string }; status: "passed" | "failed" | "error"; createdAt: Date }[]>();

  const problemIds = [...new Set(recentRows.map((row) => String(row.problemId)))];
  const problems = await Problem.find({ _id: { $in: problemIds } })
    .select("slug title")
    .lean<{ _id: { toString(): string }; slug: string; title: string }[]>();
  const problemById = new Map(problems.map((p) => [String(p._id), p]));

  const recent: ActivityItem[] = recentRows.map((row) => {
    const problem = problemById.get(String(row.problemId));
    return {
      href: problem ? `/soal/${problem.slug}` : "/latihan",
      title: problem?.title ?? "Soal",
      status: row.status,
      at: row.createdAt.toISOString(),
    };
  });

  const windowDays = 84;
  const since = new Date(Date.now() - (windowDays - 1) * 86400000);
  const activityRows = await Submission.find({
    userId,
    createdAt: { $gte: startOfUtcDay(since) },
  })
    .select("createdAt")
    .lean<{ createdAt: Date }[]>();

  const counts = new Map<string, number>();
  for (const row of activityRows) {
    const key = isoDay(row.createdAt);
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
  for (const row of recentRows) {
    activeDays.add(isoDay(row.createdAt));
  }

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
  id: string;
  slug: string;
  title: string;
  language: "js" | "ts";
  difficulty: string;
  trackTitle: string;
  status: "solved" | "attempted" | "open";
};

export async function getPracticeList(userId: string): Promise<PracticeProblem[]> {
  const [tree, summary] = await Promise.all([getTrackTree(), summarizeProgress(userId)]);
  const list: PracticeProblem[] = [];
  for (const track of tree) {
    for (const mod of track.modules) {
      for (const problem of mod.problems) {
        const state = summary.problemMap.get(problem.id);
        list.push({
          id: problem.id,
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
