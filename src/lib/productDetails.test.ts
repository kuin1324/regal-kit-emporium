import { describe, expect, it } from "vitest";
import { getProductDetails, productPagePath } from "./productDetails";

const shirt = { name: "Ajax Home Shirt 25-26", team: "Ajax", image: "/shirt.jpg", sizes: ["S", "M"] };
describe("shirt information", () => {
  it("reads the full season from the product name", () => {
    expect(getProductDetails(shirt).season).toBe("2025/2026");
    expect(getProductDetails({ ...shirt, name: "Shirt 1999-2000" }).season).toBe("1999/2000");
  });
  it("does not guess a team's manufacturer or material", () => {
    expect(getProductDetails(shirt).brand).toBe("Not confirmed");
    expect(getProductDetails(shirt).material).toContain("Not confirmed");
  });
  it("preserves supplied factual attributes", () => {
    const details = getProductDetails({ ...shirt, brand: "Adidas", material: "100% polyester", edition: "Home", season: "2026/2027" });
    expect(details).toMatchObject({ brand: "Adidas", material: "100% polyester", edition: "Home", season: "2026/2027" });
  });
  it("gives same-name shirts with distinct identities different URLs", () => {
    expect(productPagePath({ ...shirt, sku: "ONE" })).not.toBe(productPagePath({ ...shirt, sku: "TWO" }));
    expect(decodeURIComponent(productPagePath(shirt).slice(7))).toBe("/shirt.jpg");
  });
});