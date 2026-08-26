/**
 * Alle shirtfoto's worden vanaf de Lovable asset-CDN geserveerd in plaats van
 * vanuit de deployment-bundle, zodat preview en de gepubliceerde site exact
 * dezelfde bestanden laden.
 *
 *   /collectie/x.webp        -> /__l5e/assets-v1/<ID>/collectie__x.webp
 *   /thumbs/collectie/x.webp -> /__l5e/assets-v1/<ID>/thumbs__collectie__x.webp
 */
const PHOTO_ASSET_ID = "a750d26f-5765-4be1-a189-53d7875775ce";
export const PHOTO_CDN = `/__l5e/assets-v1/${PHOTO_ASSET_ID}/`;

export const cdnSrc = (url?: string | null) => {
  if (!url) return url ?? "";
  if (!url.startsWith("/collectie/") && !url.startsWith("/thumbs/")) return url;
  return PHOTO_CDN + url.slice(1).split("/").join("__");
};
