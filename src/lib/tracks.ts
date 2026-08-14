import type { TechTrack, TrackPriority } from "@/lib/types";

export type TrackMeta = {
  label: string;
  priority: TrackPriority;
  order: number;
  description: string;
};

export const TRACK_META: Record<TechTrack, TrackMeta> = {
  react: {
    label: "React",
    priority: "top",
    order: 1,
    description: "Component, hooks, state, rendering",
  },
  next: {
    label: "Next.js",
    priority: "top",
    order: 2,
    description: "App Router, SSR, RSC, routing",
  },
  node: {
    label: "Node.js",
    priority: "top",
    order: 3,
    description: "Runtime, module, event loop, npm",
  },
  testing: {
    label: "Unit Test",
    priority: "top",
    order: 4,
    description: "Vitest + React Testing Library",
  },
  typescript: {
    label: "TypeScript",
    priority: "top",
    order: 5,
    description: "Types, generics, utility types",
  },
  express: {
    label: "Express",
    priority: "top",
    order: 6,
    description: "Routing, middleware, REST API",
  },
  performance: {
    label: "Performance",
    priority: "top",
    order: 7,
    description: "Optimasi React, bundle, caching",
  },
  nestjs: {
    label: "NestJS",
    priority: "mid",
    order: 8,
    description: "Module, DI, decorator, provider",
  },
  nuxt: {
    label: "Nuxt",
    priority: "mid",
    order: 9,
    description: "Vue meta-framework, SSR, composables",
  },
  flutter: {
    label: "Flutter",
    priority: "mid",
    order: 10,
    description: "Widget, state, Dart basics",
  },
  go: {
    label: "Go",
    priority: "low",
    order: 11,
    description: "Goroutine, channel, struct",
  },
  laravel: {
    label: "Laravel",
    priority: "low",
    order: 12,
    description: "MVC, Eloquent, routing PHP",
  },
  python: {
    label: "Python",
    priority: "low",
    order: 13,
    description: "Syntax, list/dict, async basics",
  },
};

export const PRIORITY_LABELS: Record<TrackPriority, string> = {
  top: "Prioritas utama",
  mid: "Prioritas menengah",
  low: "Prioritas rendah",
};

const PRIORITY_RANK: Record<TrackPriority, number> = {
  top: 0,
  mid: 1,
  low: 2,
};

export function trackLabel(track: TechTrack): string {
  return TRACK_META[track].label;
}

export function compareTracks(a: TechTrack, b: TechTrack): number {
  const ma = TRACK_META[a];
  const mb = TRACK_META[b];
  const pd = PRIORITY_RANK[ma.priority] - PRIORITY_RANK[mb.priority];
  if (pd !== 0) return pd;
  return ma.order - mb.order;
}

export function tracksByPriority(priority: TrackPriority): TechTrack[] {
  return (Object.keys(TRACK_META) as TechTrack[])
    .filter((track) => TRACK_META[track].priority === priority)
    .sort(compareTracks);
}

export function allTracksSorted(): TechTrack[] {
  return (Object.keys(TRACK_META) as TechTrack[]).sort(compareTracks);
}
