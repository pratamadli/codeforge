"use strict";

const vm = require("node:vm");

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    process.stdin.on("data", (chunk) => chunks.push(chunk));
    process.stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    process.stdin.on("error", reject);
  });
}

function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a == null || b == null) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (Array.isArray(a) || Array.isArray(b)) return false;
  if (typeof a === "object") {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const key of aKeys) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
  return false;
}

function serialize(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function runWithTimeout(fn, args, timeoutMs) {
  const result = fn(...args);
  if (result && typeof result.then === "function") {
    return Promise.race([
      result,
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Timeout")), timeoutMs).unref?.();
      }),
    ]);
  }
  return result;
}

function reply(payload) {
  process.stdout.write(JSON.stringify(payload));
}

(async () => {
  const raw = await readStdin();
  const payload = JSON.parse(raw);
  const { code, functionName, tests, timeoutMs } = payload;
  const logs = [];

  const context = {
    console: {
      log: (...args) => logs.push(args.map(String).join(" ")),
      info: (...args) => logs.push(args.map(String).join(" ")),
      warn: (...args) => logs.push(args.map(String).join(" ")),
      error: (...args) => logs.push(args.map(String).join(" ")),
    },
    module: { exports: {} },
    exports: {},
    Array,
    Object,
    Number,
    String,
    Boolean,
    Math,
    JSON,
    Date,
    Error,
    TypeError,
    RangeError,
    Map,
    Set,
    WeakMap,
    WeakSet,
    Promise,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    NaN,
    Infinity,
    undefined,
    encodeURIComponent,
    decodeURIComponent,
    encodeURI,
    decodeURI,
    Intl,
    BigInt,
    Symbol,
    Uint8Array,
    Int8Array,
    Uint16Array,
    Int16Array,
    Uint32Array,
    Int32Array,
    Float32Array,
    Float64Array,
    ArrayBuffer,
    DataView,
  };
  context.exports = context.module.exports;
  context.globalThis = context;

  try {
    vm.createContext(context, { codeGeneration: { strings: false, wasm: false } });
    const wrapped = `"use strict";
${code}
;
var __userFn = (typeof ${functionName} === "function")
  ? ${functionName}
  : (module.exports && typeof module.exports.${functionName} === "function")
    ? module.exports.${functionName}
    : (typeof module.exports === "function" ? module.exports : undefined);
`;
    vm.runInContext(wrapped, context, {
      timeout: timeoutMs,
      filename: "user.js",
    });

    const fn = context.__userFn;
    if (typeof fn !== "function") {
      reply({
        status: "error",
        error: `Fungsi ${functionName} tidak ditemukan. Pakai nama yang sama dengan soal, misalnya: function ${functionName}(...) { }`,
        stdout: logs.join("\n"),
        results: [],
      });
      return;
    }

    const results = [];
    let allPassed = true;
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      try {
        const actual = await runWithTimeout(fn, test.args, timeoutMs);
        const passed = deepEqual(actual, test.expected);
        if (!passed) allPassed = false;
        results.push({
          index: i,
          passed,
          actual: serialize(actual),
          expected: serialize(test.expected),
        });
      } catch (error) {
        allPassed = false;
        results.push({
          index: i,
          passed: false,
          actual: null,
          expected: serialize(test.expected),
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    reply({
      status: allPassed ? "passed" : "failed",
      stdout: logs.join("\n"),
      results,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const timedOut = /Script execution timed out/i.test(message) || message === "Timeout";
    reply({
      status: "error",
      error: timedOut ? "Kode melebihi batas waktu (~2 detik)." : message,
      stdout: logs.join("\n"),
      results: [],
    });
  }
})().catch((error) => {
  reply({
    status: "error",
    error: error instanceof Error ? error.message : String(error),
    stdout: "",
    results: [],
  });
  process.exitCode = 1;
});
