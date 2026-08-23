/** Lichte thumbnail-versie van een titelfoto (public/thumbs/...webp). */
export const thumbSrc = (url?: string) => {
  if (!url || !url.startsWith("/collectie/")) return url ?? "";
  return "/thumbs" + url.replace(/^\/collectie/, "/collectie").replace(/\.[^./]+$/, ".webp");
};
