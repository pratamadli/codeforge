import assert from "node:assert/strict";
import { getJudgeProblem } from "../src/lib/content";
import { runJudge } from "../src/lib/judge";

async function judge(
  slug: string,
  code: string,
  mode: "run" | "submit" = "submit",
) {
  const problem = getJudgeProblem(slug);
  assert.ok(problem, slug);
  const source = problem.driverCode ? `${code}\n${problem.driverCode}` : code;
  const tests =
    mode === "run"
      ? problem.sampleTests.map((t) => ({ args: t.args, expected: t.expected }))
      : [
          ...problem.sampleTests.map((t) => ({ ...t, hidden: false })),
          ...problem.hiddenTests.map((t) => ({ ...t, hidden: true })),
        ];
  return runJudge({
    code: source,
    language: problem.language,
    functionName: problem.judgeFunctionName ?? problem.functionName,
    tests,
    mode,
  });
}

async function main() {
  const pass = await runJudge({
    code: "function jumlahDuaAngka(a, b) { return a + b; }",
    language: "js",
    functionName: "jumlahDuaAngka",
    tests: [
      { args: [2, 3], expected: 5 },
      { args: [100, 250], expected: 350, hidden: true },
    ],
    mode: "submit",
  });
  assert.equal(pass.status, "passed");
  assert.equal(pass.results[1]?.label, "Tes tersembunyi 1");
  assert.equal(pass.results[1]?.expected, undefined);

  const flatten = await judge(
    "flatten",
    `function flatten(arr) {
      return arr.reduce((acc, x) => acc.concat(Array.isArray(x) ? flatten(x) : x), []);
    }`,
  );
  assert.equal(flatten.status, "passed");

  const twoSum = await judge(
    "two-sum",
    `function twoSum(nums, target) {
      const seen = new Map();
      for (let i = 0; i < nums.length; i++) {
        const need = target - nums[i];
        if (seen.has(need)) return [seen.get(need), i];
        seen.set(nums[i], i);
      }
      return null;
    }`,
  );
  assert.equal(twoSum.status, "passed");

  const memo = await judge(
    "memoize",
    `function memoize(fn) {
      const cache = new Map();
      return (...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const result = fn(...args);
        cache.set(key, result);
        return result;
      };
    }`,
  );
  assert.equal(memo.status, "passed");

  const debounce = await judge(
    "debounce",
    `function debounce(fn, delay) {
      let timer;
      return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
      };
    }`,
  );
  assert.equal(debounce.status, "passed");

  const pool = await judge(
    "run-pool",
    `async function runPool(tasks, limit) {
      const results = [];
      let next = 0;
      async function worker() {
        while (next < tasks.length) {
          const i = next++;
          results[i] = await tasks[i]();
        }
      }
      await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));
      return results;
    }`,
  );
  assert.equal(pool.status, "passed");

  const lru = await judge(
    "lru-cache",
    `class LRUCache {
      constructor(capacity) { this.cap = capacity; this.map = new Map(); }
      get(key) {
        if (!this.map.has(key)) return undefined;
        const val = this.map.get(key);
        this.map.delete(key);
        this.map.set(key, val);
        return val;
      }
      set(key, val) {
        if (this.map.has(key)) this.map.delete(key);
        this.map.set(key, val);
        if (this.map.size > this.cap) this.map.delete(this.map.keys().next().value);
      }
    }`,
  );
  assert.equal(lru.status, "passed");

  const timeout = await runJudge({
    code: "function jam() { while (true) {} }",
    language: "js",
    functionName: "jam",
    tests: [{ args: [], expected: 1 }],
    mode: "run",
  });
  assert.equal(timeout.status, "error");

  console.log("Judge OK: flatten, two-sum, memoize, debounce, run-pool, lru, timeout.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
