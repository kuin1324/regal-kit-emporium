import fs from "node:fs";
import path from "node:path";

const ROOT = "public/collectie";
const OUT = "src/data/public_collectie.ts";
const IMG = /\.(jpe?g|png|webp|avif|gif)$/i;

// keep old metadata (leagues, colors, sku, availability, price) keyed by name
let old = {};
try {
  const src = fs.readFileSync(OUT, "utf8");
  const json = src.slice(src.indexOf("["), src.lastIndexOf("]") + 1);
  for (const it of JSON.parse(json)) old[it.name] = it;
} catch {}

const enc = (p) => "/" + p.replace(/^public\//, "").split("/").map(encodeURIComponent).join("/");
const sortImgs = (a, b) => {
  const w = (n) => (/achterkant|back/i.test(n) ? 1 : 0);
  return w(a) - w(b) || a.localeCompare(b, "en", { numeric: true });
};

const groups = new Map(); // name -> [relative paths]

const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      const files = fs.readdirSync(full).filter((f) => IMG.test(f)).sort(sortImgs);
      if (files.length) groups.set(e.name, files.map((f) => path.join(full, f)));
      // nested folders
      for (const sub of fs.readdirSync(full, { withFileTypes: true })) if (sub.isDirectory()) walk(full);
    } else if (IMG.test(e.name)) {
      const base = e.name.replace(IMG, "").replace(/\s*achterkant\s*$/i, "").trim();
      if (!groups.has(base)) groups.set(base, []);
      groups.get(base).push(full);
    }
  }
};
walk(ROOT);

const hash = (s) => {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h.toString(16).toUpperCase().padStart(5, "0").slice(0, 5);
};

const items = [...groups.entries()]
  .sort((a, b) => a[0].localeCompare(b[0], "en", { numeric: true }))
  .map(([name, files]) => {
    const gallery = files.sort((a, b) => sortImgs(path.basename(a), path.basename(b))).map(enc);
    const prev = old[name] || {};
    return {
      image: gallery[0],
      gallery,
      name,
      ...(prev.description ? { description: prev.description } : {}),
      ...(prev.colors ? { colors: prev.colors } : {}),
      team: prev.team || name.replace(/\s+(Home|Away|Third|Fourth|Goalkeeper|Pre-Match|Special|Longsleeve|Shirt).*$/i, "").trim() || name,
      leagues: prev.leagues || ["Collectie"],
      price: prev.price || "€30",
      sku: prev.sku || "HOFS-" + hash(name),
      sizes: prev.sizes || ["S", "M", "L", "XL", "2XL"],
      availability: prev.availability || "ready",
    };
  });

const header = `// AUTO-GEGENEREERD uit public/collectie/ - niet handmatig bewerken
export interface PublicShirt {
  image: string;
  gallery: string[];
  name: string;
  nameKey?: string;
  description?: string;
  colors?: string[];
  team: string;
  leagues: string[];
  price: string;
  sku: string;
  sizes: string[];
  availability: "ready" | "incoming";
}

export const publicCollectieShirts: PublicShirt[] = `;

fs.writeFileSync(OUT, header + JSON.stringify(items, null, 1) + ";\n");
console.log("shirts:", items.length, "| met 2+ fotos:", items.filter((i) => i.gallery.length > 1).length, "| 1 foto:", items.filter((i) => i.gallery.length === 1).length);
