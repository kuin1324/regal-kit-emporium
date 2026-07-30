/**
 * Gedeelde logica voor beeld-descriptoren.
 * Een descriptor is: 12 hue-bins + [wit, zwart, grijs, 0] + 2x2 RGB grid (12) = 28 getallen (0-255).
 * Dezelfde berekening gebeurt offline (Python) voor de catalogus en in de browser voor een
 * geüploade foto, zodat beide vergelijkbaar zijn.
 */

export const HUE_BINS = 12;
export const IDX_WHITE = 12;
export const IDX_BLACK = 13;
export const IDX_GRAY = 14;
export const IDX_GRID = 16;

const rgbToHls = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, l, s: 0 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = (h / 6 + 1) % 1;
  return { h, l, s };
};

/** Bouwt dezelfde descriptor als het generatiescript, uit een data-URL. */
export const buildPhotoSignature = (dataUrl: string, crop = { x: 0.18, y: 0.15, w: 0.64, h: 0.7 }): Promise<number[]> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 24;
      canvas.height = 24;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return reject(new Error("no canvas"));
      // Zelfde centrale uitsnede als offline: 18%-82% breed, 15%-85% hoog.
      const sx = img.width * crop.x;
      const sy = img.height * crop.y;
      ctx.drawImage(img, sx, sy, img.width * crop.w, img.height * crop.h, 0, 0, 24, 24);
      const { data } = ctx.getImageData(0, 0, 24, 24);

      const hue = new Array(HUE_BINS).fill(0);
      let white = 0;
      let black = 0;
      let gray = 0;
      const n = 24 * 24;
      for (let i = 0; i < data.length; i += 4) {
        const { h, l, s } = rgbToHls(data[i], data[i + 1], data[i + 2]);
        if (l > 0.86 && s < 0.25) white++;
        else if (l < 0.16) black++;
        else if (s < 0.16) gray++;
        else hue[Math.floor(h * HUE_BINS) % HUE_BINS]++;
      }

      const gc = document.createElement("canvas");
      gc.width = 2;
      gc.height = 2;
      const gctx = gc.getContext("2d", { willReadFrequently: true })!;
      gctx.drawImage(canvas, 0, 0, 2, 2);
      const gd = gctx.getImageData(0, 0, 2, 2).data;
      const grid: number[] = [];
      for (let i = 0; i < gd.length; i += 4) grid.push(gd[i], gd[i + 1], gd[i + 2]);

      resolve([
        ...hue.map((x) => Math.round((x / n) * 255)),
        Math.round((white / n) * 255),
        Math.round((black / n) * 255),
        Math.round((gray / n) * 255),
        0,
        ...grid,
      ]);
    };
    img.onerror = () => reject(new Error("bad image"));
    img.src = dataUrl;
  });

/**
 * Meerdere descriptoren van dezelfde foto (verschillende uitsnedes).
 * Zo werkt zoeken ook met een bijgesneden of ruime/onscherpe foto: bij het
 * vergelijken telt steeds de best passende uitsnede.
 */
export const buildPhotoSignatures = (dataUrl: string): Promise<number[][]> =>
  Promise.all([
    buildPhotoSignature(dataUrl, { x: 0.18, y: 0.15, w: 0.64, h: 0.7 }),
    buildPhotoSignature(dataUrl, { x: 0.02, y: 0.02, w: 0.96, h: 0.96 }),
    buildPhotoSignature(dataUrl, { x: 0.3, y: 0.28, w: 0.4, h: 0.44 }),
  ]);


/** Aandeel (0-1) per kleurcategorie, afgeleid uit de descriptor. */
export const colorShares = (sig: number[]): Record<string, number> => {
  const f = (i: number) => (sig[i] ?? 0) / 255;
  const hueShare = (bins: number[]) => bins.reduce((a, b) => a + f(b), 0);
  return {
    rood: hueShare([0, 11]),
    oranje: hueShare([1]),
    geel: hueShare([2]),
    groen: hueShare([3, 4, 5]),
    blauw: hueShare([6, 7]),
    paars: hueShare([8, 9]),
    roze: hueShare([10]),
    wit: f(IDX_WHITE),
    zwart: f(IDX_BLACK),
    grijs: f(IDX_GRAY),
  };
};

const CHROMATIC = ["rood", "oranje", "geel", "groen", "blauw", "roze"];

/** Kleuren die daadwerkelijk zichtbaar aanwezig zijn op het shirt. */
export const derivedColors = (sig: number[] | undefined): string[] => {
  if (!sig || sig.length < IDX_GRID) return [];
  const shares = colorShares(sig);
  const out: string[] = [];
  // Paars telt mee als roze zodat de filterset compact blijft.
  const merged: Record<string, number> = { ...shares, roze: shares.roze + shares.paars * 0.8 };
  for (const key of [...CHROMATIC, "wit", "zwart"]) {
    if ((merged[key] ?? 0) >= 0.14) out.push(key);
  }
  const strongChromatic = CHROMATIC.filter((c) => (merged[c] ?? 0) >= 0.1);
  if (strongChromatic.length >= 3) out.push("meerkleurig");
  return out;
};

/** Gelijkenis 0..1 tussen twee descriptoren (hoger = beter). */
export const similarity = (a: number[], b: number[]): number => {
  if (!a || !b || a.length < IDX_GRID || b.length < IDX_GRID) return 0;
  // 1) Histogram-overlap over de eerste 15 waarden (kleurverdeling).
  let overlap = 0;
  let total = 0;
  for (let i = 0; i < IDX_GRAY + 1; i++) {
    const x = a[i] / 255;
    const y = b[i] / 255;
    overlap += Math.min(x, y);
    total += Math.max(x, y);
  }
  const hist = total > 0 ? overlap / total : 0;

  // 2) Grove layout-gelijkenis via het 2x2 grid (helderheid-genormaliseerd).
  const gridA = a.slice(IDX_GRID);
  const gridB = b.slice(IDX_GRID);
  const mean = (v: number[]) => v.reduce((s, x) => s + x, 0) / Math.max(1, v.length);
  const ma = mean(gridA) || 1;
  const mb = mean(gridB) || 1;
  let diff = 0;
  for (let i = 0; i < Math.min(gridA.length, gridB.length); i++) {
    diff += Math.abs(gridA[i] / ma - gridB[i] / mb);
  }
  const layout = Math.max(0, 1 - diff / gridA.length / 1.2);

  return hist * 0.75 + layout * 0.25;
};
