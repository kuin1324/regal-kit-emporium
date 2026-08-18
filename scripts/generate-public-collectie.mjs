// Genereert src/data/public_collectie.ts op basis van public/collectie/
//
// Ondersteunt 2 vormen:
//   1) losse bestanden:  public/collectie/Ajax Home Shirt 24-25.jpg
//   2) submappen:        public/collectie/Ajax Home Shirt 24-25/1.jpg, 2.jpg, 3.jpg, 4.jpg
//      -> mapnaam = shirtnaam, foto's op alfabetische/numerieke volgorde
//
// Gebruik:  node scripts/generate-public-collectie.mjs
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "public", "collectie");
const OUT = path.join(ROOT, "src", "data", "public_collectie.ts");
const IMG = /\.(jpe?g|png|webp|avif)$/i;
const SIZES = ["S", "M", "L", "XL", "2XL"];
const PRICE = "€30";

// --- bestaande team/league-kennis hergebruiken -------------------------------
const teamMap = new Map();
if (fs.existsSync(OUT)) {
  const raw = fs.readFileSync(OUT, "utf8");
  const body = raw.slice(raw.indexOf("["), raw.lastIndexOf("]") + 1);
  try {
    for (const item of JSON.parse(body)) {
      if (item.team && !teamMap.has(item.team)) teamMap.set(item.team, item.leagues || []);
    }
  } catch {
    /* eerste run of handmatig bewerkt bestand */
  }
}
const knownTeams = [...teamMap.keys()].sort((a, b) => b.length - a.length);

const sku = (name) =>
  "HOFS-" + crypto.createHash("sha1").update(name).digest("hex").slice(0, 5).toUpperCase();

const url = (rel) => "/collectie/" + rel.split("/").map(encodeURIComponent).join("/");

const guessTeam = (name) => {
  const hit = knownTeams.find((t) => name.toLowerCase().startsWith(t.toLowerCase()));
  if (hit) return { team: hit, leagues: teamMap.get(hit) || [] };
  return { team: name.split(/\s+/).slice(0, 2).join(" "), leagues: [] };
};

// natuurlijke sortering zodat 2.jpg vóór 10.jpg komt
const natural = (a, b) => a.localeCompare(b, "en", { numeric: true, sensitivity: "base" });

const shirts = new Map(); // naam -> gallery[]

for (const entry of fs.readdirSync(DIR, { withFileTypes: true })) {
  if (entry.isDirectory()) {
    const files = fs
      .readdirSync(path.join(DIR, entry.name))
      .filter((f) => IMG.test(f))
      .sort(natural);
    if (files.length) shirts.set(entry.name, files.map((f) => url(`${entry.name}/${f}`)));
  } else if (IMG.test(entry.name)) {
    const base = entry.name.replace(IMG, "");
    const isBack = / achterkant$/i.test(base);
    const name = base.replace(/ achterkant$/i, "");
    const list = shirts.get(name) || [];
    isBack ? list.push(url(entry.name)) : list.unshift(url(entry.name));
    shirts.set(name, list);
  }
}

const items = [...shirts.entries()]
  .sort((a, b) => natural(a[0], b[0]))
  .map(([name, gallery]) => {
    const { team, leagues } = guessTeam(name);
    return {
      image: gallery[0],
      gallery,
      name,
      team,
      leagues,
      price: PRICE,
      sku: sku(name),
      sizes: SIZES,
      availability: "ready",
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

fs.writeFileSync(OUT, header + JSON.stringify(items, null, 0).replace(/},{/g, "},\n{") + ";\n");
console.log(`✅ ${items.length} shirts geschreven naar src/data/public_collectie.ts`);
