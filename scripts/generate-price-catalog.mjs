// Genereert supabase/functions/_shared/price-catalog.json uit de frontend-catalogus.
// Gebruik: bun scripts/generate-price-catalog.mjs
import fs from "node:fs";
import path from "node:path";
import { allCollectieItems } from "../src/lib/collection.ts";

const OUT = path.join(process.cwd(), "supabase", "functions", "_shared", "price-catalog.json");

const out = {};
for (const p of allCollectieItems) {
  if (!p.sku) continue;
  const price = Number(String(p.price).replace(/[^\d.,]/g, "").replace(",", "."));
  if (!Number.isFinite(price) || price <= 0) continue;
  if (out[p.sku]) continue;
  out[p.sku] = {
    price,
    name: p.name,
    nameKey: p.nameKey ?? null,
    availability: p.availability === "incoming" ? "incoming" : "ready",
  };
}

fs.writeFileSync(OUT, JSON.stringify(out));
console.log(`✅ ${Object.keys(out).length} artikelen in price-catalog.json`);
