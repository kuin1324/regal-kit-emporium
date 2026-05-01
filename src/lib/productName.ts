import { useTranslation } from "react-i18next";
import { allProducts } from "@/components/ProductDetailModal";

/** Returns the translated display name for a given internal product name (id). */
export const useProductName = () => {
  const { t } = useTranslation();
  return (name: string): string => {
    const p = allProducts.find((x) => x.name === name);
    if (!p) return name;
    return t(`products.${p.nameKey}`, { defaultValue: p.name });
  };
};
