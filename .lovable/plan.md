# Collectie herstellen, foto's aanpassen en site publiceerbaar maken

## Wat er nu aan de hand is

- In `public/collectie/` staan 1215 shirtmappen + 847 losse shirts (samen ~2062 shirts), maar de productlijst bevat er maar 2043 inclusief gesplitste varianten. Er ontbreken dus honderden shirts — dat zijn de pagina's 36 t/m 39.
- De foto's zijn onbewerkte JPG/PNG's: 3,3 GB voor 6552 bestanden, gemiddeld 459 KB per foto. Dat is de reden dat foto's traag/niet laden én dat publiceren faalt (limiet 3 GB).

## 1. Foto's comprimeren (publiceren + laadsnelheid)

- Alle foto's in `public/collectie/` omzetten naar WebP, max ~1400 px lange zijde, kwaliteit ~80. Verwachte omvang: ~300–450 MB in plaats van 3,3 GB — ruim onder de publicatielimiet.
- Alle paden in de productdata meeschrijven naar `.webp`, en de thumbnails (`public/thumbs/`) opnieuw genereren zodat elk shirt een lichte gridfoto heeft.
- Resultaat: foto's laden merkbaar sneller en de placeholders verdwijnen.

## 2. Collectie herstellen (pagina 36 t/m 39)

- De collectie opnieuw opbouwen uit alle mappen en losse bestanden in `public/collectie/`, zodat elk shirt weer in de lijst staat.
- Bestaande handmatige aanpassingen (splitsingen, hernoemingen, prijzen, teams/leagues, SKU's) worden op de bestaande shirts behouden; alleen ontbrekende shirts worden toegevoegd.

## 3. Naam- en fotobewerkingen

- **4a en 4b**: beide shirts krijgen exact dezelfde weergavenaam (uniek gehouden via een onzichtbaar teken, zoals bij de eerdere splitsingen).
- **PSG Home Shirt 25-26**: foto 1 verwijderen; foto 2 wordt hoofd-/titelfoto.
- **Ajax Home Shirt 25-26**: laatste foto verwijderen.
- **Tottenham Hotspur Home Shirt 25-26** en **FC Barcelona Home Shirt 25-26** (uit de originele set van 6):
  - nieuw apart shirt met foto 1 als titelfoto en foto 6 als tweede foto;
  - origineel houdt foto 2 t/m 5.
- **AC Milan Goalkeeper Shirt 25-26**:
  - de laatste twee foto's worden een apart shirt; daarvan wordt de tweede foto de titelfoto;
  - het overgebleven shirt met vier foto's: huidige eerste foto naar plek 4, de daaropvolgende foto wordt de nieuwe eerste/titelfoto;
  - dit shirt met vier foto's krijgt "Longsleeve" in de naam.

## 4. Shop by team & country

- Eerst alle clubs, daarna alle landen — met een gelijk aantal van beide (dus meer landen dan nu).
- Het aantal iconen wordt afgestemd op de kolommen, zodat de rij altijd netjes vol eindigt (geen halve laatste rij).

## Technisch

- Compressie via een eenmalig script (Pillow/sharp) over `public/collectie/`, daarna `scripts/generate-thumbs.mjs` opnieuw draaien.
- Data-herstel via `scripts/generate-public-collectie.mjs`, aangevuld met een merge-stap die bestaande items in `src/data/public_collectie.ts` niet overschrijft.
- Foto-/naamwijzigingen als eenmalig script op `src/data/public_collectie.ts`, met nieuwe SKU-hashes voor de afgesplitste shirts.
- `src/lib/collection.ts` (`topTeams`) en `src/components/ShopByTeam.tsx` aanpassen voor de club/land-verdeling en rij-uitlijning.
- Prijscatalogus voor bestellingen opnieuw genereren zodat nieuwe/gesplitste SKU's bestelbaar blijven.
