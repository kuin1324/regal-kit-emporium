/**
 * Unieke identiteit van een product.
 *
 * Shirts kunnen dezelfde zichtbare naam hebben (verschillende fotosets van
 * hetzelfde model). De SKU is uniek; valt terug op het fotopad.
 */
export const productIdentity = (p: { sku?: string; image?: string; name: string }) =>
  p.sku || p.image || p.name;

/** Zoekt een product op identiteit (SKU of fotopad) en anders op naam. */
export const findProduct = <T extends { sku?: string; image?: string; name: string }>(
  items: T[],
  id: string | null
): T | undefined => {
  if (!id) return undefined;
  return items.find((p) => productIdentity(p) === id) ?? items.find((p) => p.name === id);
};

/** Voegt lijsten samen en houdt varianten met dezelfde naam apart. */
export const mergeById = <T extends { sku?: string; image?: string; name: string }>(
  ...lists: T[][]
): T[] => {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const list of lists) {
    for (const p of list) {
      const id = productIdentity(p);
      if (seen.has(id)) continue;
      seen.add(id);
      out.push(p);
    }
  }
  return out;
};
