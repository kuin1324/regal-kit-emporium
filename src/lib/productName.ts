import { useTranslation } from "react-i18next";
import { allProducts } from "@/components/ProductDetailModal";

/** Returns a function that translates an internal product name (id) to display name. */
export const useProductName = () => {
  const { t } = useTranslation();
  return (name: string): string => {
    const p = allProducts.find((x) => x.name === name);
    if (!p) return name;
    return t(`products.${p.nameKey}`, { defaultValue: p.name });
  };
};
