import { extractYear, getDecade, sortProducts, SortKey } from "@/lib/productMeta";
import { shirtSignatures } from "@/data/shirtSignatures";
import { derivedColors, nearestColorName } from "@/lib/imageSignature";

export { nearestColorName };

export interface FilterProduct {
  name: string;
  nameKey?: string;
  team: string;
  price: string;
  leagues: string[];
  colors?: string[];
}

export const COLOR_MAP: Record<string, string> = {
  zwart: "#000000",
  wit: "#FFFFFF",
  blauw: "#1E40AF",
  rood: "#DC2626",
  geel: "#FACC15",
  groen: "#16A34A",
  oranje: "#EA580C",
  roze: "#EC4899",
  meerkleurig: "linear-gradient(135deg,#DC2626,#FACC15,#16A34A,#1E40AF)",
};

export const FILTER_COLORS = Object.keys(COLOR_MAP);

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const LEAGUE_COUNTRY: Record<string, string> = {
  Eredivisie: "Nederland",
  "Premier League": "Engeland",
  "La Liga": "Spanje",
  "Serie A": "Italië",
  Bundesliga: "Duitsland",
  "Ligue 1": "Frankrijk",
};

/** Land van een shirt: bij clubs via de competitie, bij landenteams de teamnaam. */
export const getCountry = (p: FilterProduct): string | null => {
  for (const l of p.leagues) {
    if (LEAGUE_COUNTRY[l]) return LEAGUE_COUNTRY[l];
  }
  if (p.leagues.includes("Nationaal")) return p.team;
  return null;
};

/** Alleen opties tonen waar meer dan één shirt onder valt. */
const countBy = <T>(values: T[]): Map<T, number> => {
  const m = new Map<T, number>();
  for (const v of values) m.set(v, (m.get(v) ?? 0) + 1);
  return m;
};

const HIDDEN_LEAGUES = new Set(["Retro", "Long Sleeve", "Lifestyle", "Special", "Collectie"]);

export const collectLeagues = (items: FilterProduct[]): string[] => {
  const counts = countBy(items.flatMap((p) => p.leagues));
  return Array.from(counts.entries())
    .filter(([l, n]) => n > 1 && !HIDDEN_LEAGUES.has(l))
    .map(([l]) => l)
    .sort();
};

export const collectCountries = (items: FilterProduct[]): string[] => {
  const counts = countBy(items.map(getCountry).filter(Boolean) as string[]);
  return Array.from(counts.entries())
    .filter(([, n]) => n > 1)
    .map(([c]) => c)
    .sort();
};

export const collectColors = (items: FilterProduct[]): string[] =>
  FILTER_COLORS.filter((c) => items.filter((p) => productColors(p).has(c)).length > 1);

export interface FilterState {
  q: string;
  /** Meerdere kleuren tegelijk; een shirt matcht als het één van de kleuren bevat. */
  colors: string[];
  league: string | null;
  country: string | null;
  letter: string | null;
  decade: string | null;
  sort: SortKey;
}

export const initialFilterState: FilterState = {
  q: "",
  colors: [],
  league: null,
  country: null,
  letter: null,
  decade: null,
  sort: "newest",
};

/** Kleuren van een shirt: handmatige labels + kleuren afgeleid uit de foto. */
const colorCache = new Map<string, Set<string>>();
export const productColors = (p: FilterProduct): Set<string> => {
  const key = p.nameKey ?? p.name;
  const cached = colorCache.get(key);
  if (cached) return cached;
  const set = new Set<string>([...(p.colors ?? []), ...derivedColors(shirtSignatures[p.nameKey ?? ""])]);
  colorCache.set(key, set);
  return set;
};

export const applyFilters = <T extends FilterProduct>(items: T[], s: FilterState): T[] => {
  // Zoeken: alle woorden moeten in de naam of het team voorkomen.
  const tokens = s.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const base = items.filter((p) => {
    const colors = productColors(p);
    const haystack = `${p.name} ${p.team}`.toLowerCase().replace(/[-/_]/g, " ");
    const matchesSearch = tokens.every((tok) => haystack.includes(tok));
    const matchesColor = s.colors.length === 0 || s.colors.some((c) => colors.has(c));
    const matchesLeague = !s.league || p.leagues.includes(s.league);
    const matchesCountry = !s.country || getCountry(p) === s.country;
    const matchesLetter =
      !s.letter || p.name.replace(/^[\d\-/\s]+/, "").charAt(0).toUpperCase() === s.letter;
    const matchesDecade = !s.decade || getDecade(extractYear(p.name)) === s.decade;
    return matchesSearch && matchesColor && matchesLeague && matchesCountry && matchesLetter && matchesDecade;
  });

  return sortProducts(base, s.sort);
};
