export function calculateShipping(count: number): number {
  if (count <= 0) return 0;
  if (count <= 2) return 5;
  if (count <= 5) return 3;
  return 0;
}

export const shippingTiers = [
  { range: "1–2", price: 5 },
  { range: "3–5", price: 3 },
  { range: "6+", price: 0 },
];

/** Vanaf dit aantal shirts is de verzending gratis. */
export const FREE_SHIPPING_FROM = 6;
