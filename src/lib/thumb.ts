/** Lichte thumbnail-versie van een titelfoto (CDN: /thumbs/...webp). */
export const thumbSrc = (url?: string) => {
  if (!url || !url.startsWith("/collectie/")) return url ?? "";
  return "/thumbs" + url.replace(/\.[^./]+$/, ".webp");
};

