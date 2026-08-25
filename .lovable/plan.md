# Pagina 36 t/m 39 van de collectie herstellen

## Diagnose

- De betaalwijzigingen in `CheckoutModal.tsx` en `create-checkout` verwijderen geen collectieproducten en zijn niet de oorzaak.
- De bronnen bevatten momenteel 284 handmatige shirts en 2.043 publieke producten.
- De collectie voegt producten nu samen op **naam**. Daardoor worden 267 geldige producten met dezelfde zichtbare naam weggefilterd en blijven 2.060 shirts over: 35 pagina's van 60.
- Samenvoegen op de unieke SKU in plaats van de naam levert 2.327 shirts op: exact 39 pagina's van maximaal 60 shirts.

## Uitvoering

1. **Collectie samenvoegen op unieke identiteit**
   - Vervang naam-deduplicatie door SKU-deduplicatie, met het fotopad als fallback als een SKU ontbreekt.
   - Houd shirts met dezelfde zichtbare naam als afzonderlijke producten wanneer hun SKU/fotoset verschilt.
   - Pas dit gedeeld toe zodat Hele Collectie en de categoriepagina's dezelfde complete productbron gebruiken.

2. **Het juiste dubbele shirt openen**
   - Laat gridkaarten een unieke product-id/SKU doorgeven in plaats van alleen de naam.
   - Laat de productmodal eerst op SKU zoeken en alleen voor oudere links terugvallen op naam.
   - Behoud de exacte galerij, hoofdafbeelding en prijs van iedere variant.

3. **Bestaande links en selectie behouden**
   - Laat links uit bestelmails primair op foto/SKU matchen.
   - Maak favorieten, bulkselectie en React-keys variantveilig, zodat twee shirts met dezelfde naam elkaar niet overschrijven.

4. **Controleren**
   - Verifieer dat de standaard, ongefilterde collectie 2.327 shirts en 39 pagina's toont.
   - Open meerdere gelijknamige varianten op pagina 36–39 en controleer dat elk de juiste foto's toont.
   - Controleer zoeken, filters, paginawisseling en mobiel swipen zonder de verwijderde betaalfunctie terug te brengen.

## Technisch

De kern wordt één gedeelde helper, bijvoorbeeld `productIdentity(product) = sku || image`, die wordt gebruikt bij samenvoegen, selectie en detailweergave. Er worden geen checkoutbestanden hersteld en de aangeleverde oude betaalcode wordt niet teruggezet.
