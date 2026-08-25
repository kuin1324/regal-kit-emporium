# Collectie herstellen, foto's aanpassen en publiceerbaar maken

## Uitgangssituatie (gecontroleerd)

- `public/collectie/` is 3,3 GB met 6.552 onbewerkte JPG/PNG-bestanden — boven de publicatielimiet van 3 GB. De eerdere WebP-conversie is verdwenen.
- `src/lib/collection.ts` bevat geen club/land-splitsing meer; de eerdere ShopByTeam-wijziging is verdwenen.
- De collectie voegt producten samen op **naam**. Daardoor vallen 267 geldige producten weg en blijven 2.060 shirts over: 35 pagina's van 60. Samenvoegen op unieke SKU levert 2.327 shirts op, precies 39 pagina's.

## 1. Pagina 36 t/m 39 terugbrengen

- Vervang naam-deduplicatie door deduplicatie op unieke SKU (fotopad als terugval).
- Shirts met dezelfde zichtbare naam blijven aparte producten zolang hun SKU/fotoset verschilt.
- Grid, favorieten en bulkselectie werken op die unieke id, zodat gelijknamige shirts elkaar niet overschrijven.
- De productmodal zoekt eerst op SKU en valt alleen voor oude links terug op naam, zodat altijd het juiste dubbele shirt opent.

## 2. Foto's comprimeren zodat publiceren lukt

- Alle foto's omzetten naar WebP, max ~1400 px lange zijde, kwaliteit 80. Verwachting: van 3,3 GB naar ruim onder 2,3 GB.
- Alle fotopaden in de productdata meeschrijven naar `.webp`.
- Thumbnails opnieuw genereren zodat elke gridkaart een lichte voorvertoning heeft en de placeholders verdwijnen.

## 3. Foto- en naamaanpassingen

- **4a en 4b**: beide shirts krijgen exact dezelfde weergavenaam (uniek gehouden via een onzichtbaar teken).
- **PSG Home Shirt 25-26**: foto 1 verwijderen, foto 2 wordt hoofd-/titelfoto.
- **Ajax Home Shirt 25-26**: laatste foto verwijderen.
- **Tottenham Hotspur Home Shirt 25-26** en **FC Barcelona Home Shirt 25-26** (originele set van 6):
  - nieuw apart shirt met foto 1 als titelfoto en foto 6 als tweede foto;
  - het origineel houdt foto 2 t/m 5.
- **AC Milan Goalkeeper Shirt 25-26**:
  - de laatste twee foto's worden een apart shirt; daarvan wordt de tweede foto de titelfoto;
  - bij de vier overgebleven foto's gaat de huidige eerste foto naar plek 4 en wordt de daaropvolgende foto de nieuwe titelfoto;
  - alleen dat shirt met vier foto's krijgt "Longsleeve" in de naam.

## 4. Shop by team & country

- Eerst alle clubs, daarna alle landen, met een gelijk aantal van beide (dus meer landen dan nu).
- Het aantal iconen wordt afgestemd op de kolommen zodat de laatste rij altijd vol is.

## Controle

- Ongefilterde collectie toont 2.327 shirts en 39 pagina's.
- Pagina 36 t/m 39 openen, meerdere gelijknamige varianten controleren op de juiste foto's.
- Mapgrootte van `public/collectie/` controleren (doel ≈ 2,3 GB of lager) en steekproef op zichtbare foto's in grid en modal.

## Technisch

Eenmalig compressiescript over `public/collectie/`, daarna `scripts/generate-thumbs.mjs` opnieuw draaien. Data-aanpassingen als eenmalig script op `src/data/public_collectie.ts` met nieuwe SKU-hashes voor afgesplitste shirts. Gedeelde helper `productIdentity(product) = sku || image` voor samenvoegen, selectie en detailweergave. `src/lib/collection.ts` en `src/components/ShopByTeam.tsx` voor de club/land-verdeling. Prijscatalogus voor bestellingen opnieuw genereren zodat nieuwe SKU's bestelbaar blijven. De verwijderde betaalfunctie komt niet terug.
