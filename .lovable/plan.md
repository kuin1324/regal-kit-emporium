# Productiefoto’s definitief herstellen

## Gecontroleerde oorzaak

- De gepubliceerde site draait de nieuwste frontendcode en bevat de juiste `.webp`-fotopaden.
- Dezelfde collectie- en thumbnail-URL’s die in Lovable Preview werken, geven op de publieke site `404 Not Found`.
- De bestanden bestaan lokaal wel: circa 13.102 afbeeldingen, samen ongeveer 1,2 GB.
- Aanpassingen aan retries, lazy loading of browsercache kunnen een ontbrekend productie­bestand niet herstellen.

## Aanpak

1. **Collectiefoto’s naar de Lovable Assets-CDN migreren**
   - Upload alle gebruikte hoofdfoto’s, galerijfoto’s en thumbnails naar de ingebouwde CDN-opslag.
   - Bewaar voor ieder bestand de gegenereerde asset-pointer; geen handmatig samengestelde URL’s.
   - Verwijder de zware lokale kopieën pas nadat elke upload en verwijzing is gecontroleerd.

2. **Catalogus naar betrouwbare CDN-URL’s omzetten**
   - Genereer één vaste mapping van de bestaande `/collectie/...`- en `/thumbs/...`-paden naar hun CDN-URL’s.
   - Laat grid, detailmodal, favorieten en winkelwagen dezelfde resolver gebruiken.
   - Behoud de originele foto als fallback wanneer een thumbnail niet beschikbaar is.

3. **Afbeeldingscomponent vereenvoudigen**
   - Behoud lazy loading, skeletons en vaste afbeeldingsverhoudingen.
   - Stop eindeloze cache-busting/retry-rondes bij echte 404’s; val direct terug van thumbnail naar de CDN-hoofdfoto.
   - De knop “Reload photos” blijft beschikbaar voor tijdelijke netwerkproblemen.

4. **Publicatie controleren**
   - Controleer dat alle catalogusverwijzingen een bestaande CDN-asset hebben.
   - Test meerdere niet-retroshirts op vroege én late collectiepagina’s in grid en productmodal.
   - Controleer na publicatie rechtstreeks op de publieke URL dat fotoverzoeken `200` geven en geen placeholders tonen.

## Resultaat

De live site gebruikt niet langer duizenden kwetsbare bestanden uit de deploymentbundle. Preview en publieke site laden voortaan exact dezelfde CDN-assets, zodat niet-retroshirts ook na updates betrouwbaar zichtbaar blijven.

## Technisch

De bestaande productdata en filters blijven intact. Alleen de media-opslag en URL-resolutie veranderen. De migratie gebruikt de ingebouwde assetflow met `.asset.json`-pointers en een gegenereerde URL-map; er worden geen externe stockhosts of tijdelijke links gebruikt.
