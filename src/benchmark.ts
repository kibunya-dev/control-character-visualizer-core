// src/benchmark.ts
import { detectControlCharacters } from "./detect.js";

import { readFileSync } from "fs";
import { performance } from "perf_hooks";

const filePath = process.argv[2] || "./test.txt";
const input = new Uint8Array(readFileSync(filePath));

const start = performance.now();
const result = detectControlCharacters(input);
const end = performance.now();

console.log(`処理時間: ${(end - start).toFixed(2)}ms`);
console.log(`メモリ使用量: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
console.log(`検出結果:`, JSON.stringify(result, null, 2));