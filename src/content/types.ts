export type SeedTest = {
  args: unknown[];
  expected: unknown;
};

export type SeedLesson = {
  slug: string;
  title: string;
  order: number;
};

export type SeedProblem = {
  slug: string;
  title: string;
  order: number;
  starterCode: string;
  language: "js" | "ts";
  difficulty: "easy" | "medium" | "hard";
  skillLevel: "beginner" | "intermediate" | "advanced";
  functionName: string;
  sampleTests: SeedTest[];
  tags: string[];
};

export type SeedModule = {
  slug: string;
  title: string;
  description: string;
  order: number;
  lessons: SeedLesson[];
  problems: SeedProblem[];
};

export type SeedTrack = {
  slug: string;
  title: string;
  description: string;
  order: number;
  modules: SeedModule[];
};

export type BankProblem = SeedProblem & {
  hiddenTests: SeedTest[];
  /** Appended after user code; judge calls this instead of functionName. */
  driverCode?: string;
  judgeFunctionName?: string;
};
