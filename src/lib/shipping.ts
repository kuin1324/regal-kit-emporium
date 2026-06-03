export function calculateShipping(count: number): number {
  if (count <= 0) return 0;
  if (count <= 2) return 10;
  if (count <= 4) return 8;
  if (count <= 6) return 6;
  return 0;
}

export const shippingTiers = [
  { range: "1–2", price: 10 },
  { range: "3–4", price: 8 },
  { range: "5–6", price: 6 },
  { range: "7+", price: 0 },
];
