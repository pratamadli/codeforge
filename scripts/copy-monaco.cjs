const { cpSync, mkdirSync } = require("node:fs");
const { dirname, join } = require("node:path");

const src = join(__dirname, "../node_modules/monaco-editor/min/vs");
const dest = join(__dirname, "../public/monaco/vs");

mkdirSync(dirname(dest), { recursive: true });
cpSync(src, dest, { recursive: true });
console.log("Monaco assets copied to public/monaco/vs");
