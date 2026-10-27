export type PresentedResult = {
  label: string;
  passed: boolean;
  input?: string;
  expected?: string;
  actual?: string | null;
  error?: string;
};

export type JudgeOutcome = {
  status: "passed" | "failed" | "error";
  runtimeMs: number;
  stdout: string;
  error?: string;
  results: PresentedResult[];
};
