// Maakt kleine webp-thumbnails van de titelfoto (foto 1) van elk shirt.
// Output: public/thumbs/<zelfde pad>.webp  (max 420px breed, kwaliteit 62)
// Gebruik: node scripts/generate-thumbs.mjs
import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const ROOT = process.cwd();
const SRC_FILES = ["src/data/collectie_shirts.ts", "src/data/public_collectie.ts"];

const covers = new Set();
for (const f of SRC_FILES) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) continue;
  const raw = fs.readFileSync(p, "utf8");
  for (const m of raw.matchAll(/"image"\s*:\s*"(\/collectie\/[^"]+)"/g)) covers.add(m[1]);
}

const jobs = [];
for (const url of covers) {
  const rel = decodeURIComponent(url.replace(/^\//, ""));
  const src = path.join(ROOT, "public", rel);
  if (!fs.existsSync(src)) continue;
  const out = path.join(ROOT, "public", "thumbs", rel.replace(/\.[^.]+$/, "") + ".webp");
  if (fs.existsSync(out)) continue;
  jobs.push([src, out]);
}

let done = 0;
const LIMIT = 8;
async function worker() {
  while (jobs.length) {
    const [src, out] = jobs.pop();
    fs.mkdirSync(path.dirname(out), { recursive: true });
    try {
      await run("ffmpeg", ["-loglevel", "error", "-y", "-i", src, "-vf", "scale=420:-2", "-quality", "62", out]);
    } catch {
      /* onleesbare bron overslaan */
    }
    if (++done % 100 === 0) console.log(`… ${done}`);
  }
}
await Promise.all(Array.from({ length: LIMIT }, worker));
console.log(`✅ ${done} thumbnails in public/thumbs/`);
