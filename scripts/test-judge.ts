import assert from "node:assert/strict";
import { runJudge } from "../src/lib/judge/index";

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
  assert.equal(pass.results[1]?.input, undefined);

  const fail = await runJudge({
    code: "function jumlahDuaAngka(a, b) { return a; }",
    language: "js",
    functionName: "jumlahDuaAngka",
    tests: [{ args: [2, 3], expected: 5 }],
    mode: "run",
  });
  assert.equal(fail.status, "failed");
  assert.equal(fail.results[0]?.actual, "2");
  assert.equal(fail.results[0]?.expected, "5");

  const ts = await runJudge({
    code: "function hitungDiskon(harga: number, persen: number): number { return harga * (1 - persen / 100); }",
    language: "ts",
    functionName: "hitungDiskon",
    tests: [{ args: [100, 10], expected: 90 }],
    mode: "run",
  });
  assert.equal(ts.status, "passed");

  const timeout = await runJudge({
    code: "function jam() { while (true) {} }",
    language: "js",
    functionName: "jam",
    tests: [{ args: [], expected: 1 }],
    mode: "run",
  });
  assert.equal(timeout.status, "error");

  const twoSum = await runJudge({
    code: `function twoSum(nums, target) {
      const seen = new Map();
      for (let i = 0; i < nums.length; i++) {
        const need = target - nums[i];
        if (seen.has(need)) return [seen.get(need), i];
        seen.set(nums[i], i);
      }
      return [];
    }`,
    language: "js",
    functionName: "twoSum",
    tests: [{ args: [[2, 7, 11, 15], 9], expected: [0, 1] }],
    mode: "run",
  });
  assert.equal(twoSum.status, "passed");

  console.log("Judge OK: JS, TS, hidden-test sanitizing, timeout.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
