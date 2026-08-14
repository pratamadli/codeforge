import type { TrainingExercise } from "@/lib/types";

export type TestRunResult = {
  passed: boolean;
  results: {
    label: string;
    passed: boolean;
    expected: string;
    actual: string;
    error?: string;
  }[];
};

function serialize(value: unknown): string {
  return JSON.stringify(value);
}

function extractFunctionName(source: string): string | null {
  const match = source.match(/function\s+([a-zA-Z_$][\w$]*)/);
  return match?.[1] ?? null;
}

function buildRunner(source: string, fnName: string): (...args: unknown[]) => unknown {
  return new Function(
    `${source}\nreturn ${fnName};`,
  )() as (...args: unknown[]) => unknown;
}

function runCounterTest(source: string): TestRunResult {
  try {
    const counterFactory = buildRunner(source, "createCounter") as () => () => number;
    const counter = counterFactory();
    const a = counter();
    const b = counter();
    const c = counter();
    const passed = a === 1 && b === 2 && c === 3;
    return {
      passed,
      results: [
        {
          label: "createCounter() → 1, 2, 3",
          passed,
          expected: "1, 2, 3",
          actual: `${a}, ${b}, ${c}`,
        },
      ],
    };
  } catch (error) {
    return {
      passed: false,
      results: [
        {
          label: "createCounter()",
          passed: false,
          expected: "1, 2, 3",
          actual: "Error",
          error: error instanceof Error ? error.message : "Runtime error",
        },
      ],
    };
  }
}

function runDelayTest(source: string): TestRunResult {
  try {
    const delay = buildRunner(source, "delay") as (ms: number) => Promise<void>;
    const valid = typeof delay(10)?.then === "function";
    return {
      passed: valid,
      results: [
        {
          label: "delay() mengembalikan Promise",
          passed: valid,
          expected: "Promise",
          actual: valid ? "Promise" : typeof delay(10),
        },
      ],
    };
  } catch (error) {
    return {
      passed: false,
      results: [
        {
          label: "delay()",
          passed: false,
          expected: "Promise",
          actual: "Error",
          error: error instanceof Error ? error.message : "Runtime error",
        },
      ],
    };
  }
}

export function runExerciseTests(
  source: string,
  exercise: TrainingExercise,
): TestRunResult {
  if (exercise.id === "ex-i3") return runCounterTest(source);
  if (exercise.id === "ex-a2") return runDelayTest(source);

  const fnName = extractFunctionName(source);
  if (!fnName) {
    return {
      passed: false,
      results: [
        {
          label: "Parse",
          passed: false,
          expected: "function declaration",
          actual: "Tidak ditemukan",
          error: "Tulis fungsi dengan syntax: function nama(...) { ... }",
        },
      ],
    };
  }

  let fn: (...args: unknown[]) => unknown;
  try {
    fn = buildRunner(source, fnName);
  } catch (error) {
    return {
      passed: false,
      results: [
        {
          label: "Parse",
          passed: false,
          expected: "valid JavaScript",
          actual: "Syntax error",
          error: error instanceof Error ? error.message : "Syntax error",
        },
      ],
    };
  }

  const results: TestRunResult["results"] = [];
  let allPassed = true;

  for (const [index, test] of exercise.tests.entries()) {
    try {
      const actual = fn(...test.args);
      const passed = serialize(actual) === serialize(test.expected);
      if (!passed) allPassed = false;

      results.push({
        label: `Test ${index + 1}`,
        passed,
        expected: serialize(test.expected),
        actual: serialize(actual),
      });
    } catch (error) {
      allPassed = false;
      results.push({
        label: `Test ${index + 1}`,
        passed: false,
        expected: serialize(test.expected),
        actual: "Error",
        error: error instanceof Error ? error.message : "Runtime error",
      });
    }
  }

  return { passed: allPassed, results };
}
