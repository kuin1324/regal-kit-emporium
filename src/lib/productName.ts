import { useTranslation } from "react-i18next";
import { allProducts } from "@/components/ProductDetailModal";

// Term dictionaries per language for shirt-name components (type words only).
// Proper nouns (club, country, year) stay intact. Longer phrases are listed
// first so partial matches don't fire early.
const TERMS: Record<string, [RegExp, string][]> = {
  nl: [],
  en: [
    [/\bTweede Uit\b/gi, "Second Away"],
    [/\bDerde\b/gi, "Third"],
    [/\bThuis\b/gi, "Home"],
    [/\bUit\b/gi, "Away"],
    [/\bKeeper\b/gi, "Goalkeeper"],
    [/\bShirt\b/gi, "Shirt"],
    [/\bLong Sleeve\b/gi, "Long Sleeve"],
    [/\bSpecial Edition\b/gi, "Special Edition"],
  ],
  fr: [
    [/\bTweede Uit\b/gi, "Deuxième Extérieur"],
    [/\bDerde\b/gi, "Troisième"],
    [/\bThuis\b/gi, "Domicile"],
    [/\bUit\b/gi, "Extérieur"],
    [/\bKeeper\b/gi, "Gardien"],
    [/\bShirt\b/gi, "Maillot"],
    [/\bLong Sleeve\b/gi, "Manches Longues"],
    [/\bSpecial Edition\b/gi, "Édition Spéciale"],
  ],
  de: [
    [/\bTweede Uit\b/gi, "Zweites Auswärts"],
    [/\bDerde\b/gi, "Drittes"],
    [/\bThuis\b/gi, "Heim"],
    [/\bUit\b/gi, "Auswärts"],
    [/\bKeeper\b/gi, "Torwart"],
    [/\bShirt\b/gi, "Trikot"],
    [/\bLong Sleeve\b/gi, "Langarm"],
    [/\bSpecial Edition\b/gi, "Sonderedition"],
  ],
  es: [
    [/\bTweede Uit\b/gi, "Segunda Visitante"],
    [/\bDerde\b/gi, "Tercera"],
    [/\bThuis\b/gi, "Local"],
    [/\bUit\b/gi, "Visitante"],
    [/\bKeeper\b/gi, "Portero"],
    [/\bShirt\b/gi, "Camiseta"],
    [/\bLong Sleeve\b/gi, "Manga Larga"],
    [/\bSpecial Edition\b/gi, "Edición Especial"],
  ],
  pt: [
    [/\bTweede Uit\b/gi, "Segunda Fora"],
    [/\bDerde\b/gi, "Terceira"],
    [/\bThuis\b/gi, "Casa"],
    [/\bUit\b/gi, "Fora"],
    [/\bKeeper\b/gi, "Guarda-redes"],
    [/\bShirt\b/gi, "Camisa"],
    [/\bLong Sleeve\b/gi, "Manga Comprida"],
    [/\bSpecial Edition\b/gi, "Edição Especial"],
  ],
  it: [
    [/\bTweede Uit\b/gi, "Seconda Trasferta"],
    [/\bDerde\b/gi, "Terza"],
    [/\bThuis\b/gi, "Casa"],
    [/\bUit\b/gi, "Trasferta"],
    [/\bKeeper\b/gi, "Portiere"],
    [/\bShirt\b/gi, "Maglia"],
    [/\bLong Sleeve\b/gi, "Manica Lunga"],
    [/\bSpecial Edition\b/gi, "Edizione Speciale"],
  ],
  zh: [
    [/\bTweede Uit\b/gi, "第二客场"],
    [/\bDerde\b/gi, "第三"],
    [/\bThuis\b/gi, "主场"],
    [/\bUit\b/gi, "客场"],
    [/\bKeeper\b/gi, "门将"],
    [/\bShirt\b/gi, "球衣"],
    [/\bLong Sleeve\b/gi, "长袖"],
    [/\bSpecial Edition\b/gi, "特别版"],
  ],
};

const translateName = (name: string, lang: string): string => {
  const base = (lang || "nl").split("-")[0];
  const rules = TERMS[base] || [];
  let out = name;
  for (const [re, val] of rules) out = out.replace(re, val);
  return out.replace(/\s+/g, " ").trim();
};

/** Returns a function that translates an internal product name (id) to display name. */
export const useProductName = () => {
  const { i18n } = useTranslation();
  return (name: string): string => {
    const p = allProducts.find((x) => x.name === name);
    const source = p?.name ?? name;
    return translateName(source, i18n.language);
  };
};
