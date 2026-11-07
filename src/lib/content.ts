import { readFileSync } from "node:fs";
import { join } from "node:path";
import { curriculum } from "@/content/curriculum";
import { CONTEKAN_CARDS } from "@/content/contekan";
import { STUDI_KASUS } from "@/content/studi-kasus";
import { getBankProblem } from "@/content/bank";
import type { SeedTrack } from "@/content/types";

const ROOT = join(process.cwd(), "src/content");

export function readMarkdown(folder: "lessons" | "prompts" | "pembahasan", slug: string): string {
  return readFileSync(join(ROOT, folder, `${slug}.md`), "utf8");
}

export type TrackTreeModule = {
  slug: string;
  title: string;
  description: string;
  order: number;
  lessons: { slug: string; title: string; order: number }[];
  problems: {
    slug: string;
    title: string;
    order: number;
    language: "js" | "ts";
    difficulty: string;
    skillLevel: string;
    functionName: string;
    tags: string[];
  }[];
};

export type TrackTree = {
  slug: string;
  title: string;
  description: string;
  order: number;
  modules: TrackTreeModule[];
};

export function getTrackTree(tracks: SeedTrack[] = curriculum): TrackTree[] {
  return tracks.map((track) => ({
    slug: track.slug,
    title: track.title,
    description: track.description,
    order: track.order,
    modules: track.modules.map((mod) => ({
      slug: mod.slug,
      title: mod.title,
      description: mod.description,
      order: mod.order,
      lessons: mod.lessons.map((lesson) => ({
        slug: lesson.slug,
        title: lesson.title,
        order: lesson.order,
      })),
      problems: mod.problems.map((problem) => ({
        slug: problem.slug,
        title: problem.title,
        order: problem.order,
        language: problem.language,
        difficulty: problem.difficulty,
        skillLevel: problem.skillLevel,
        functionName: problem.functionName,
        tags: problem.tags,
      })),
    })),
  }));
}

export function getTrackBySlug(slug: string) {
  return getTrackTree().find((track) => track.slug === slug) ?? null;
}

export function findLessonMeta(slug: string) {
  for (const track of curriculum) {
    for (const mod of track.modules) {
      const lesson = mod.lessons.find((item) => item.slug === slug);
      if (lesson) {
        return {
          slug: lesson.slug,
          title: lesson.title,
          moduleTitle: mod.title,
          trackSlug: track.slug,
          trackTitle: track.title,
        };
      }
    }
  }
  return null;
}

export function getLessonBySlug(slug: string) {
  const meta = findLessonMeta(slug);
  if (!meta) return null;
  return { ...meta, markdown: readMarkdown("lessons", slug) };
}

export type PublicProblem = {
  slug: string;
  title: string;
  prompt: string;
  starterCode: string;
  language: "js" | "ts";
  difficulty: string;
  skillLevel: string;
  functionName: string;
  tags: string[];
  sampleTests: { args: unknown[]; expected: unknown }[];
  moduleTitle: string;
  trackSlug: string;
  trackTitle: string;
};

export function findProblemMeta(slug: string) {
  for (const track of curriculum) {
    for (const mod of track.modules) {
      const problem = mod.problems.find((item) => item.slug === slug);
      if (problem) {
        return { problem, moduleTitle: mod.title, trackSlug: track.slug, trackTitle: track.title };
      }
    }
  }
  return null;
}

export function getPublicProblem(slug: string): PublicProblem | null {
  const found = findProblemMeta(slug);
  if (!found) return null;
  const { problem, moduleTitle, trackSlug, trackTitle } = found;
  return {
    slug: problem.slug,
    title: problem.title,
    prompt: readMarkdown("prompts", slug),
    starterCode: problem.starterCode,
    language: problem.language,
    difficulty: problem.difficulty,
    skillLevel: problem.skillLevel,
    functionName: problem.functionName,
    tags: problem.tags,
    sampleTests: problem.sampleTests.map((t) => ({ args: t.args, expected: t.expected })),
    moduleTitle,
    trackSlug,
    trackTitle,
  };
}

export function getJudgeProblem(slug: string) {
  const bank = getBankProblem(slug);
  if (!bank) return null;
  return {
    ...bank,
    pembahasan: readMarkdown("pembahasan", slug),
  };
}

export type SearchHit = {
  href: string;
  title: string;
  kind: "track" | "lesson" | "problem" | "review";
  subtitle: string;
};

export function getSearchCatalog(): SearchHit[] {
  const tree = getTrackTree();
  const hits: SearchHit[] = [];
  for (const track of tree) {
    hits.push({
      href: `/kurikulum/${track.slug}`,
      title: track.title,
      kind: "track",
      subtitle: "Kurikulum",
    });
    for (const mod of track.modules) {
      for (const lesson of mod.lessons) {
        hits.push({
          href: `/pelajaran/${lesson.slug}`,
          title: lesson.title,
          kind: "lesson",
          subtitle: `${track.title} · ${mod.title}`,
        });
      }
      for (const problem of mod.problems) {
        hits.push({
          href: `/soal/${problem.slug}`,
          title: problem.title,
          kind: "problem",
          subtitle: `${track.title} · ${problem.language.toUpperCase()}`,
        });
      }
    }
  }
  hits.push({
    href: "/review",
    title: "Review · Contekan cepat",
    kind: "review",
    subtitle: "Bab 16.1 · jawab lantang, bukan pilihan ganda",
  });
  for (const card of CONTEKAN_CARDS) {
    hits.push({
      href: "/review",
      title: card.q,
      kind: "review",
      subtitle: "Review · 16.1",
    });
  }
  for (const kasus of STUDI_KASUS) {
    hits.push({
      href: `/pelajaran/bab-10-studi-kasus#${kasus.id}`,
      title: kasus.title,
      kind: "review",
      subtitle: "Bab 12 · drill verbal",
    });
  }
  return hits;
}
