import { curriculum } from "@/content/curriculum";
import type { BankProblem, SeedProblem } from "@/content/types";

const DEBOUNCE_DRIVER = `
async function __sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function __judgeDebounce(delay, calls) {
  const received = [];
  const d = debounce((v) => received.push(v), delay);
  let t = 0;
  for (const call of calls) {
    if (call.t > t) {
      await __sleep(call.t - t);
      t = call.t;
    }
    d(call.v);
  }
  await __sleep(delay + 25);
  return received;
}
`;

const MEMOIZE_DRIVER = `
function __judgeMemoize(inputs) {
  let computes = 0;
  const f = memoize((x) => {
    computes += 1;
    return x * x;
  });
  const values = inputs.map((x) => f(x));
  return { values, computes };
}
`;

const RUN_POOL_DRIVER = `
async function __judgeRunPool(values, limit) {
  let current = 0;
  let max = 0;
  const tasks = values.map((v) => async () => {
    current += 1;
    if (current > max) max = current;
    await new Promise((resolve) => setTimeout(resolve, 25));
    current -= 1;
    return v;
  });
  const results = await runPool(tasks, limit);
  return { results, max };
}
`;

const GROUP_BY_DRIVER = `
function __judgeGroupBy(items, key) {
  return groupBy(items, (x) => x[key]);
}
`;

const LRU_DRIVER = `
function __judgeLru(capacity, ops) {
  const cache = new LRUCache(capacity);
  const out = [];
  for (const op of ops) {
    if (op[0] === "get") {
      const val = cache.get(op[1]);
      out.push(val === undefined ? null : val);
    } else {
      cache.set(op[1], op[2]);
    }
  }
  return out;
}
`;

const extras: Record<
  string,
  Pick<BankProblem, "hiddenTests" | "driverCode" | "judgeFunctionName">
> = {
  debounce: {
    judgeFunctionName: "__judgeDebounce",
    driverCode: DEBOUNCE_DRIVER,
    hiddenTests: [
      {
        args: [
          30,
          [
            { t: 0, v: "x" },
            { t: 10, v: "y" },
            { t: 20, v: "z" },
          ],
        ],
        expected: ["z"],
      },
      {
        args: [
          20,
          [
            { t: 0, v: 1 },
            { t: 40, v: 2 },
            { t: 80, v: 3 },
          ],
        ],
        expected: [1, 2, 3],
      },
      { args: [15, [{ t: 0, v: "only" }]], expected: ["only"] },
    ],
  },
  memoize: {
    judgeFunctionName: "__judgeMemoize",
    driverCode: MEMOIZE_DRIVER,
    hiddenTests: [
      { args: [[1, 1, 1, 1]], expected: { values: [1, 1, 1, 1], computes: 1 } },
      { args: [[4, 5, 4]], expected: { values: [16, 25, 16], computes: 2 } },
      { args: [[]], expected: { values: [], computes: 0 } },
    ],
  },
  "run-pool": {
    judgeFunctionName: "__judgeRunPool",
    driverCode: RUN_POOL_DRIVER,
    hiddenTests: [
      { args: [[10, 20, 30, 40], 2], expected: { results: [10, 20, 30, 40], max: 2 } },
      { args: [[7, 8, 9], 1], expected: { results: [7, 8, 9], max: 1 } },
      { args: [[], 2], expected: { results: [], max: 0 } },
    ],
  },
  flatten: {
    hiddenTests: [
      { args: [[]], expected: [] },
      { args: [[1, 2, 3]], expected: [1, 2, 3] },
      { args: [[[[[[[[[[9]]]]]]]]]], expected: [9] },
      { args: [[0, [false], ["a", [null]]]], expected: [0, false, "a", null] },
    ],
  },
  "group-by": {
    judgeFunctionName: "__judgeGroupBy",
    driverCode: GROUP_BY_DRIVER,
    hiddenTests: [
      {
        args: [
          [
            { name: "Ayu", city: "Bd" },
            { name: "Bimo", city: "Jkt" },
            { name: "Cici", city: "Bd" },
          ],
          "city",
        ],
        expected: {
          Bd: [
            { name: "Ayu", city: "Bd" },
            { name: "Cici", city: "Bd" },
          ],
          Jkt: [{ name: "Bimo", city: "Jkt" }],
        },
      },
      {
        args: [[{ id: 1, k: "x" }], "k"],
        expected: { x: [{ id: 1, k: "x" }] },
      },
    ],
  },
  "lru-cache": {
    judgeFunctionName: "__judgeLru",
    driverCode: LRU_DRIVER,
    hiddenTests: [
      {
        args: [
          1,
          [
            ["set", "a", 10],
            ["get", "a"],
            ["set", "b", 20],
            ["get", "a"],
            ["get", "b"],
          ],
        ],
        expected: [10, null, 20],
      },
      {
        args: [
          2,
          [
            ["set", 1, "x"],
            ["set", 2, "y"],
            ["get", 2],
            ["set", 3, "z"],
            ["get", 1],
            ["get", 2],
            ["get", 3],
          ],
        ],
        expected: ["y", null, "y", "z"],
      },
      {
        args: [2, [["get", 9]]],
        expected: [null],
      },
    ],
  },
  "two-sum": {
    hiddenTests: [
      { args: [[3, 3], 6], expected: [0, 1] },
      { args: [[0, 4, 3, 0], 0], expected: [0, 3] },
      { args: [[-1, -2, -3, -4, -5], -8], expected: [2, 4] },
      { args: [[1, 2, 3], 100], expected: null },
    ],
  },
};

const problemIndex = new Map<string, SeedProblem>();
for (const track of curriculum) {
  for (const mod of track.modules) {
    for (const problem of mod.problems) {
      problemIndex.set(problem.slug, problem);
    }
  }
}

export function getBankProblem(slug: string): BankProblem | null {
  const base = problemIndex.get(slug);
  if (!base) return null;
  const extra = extras[slug];
  if (!extra) return null;
  return { ...base, ...extra };
}

export function listBankSlugs(): string[] {
  return [...problemIndex.keys()];
}
