import { extractYear } from "@/lib/productMeta";
import { productIdentity } from "@/lib/productIdentity";

export interface DetailProduct {
  name: string;
  team: string;
  image: string;
  sku?: string;
  description?: string;
  brand?: string;
  season?: string;
  edition?: string;
  material?: string;
  sizes: string[];
  gallery?: string[];
}

export const productPagePath = (product: Pick<DetailProduct, "name" | "image" | "sku">) =>
  `/shirt/${encodeURIComponent(productIdentity(product))}`;

export function getProductDetails(product: DetailProduct) {
  const seasonMatch = product.name.match(/\b((?:19|20)?\d{2})\s*[-–/]\s*((?:19|20)?\d{2})\b/);
  const year = extractYear(product.name);
  const expand = (value: string) => value.length === 4 ? value : String(Number(value) < 40 ? 2000 + Number(value) : 1900 + Number(value));
  const season = product.season || (seasonMatch ? `${expand(seasonMatch[1])}/${expand(seasonMatch[2])}` : year ? String(year) : "Not specified");
  const brand = product.brand || product.name.match(/\b(Nike|Adidas|Puma|Umbro|Kappa|Macron|Mizuno|Hummel|New Balance|Castore|Joma|Lotto|Reebok)\b/i)?.[0] || "Not confirmed";
  const edition = product.edition || (product.name.match(/\b[^()]*?(?:Special Edition|Final Edition|Halloween Edition|Anniversary Edition|Concept)(?:\b)/i)?.[0]?.replace(product.team, "").trim()) ||
    (/goalkeeper/i.test(product.name) ? "Goalkeeper" : /pre.match|training/i.test(product.name) ? "Training" : /\baway\b/i.test(product.name) ? "Away" : /\bthird\b/i.test(product.name) ? "Third" : /\bfourth\b/i.test(product.name) ? "Fourth" : /\bhome\b/i.test(product.name) ? "Home" : "Not specified");
  const material = product.material || "Not confirmed — ask us for the fabric composition";
  const sleeve = /long\s*sleeve/i.test(product.name) ? "long-sleeve shirt" : /shorts?\b/i.test(product.name) ? "shorts" : "football shirt";
  const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
  const paragraphs = [
    `${product.name.replace(/[\u200B-\u200D\uFEFF]/g, "")} is listed as a ${sleeve} for ${product.team}${season !== "Not specified" ? `, with ${season} identified in the catalogue` : ""}${edition !== "Not specified" ? `. Edition: ${edition}` : ""}.`,
    ...(product.description && normalise(product.description) !== normalise(product.name) && !/authentiek|vintage|limited edition/i.test(product.description) ? [product.description] : []),
    `This listing includes ${product.gallery?.length || 1} product photo${(product.gallery?.length || 1) === 1 ? "" : "s"}. The gallery shows the supplied shirt images so you can compare its design and details before ordering. Available size options: ${product.sizes.join(", ")}.`,
    `Check the size options before adding this item to your basket. Name and number personalisation can be selected separately for each shirt. ${product.material ? `Listed fabric: ${product.material}.` : "The exact fabric composition has not been confirmed for this item; contact us for label details or additional photos before ordering."}`,
  ];
  return { brand, season, edition, material, paragraphs };
}