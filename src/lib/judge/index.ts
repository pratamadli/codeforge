import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";
import type { JudgeOutcome, PresentedResult } from "@/lib/judge/types";

export type { JudgeOutcome, PresentedResult };

const WORKER_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), "worker.cjs");
const TIMEOUT_MS = 2000;

export type JudgeTest = {
  args: unknown[];
  expected: unknown;
  hidden?: boolean;
};

type WorkerResult = {
  status: "passed" | "failed" | "error";
  stdout?: string;
  error?: string;
  results: {
    index: number;
    passed: boolean;
    actual: string | null;
    expected: string;
    error?: string;
  }[];
};

const FN_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;

async function transpile(code: string, language: "js" | "ts"): Promise<string> {
  if (language === "js") return code;
  try {
    const result = await esbuild.transform(code, {
      loader: "ts",
      format: "cjs",
      target: "es2020",
    });
    return result.code;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`TypeScript gagal di-compile: ${message}`);
  }
}

function runWorker(code: string, functionName: string, tests: JudgeTest[]): Promise<WorkerResult> {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ["--max-old-space-size=64", WORKER_PATH], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    const finish = (value: WorkerResult) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      finish({
        status: "error",
        error: "Kode melebihi batas waktu (~2 detik).",
        results: [],
      });
    }, TIMEOUT_MS + 700);

    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      finish({
        status: "error",
        error: error.message,
        results: [],
      });
    });
    child.on("close", () => {
      clearTimeout(timer);
      try {
        finish(JSON.parse(stdout) as WorkerResult);
      } catch {
        finish({
          status: "error",
          error: stderr.trim() || "Worker gagal menjalankan kode.",
          results: [],
        });
      }
    });

    child.stdin.write(
      JSON.stringify({
        code,
        functionName,
        tests: tests.map((t) => ({ args: t.args, expected: t.expected })),
        timeoutMs: TIMEOUT_MS,
      }),
    );
    child.stdin.end();
  });
}

function present(tests: JudgeTest[], worker: WorkerResult, mode: "run" | "submit"): PresentedResult[] {
  let sampleIndex = 0;
  let hiddenIndex = 0;
  return (worker.results ?? []).map((result, i) => {
    const test = tests[i];
    const hidden = Boolean(test?.hidden);
    if (!hidden) sampleIndex += 1;
    else hiddenIndex += 1;

    if (mode === "run" || !hidden) {
      return {
        label: `Contoh ${sampleIndex}`,
        passed: result.passed,
        input: JSON.stringify(test?.args ?? []),
        expected: result.expected,
        actual: result.actual,
        error: result.error,
      };
    }

    return {
      label: `Tes tersembunyi ${hiddenIndex}`,
      passed: result.passed,
      error: result.error,
    };
  });
}

export async function runJudge(input: {
  code: string;
  language: "js" | "ts";
  functionName: string;
  tests: JudgeTest[];
  mode: "run" | "submit";
}): Promise<JudgeOutcome> {
  if (!FN_NAME.test(input.functionName)) {
    return {
      status: "error",
      runtimeMs: 0,
      stdout: "",
      error: "Nama fungsi soal tidak valid.",
      results: [],
    };
  }

  const started = Date.now();
  let js: string;
  try {
    js = await transpile(input.code, input.language);
  } catch (error) {
    return {
      status: "error",
      runtimeMs: Date.now() - started,
      stdout: "",
      error: error instanceof Error ? error.message : String(error),
      results: [],
    };
  }

  const worker = await runWorker(js, input.functionName, input.tests);
  return {
    status: worker.status,
    runtimeMs: Date.now() - started,
    stdout: worker.stdout ?? "",
    error: worker.error,
    results: present(input.tests, worker, input.mode),
  };
}
