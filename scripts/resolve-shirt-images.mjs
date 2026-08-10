// Herbouwt de image/gallery velden in src/data/rooster_shirts.ts
// Bron 1: losse bestanden in public/collectie/
// Bron 2: mappen in public/collectie/rooster achtergrond/<shirtnaam>/
// Anders: /placeholder.svg
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const COLLECTIE = path.join(ROOT, "public/collectie");
const ROOSTER = path.join(COLLECTIE, "rooster achtergrond");
const DATA = path.join(ROOT, "src/data/rooster_shirts.ts");
const IMG_RE = /\.(jpe?g|png|webp|avif|gif)$/i;

const norm = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const url = (...parts) => "/" + parts.map((p) => encodeURIComponent(p)).join("/");

// losse sleutel: negeert generieke kledingwoorden zodat "X Home Longsleeve 25-26"
// ook aan "X Home Shirt 25-26" gekoppeld kan worden
const looseKey = (s) => norm(s.replace(/long ?sleeve[s]?/gi, " ").replace(/\b(shirt|jersey|kit|trikot)\b/gi, " "));

// --- losse bestanden ---
const looseFiles = fs.existsSync(COLLECTIE)
  ? fs.readdirSync(COLLECTIE, { withFileTypes: true }).filter((e) => e.isFile() && IMG_RE.test(e.name)).map((e) => e.name)
  : [];
const looseMap = new Map(); // normkey -> [filenames]
const looseAltMap = new Map(); // loosekey -> [filenames]
for (const f of looseFiles) {
  const base = f.replace(IMG_RE, "").replace(/achterkant/gi, "");
  const key = norm(base);
  if (!looseMap.has(key)) looseMap.set(key, []);
  looseMap.get(key).push(f);
  const alt = looseKey(base);
  if (!looseAltMap.has(alt)) looseAltMap.set(alt, []);
  looseAltMap.get(alt).push(f);
}

// --- mappen ---
const folderMap = new Map(); // normkey -> dirname
const folderAltMap = new Map(); // loosekey -> dirname
if (fs.existsSync(ROOSTER)) {
  for (const e of fs.readdirSync(ROOSTER, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    folderMap.set(norm(e.name), e.name);
    const alt = looseKey(e.name);
    if (!folderAltMap.has(alt)) folderAltMap.set(alt, e.name);
  }
}

const isBack = (f) => /achterkant|back/i.test(f);
const sortFiles = (files) => [...files].sort((a, b) => a.localeCompare(b, "nl", { numeric: true }));

function resolve(name) {
  const key = norm(name);
  const alt = looseKey(name);

  const loose = looseMap.get(key) || looseAltMap.get(alt);
  if (loose && loose.length) {
    const files = sortFiles(loose);
    const front = files.find((f) => !isBack(f)) || files[0];
    const gallery = [front, ...files.filter((f) => f !== front)].slice(0, 4);
    return { image: url("collectie", front), gallery: gallery.map((f) => url("collectie", f)), matched: "loose" };
  }

  const dir = folderMap.get(key) || folderAltMap.get(alt);

  if (dir) {
    const files = sortFiles(
      fs.readdirSync(path.join(ROOSTER, dir), { withFileTypes: true })
        .filter((e) => e.isFile() && IMG_RE.test(e.name))
        .map((e) => e.name)
    );
    if (files.length) {
      const front = files.find((f) => !isBack(f)) || files[0];
      const ordered = [front, ...files.filter((f) => f !== front)].slice(0, 4);
      return {
        image: url("collectie", "rooster achtergrond", dir, front),
        gallery: ordered.map((f) => url("collectie", "rooster achtergrond", dir, f)),
        matched: "folder",
      };
    }
  }

  return { image: "/placeholder.svg", gallery: ["/placeholder.svg"], matched: null };
}

const src = fs.readFileSync(DATA, "utf8");
const start = src.indexOf("= [");
const header = src.slice(0, start + 2);
const end = src.lastIndexOf("\n]") + 1;
const footer = src.slice(end + 1);
const arr = JSON.parse(src.slice(start + 2, end + 1));

const stats = { loose: 0, folder: 0, none: 0 };
const missing = [];
for (const s of arr) {
  const r = resolve(s.name);
  s.image = r.image;
  s.gallery = r.gallery;
  s.fallback = r.matched ? null : "/placeholder.svg";
  if (r.matched) stats[r.matched]++;
  else {
    stats.none++;
    missing.push(s.name);
  }
}

fs.writeFileSync(DATA, header + JSON.stringify(arr, null, 1) + footer);
fs.writeFileSync(path.join(ROOT, "scripts/missing-shirt-images.txt"), missing.join("\n") + "\n");
console.log(`totaal: ${arr.length}, losse bestanden: ${stats.loose}, mappen: ${stats.folder}, zonder foto: ${stats.none}`);
