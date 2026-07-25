import { extractYear, getDecade, sortProducts, SortKey } from "@/lib/productMeta";
import { shirtSignatures } from "@/data/shirtSignatures";

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

export const collectLeagues = (items: FilterProduct[]): string[] =>
  Array.from(new Set(items.flatMap((p) => p.leagues)))
    .filter((l) => l !== "Retro" && l !== "Long Sleeve" && l !== "Special")
    .sort();

export const collectCountries = (items: FilterProduct[]): string[] =>
  Array.from(new Set(items.map(getCountry).filter(Boolean) as string[])).sort();

export const collectColors = (items: FilterProduct[]): string[] =>
  FILTER_COLORS.filter((c) => items.some((p) => p.colors?.includes(c)));

export interface FilterState {
  q: string;
  color: string | null;
  league: string | null;
  country: string | null;
  letter: string | null;
  decade: string | null;
  sort: SortKey;
  photoSig: number[] | null;
}

export const initialFilterState: FilterState = {
  q: "",
  color: null,
  league: null,
  country: null,
  letter: null,
  decade: null,
  sort: "newest",
  photoSig: null,
};

const distance = (a: number[], b: number[]): number => {
  let sum = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum);
};

export const applyFilters = <T extends FilterProduct>(items: T[], s: FilterState): T[] => {
  const q = s.q.trim().toLowerCase();
  const base = items.filter((p) => {
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.team.toLowerCase().includes(q) ||
      p.leagues.some((l) => l.toLowerCase().includes(q)) ||
      (getCountry(p) || "").toLowerCase().includes(q) ||
      (p.colors || []).some((c) => c.includes(q));
    const matchesColor = !s.color || p.colors?.includes(s.color);
    const matchesLeague = !s.league || p.leagues.includes(s.league);
    const matchesCountry = !s.country || getCountry(p) === s.country;
    const matchesLetter =
      !s.letter || p.name.replace(/^[\d\-/\s]+/, "").charAt(0).toUpperCase() === s.letter;
    const matchesDecade = !s.decade || getDecade(extractYear(p.name)) === s.decade;
    return matchesSearch && matchesColor && matchesLeague && matchesCountry && matchesLetter && matchesDecade;
  });

  if (s.photoSig) {
    return [...base].sort((a, b) => {
      const sa = shirtSignatures[a.nameKey ?? ""];
      const sb = shirtSignatures[b.nameKey ?? ""];
      const da = sa ? distance(sa, s.photoSig!) : Infinity;
      const db = sb ? distance(sb, s.photoSig!) : Infinity;
      return da - db;
    });
  }

  return sortProducts(base, s.sort);
};

/** Maakt een 4x4 RGB signatuur van een geüploade foto voor overeenkomst-zoeken. */
export const buildPhotoSignature = (dataUrl: string): Promise<number[]> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 4;
      canvas.height = 4;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("no canvas"));
      ctx.drawImage(img, 0, 0, 4, 4);
      const { data } = ctx.getImageData(0, 0, 4, 4);
      const out: number[] = [];
      for (let i = 0; i < data.length; i += 4) out.push(data[i], data[i + 1], data[i + 2]);
      resolve(out);
    };
    img.onerror = () => reject(new Error("bad image"));
    img.src = dataUrl;
  });
