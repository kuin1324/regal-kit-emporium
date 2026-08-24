// Helpers to derive a 4-digit year from shirt names like
// "1970 Mexico Thuis Shirt", "01-02 Liverpool Uit Shirt", "17-18 Barcelona".
// Also provides decade bucketing and sort comparators.

const fromTwoDigit = (yy: number) => (yy < 40 ? 2000 + yy : 1900 + yy);

/** Jaartal uit een shirtnaam, waar het ook staat: "1970 Mexico", "Milan 25-26", "Ajax 1995". */
export const extractYear = (name: string): number | null => {
  const s = name.trim();
  // Seizoen met vier cijfers: "1995-96" of "2025/26"
  const s4 = s.match(/\b(19|20)(\d{2})\s*[-–/]\s*\d{2}\b/);
  if (s4) return parseInt(s4[1] + s4[2], 10);
  // Seizoen met twee cijfers: "25-26", "01/02"
  const s2 = s.match(/\b(\d{2})\s*[-–/]\s*(\d{2})\b/);
  if (s2) return fromTwoDigit(parseInt(s2[1], 10));
  // Los jaartal: "1970", "2026"
  const y4 = s.match(/\b(19|20)\d{2}\b/);
  if (y4) return parseInt(y4[0], 10);
  // Los tweecijferig jaartal aan het begin: "95 Botafogo"
  const m1 = s.match(/^(\d{2})\b/);
  if (m1) return fromTwoDigit(parseInt(m1[1], 10));
  return null;
};

export const getDecade = (year: number | null): string | null => {
  if (year == null) return null;
  const d = Math.floor(year / 10) * 10;
  return `${d}s`;
};

export const DECADES = ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"] as const;
export type Decade = (typeof DECADES)[number];

export const parsePrice = (p: string): number => {
  const n = parseFloat(p.replace(/[^0-9,.]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

export type SortKey = "newest" | "oldest" | "az" | "za" | "priceAsc" | "priceDesc" | "photos";

const photoCount = (p: { gallery?: unknown[]; image?: unknown }): number =>
  Array.isArray(p.gallery) && p.gallery.length > 0 ? p.gallery.length : p.image ? 1 : 0;

export const sortProducts = <T extends { name: string; price: string }>(
  items: T[],
  key: SortKey,
): T[] => {
  const arr = [...items];
  arr.sort((a, b) => {
    switch (key) {
      case "newest": {
        const ya = extractYear(a.name) ?? -Infinity;
        const yb = extractYear(b.name) ?? -Infinity;
        return yb - ya;
      }
      case "oldest": {
        const ya = extractYear(a.name) ?? Infinity;
        const yb = extractYear(b.name) ?? Infinity;
        return ya - yb;
      }
      case "az":
        return a.name.localeCompare(b.name);
      case "za":
        return b.name.localeCompare(a.name);
      case "photos":
        return photoCount(b as never) - photoCount(a as never) || a.name.localeCompare(b.name);

      case "priceAsc":
        return parsePrice(a.price) - parsePrice(b.price);
      case "priceDesc":
        return parsePrice(b.price) - parsePrice(a.price);
    }
  });
  return arr;
};
