import { collectieShirts } from "@/data/collectie_shirts";
import { publicCollectieShirts } from "@/data/public_collectie";

/** Volledige collectie: handmatige items eerst, daarna de gegenereerde public-collectie. */
const seen = new Set(collectieShirts.map((p) => p.name));
export const allCollectieItems = [
  ...collectieShirts,
  ...publicCollectieShirts.filter((p) => {
    if (seen.has(p.name)) return false;
    seen.add(p.name);
    return true;
  }),
];

export const isLongSleeve = (name: string) => /long\s?sleeve/i.test(name);
export const isShorts = (name: string) => /\bshorts?\b/i.test(name);
export const isFullKit = (name: string) => /full\s?kit/i.test(name);

export const longSleeveItems = allCollectieItems.filter((p) => isLongSleeve(p.name));
export const shortsItems = allCollectieItems.filter((p) => isShorts(p.name) && !isFullKit(p.name));
export const fullKitItems = allCollectieItems.filter((p) => isFullKit(p.name));

/** Meest voorkomende teams met een voorbeeldfoto, voor de klikbare iconen op de homepage. */
export const topTeams = (() => {
  const map = new Map<string, { team: string; image: string; count: number }>();
  for (const p of allCollectieItems) {
    if (!p.team) continue;
    const hit = map.get(p.team);
    if (hit) hit.count += 1;
    else map.set(p.team, { team: p.team, image: p.image, count: 1 });
  }
  return Array.from(map.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 18);
})();
