import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { Lesson, Module, Problem, Progress, Submission, Track } from "@/lib/models";

type Id = { _id: Types.ObjectId };

type TrackDoc = Id & {
  slug: string;
  title: string;
  description: string;
  order: number;
};

type ModuleDoc = Id & {
  trackId: Types.ObjectId;
  slug: string;
  title: string;
  description: string;
  order: number;
};

type LessonListDoc = Id & {
  moduleId: Types.ObjectId;
  slug: string;
  title: string;
  order: number;
};

type LessonDoc = LessonListDoc & { markdown: string };

type ProblemListDoc = Id & {
  moduleId: Types.ObjectId;
  slug: string;
  title: string;
  order: number;
  language: "js" | "ts";
  difficulty: string;
  skillLevel: string;
};

type TestCase = { args: unknown[]; expected: unknown };

type ProblemDoc = ProblemListDoc & {
  prompt: string;
  starterCode: string;
  functionName: string;
  tags: string[];
  sampleTests: TestCase[];
  hiddenTests: TestCase[];
  pembahasan: string;
};

export type ProblemStat = {
  problemId: Types.ObjectId;
  slug: string;
  status: "attempted" | "solved";
  attempts: number;
};

type ProgressDoc = {
  userId: Types.ObjectId;
  completedLessonIds: Types.ObjectId[];
  problems: ProblemStat[];
};

export type TrackTreeModule = {
  id: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  lessons: { id: string; slug: string; title: string; order: number }[];
  problems: {
    id: string;
    slug: string;
    title: string;
    order: number;
    language: "js" | "ts";
    difficulty: string;
    skillLevel: string;
  }[];
};

export type TrackTree = {
  id: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  modules: TrackTreeModule[];
};

export async function getProgress(userId: string): Promise<ProgressDoc> {
  await connectDB();
  let progress = await Progress.findOne({ userId }).lean<ProgressDoc>();
  if (!progress) {
    const created = await Progress.create({
      userId,
      completedLessonIds: [],
      problems: [],
    });
    progress = created.toObject() as ProgressDoc;
  }
  return progress;
}

export function lessonDone(progress: ProgressDoc, lessonId: string) {
  return progress.completedLessonIds.some((id) => String(id) === lessonId);
}

export async function getTrackTree(): Promise<TrackTree[]> {
  await connectDB();
  const tracks = await Track.find().sort({ order: 1 }).lean<TrackDoc[]>();
  const modules = await Module.find().sort({ order: 1 }).lean<ModuleDoc[]>();
  const lessons = await Lesson.find()
    .select("moduleId slug title order")
    .sort({ order: 1 })
    .lean<LessonListDoc[]>();
  const problems = await Problem.find()
    .select("moduleId slug title order language difficulty skillLevel")
    .sort({ order: 1 })
    .lean<ProblemListDoc[]>();

  return tracks.map((track) => ({
    id: String(track._id),
    slug: track.slug,
    title: track.title,
    description: track.description,
    order: track.order,
    modules: modules
      .filter((mod) => String(mod.trackId) === String(track._id))
      .map((mod) => ({
        id: String(mod._id),
        slug: mod.slug,
        title: mod.title,
        description: mod.description,
        order: mod.order,
        lessons: lessons
          .filter((lesson) => String(lesson.moduleId) === String(mod._id))
          .map((lesson) => ({
            id: String(lesson._id),
            slug: lesson.slug,
            title: lesson.title,
            order: lesson.order,
          })),
        problems: problems
          .filter((problem) => String(problem.moduleId) === String(mod._id))
          .map((problem) => ({
            id: String(problem._id),
            slug: problem.slug,
            title: problem.title,
            order: problem.order,
            language: problem.language,
            difficulty: problem.difficulty,
            skillLevel: problem.skillLevel,
          })),
      })),
  }));
}

export async function getTrackBySlug(slug: string) {
  const tree = await getTrackTree();
  return tree.find((track) => track.slug === slug) ?? null;
}

export async function getLessonBySlug(slug: string) {
  await connectDB();
  const lesson = await Lesson.findOne({ slug }).lean<LessonDoc>();
  if (!lesson) return null;
  const mod = await Module.findById(lesson.moduleId).lean<ModuleDoc>();
  const track = mod ? await Track.findById(mod.trackId).lean<TrackDoc>() : null;
  return {
    id: String(lesson._id),
    slug: lesson.slug,
    title: lesson.title,
    markdown: lesson.markdown,
    moduleTitle: mod?.title ?? "",
    trackSlug: track?.slug ?? "",
    trackTitle: track?.title ?? "",
  };
}

export type PublicProblem = {
  id: string;
  slug: string;
  title: string;
  prompt: string;
  starterCode: string;
  language: "js" | "ts";
  difficulty: string;
  skillLevel: string;
  functionName: string;
  tags: string[];
  sampleTests: TestCase[];
  pembahasan: string | null;
  hasSubmitted: boolean;
  moduleTitle: string;
  trackSlug: string;
  trackTitle: string;
};

export async function getPublicProblem(slug: string, userId: string): Promise<PublicProblem | null> {
  await connectDB();
  const problem = await Problem.findOne({ slug }).lean<ProblemDoc>();
  if (!problem) return null;
  const mod = await Module.findById(problem.moduleId).lean<ModuleDoc>();
  const track = mod ? await Track.findById(mod.trackId).lean<TrackDoc>() : null;
  const hasSubmitted = Boolean(await Submission.exists({ userId, problemId: problem._id }));

  return {
    id: String(problem._id),
    slug: problem.slug,
    title: problem.title,
    prompt: problem.prompt,
    starterCode: problem.starterCode,
    language: problem.language,
    difficulty: problem.difficulty,
    skillLevel: problem.skillLevel,
    functionName: problem.functionName,
    tags: problem.tags ?? [],
    sampleTests: (problem.sampleTests ?? []).map((t) => ({
      args: t.args,
      expected: t.expected,
    })),
    pembahasan: hasSubmitted ? problem.pembahasan : null,
    hasSubmitted,
    moduleTitle: mod?.title ?? "",
    trackSlug: track?.slug ?? "",
    trackTitle: track?.title ?? "",
  };
}

export async function recordLessonComplete(userId: string, lessonId: string) {
  await connectDB();
  await Progress.findOneAndUpdate(
    { userId },
    { $addToSet: { completedLessonIds: lessonId } },
    { upsert: true },
  );
}

export async function recordProblemAttempt(input: {
  userId: string;
  problemId: string;
  slug: string;
  passed: boolean;
}) {
  await connectDB();
  const progress = await getProgress(input.userId);
  const existing = progress.problems.find((p) => String(p.problemId) === input.problemId);
  const nextStatus = input.passed || existing?.status === "solved" ? "solved" : "attempted";
  if (!existing) {
    await Progress.updateOne(
      { userId: input.userId },
      {
        $push: {
          problems: {
            problemId: input.problemId,
            slug: input.slug,
            status: nextStatus,
            attempts: 1,
          },
        },
      },
      { upsert: true },
    );
    return;
  }

  await Progress.updateOne(
    { userId: input.userId, "problems.problemId": input.problemId },
    {
      $inc: { "problems.$.attempts": 1 },
      $set: { "problems.$.status": nextStatus },
    },
  );
}

export async function summarizeProgress(userId: string) {
  const [tree, progress] = await Promise.all([getTrackTree(), getProgress(userId)]);
  const completedLessons = new Set(progress.completedLessonIds.map((id) => String(id)));
  const problemMap = new Map(progress.problems.map((p) => [String(p.problemId), p]));

  const tracks = tree.map((track) => {
    const lessons = track.modules.flatMap((m) => m.lessons);
    const problems = track.modules.flatMap((m) => m.problems);
    const lessonsDone = lessons.filter((l) => completedLessons.has(l.id)).length;
    const problemsSolved = problems.filter((p) => problemMap.get(p.id)?.status === "solved").length;
    const problemsAttempted = problems.filter((p) => problemMap.has(p.id)).length;
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
    completedLessons,
    problemMap,
  };
}
