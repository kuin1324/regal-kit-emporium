import { collectieShirts } from "@/data/collectie_shirts";
import { publicCollectieShirts } from "@/data/public_collectie";
import { mergeById } from "@/lib/productIdentity";

/**
 * Volledige collectie: handmatige items eerst, daarna de gegenereerde
 * public-collectie. Varianten met dezelfde naam blijven aparte producten;
 * alleen exact dezelfde SKU/foto wordt samengevoegd.
 */
export const allCollectieItems = mergeById(collectieShirts, publicCollectieShirts);

export const isLongSleeve = (name: string) => /long\s?sleeve/i.test(name);
export const isShorts = (name: string) => /\bshorts?\b/i.test(name);
export const isFullKit = (name: string) => /full\s?kit/i.test(name);

export const longSleeveItems = allCollectieItems.filter((p) => isLongSleeve(p.name));
export const shortsItems = allCollectieItems.filter((p) => isShorts(p.name) && !isFullKit(p.name));
export const fullKitItems = allCollectieItems.filter((p) => isFullKit(p.name));

/** Landen (nationale elftallen) die als vlag getoond worden. */
export const COUNTRIES = new Set([
  "Brazil", "Argentina", "Japan", "Mexico", "Portugal", "Spain", "France", "England",
  "Germany", "Italy", "Netherlands", "Colombia", "Belgium", "Uruguay", "USA", "Croatia",
  "Morocco", "Chile", "Peru", "Ecuador", "Nigeria", "South Korea", "Turkey", "Ghana",
  "Egypt", "Cameroon", "Senegal", "Algeria", "Ivory Coast", "Sweden", "Denmark", "Poland",
  "Switzerland", "Austria", "Scotland", "Wales", "Ireland", "Norway", "Serbia", "Canada",
  "Australia", "Saudi Arabia", "Qatar", "Iran", "China", "Paraguay", "Venezuela", "Bolivia",
  "Costa Rica", "Panama", "Jamaica", "Tunisia", "South Africa", "Greece", "Czech Republic",
  "Ukraine", "Russia", "Hungary", "Finland", "Iceland", "Slovakia", "Slovenia",
]);

const teamCounts = (() => {
  const map = new Map<string, { team: string; image: string; count: number }>();
  for (const p of allCollectieItems) {
    if (!p.team) continue;
    const hit = map.get(p.team);
    if (hit) hit.count += 1;
    else map.set(p.team, { team: p.team, image: p.image, count: 1 });
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
})();

/**
 * Evenveel clubs als landen, en een veelvoud van de kolommen (9 op desktop,
 * 6 op tablet, 3 op mobiel) zodat elke rij netjes vol eindigt.
 */
const PER_GROUP = 9;
export const topClubs = teamCounts.filter((t) => !COUNTRIES.has(t.team)).slice(0, PER_GROUP);
export const topCountries = teamCounts.filter((t) => COUNTRIES.has(t.team)).slice(0, PER_GROUP);

/** Eerst alle clubs, daarna alle landen. */
export const topTeams = [...topClubs, ...topCountries];
