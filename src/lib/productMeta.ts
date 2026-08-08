// Helpers to derive a 4-digit year from shirt names like
// "1970 Mexico Thuis Shirt", "01-02 Liverpool Uit Shirt", "17-18 Barcelona".
// Also provides decade bucketing and sort comparators.

export const extractYear = (name: string): number | null => {
  const s = name.trim();
  // 4-digit year at start
  const m4 = s.match(/^(\d{4})/);
  if (m4) return parseInt(m4[1], 10);
  // Two-digit season like "01-02" or "95-96"
  const m2 = s.match(/^(\d{2})[-–\/](\d{2})/);
  if (m2) {
    const yy = parseInt(m2[1], 10);
    return yy < 40 ? 2000 + yy : 1900 + yy;
  }
  // Single two-digit year e.g. "95 Botafogo"
  const m1 = s.match(/^(\d{2})\b/);
  if (m1) {
    const yy = parseInt(m1[1], 10);
    return yy < 40 ? 2000 + yy : 1900 + yy;
  }
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

export type SortKey = "newest" | "oldest" | "az" | "priceAsc" | "priceDesc";

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
      case "priceAsc":
        return parsePrice(a.price) - parsePrice(b.price);
      case "priceDesc":
        return parsePrice(b.price) - parsePrice(a.price);
    }
  });
  return arr;
};
