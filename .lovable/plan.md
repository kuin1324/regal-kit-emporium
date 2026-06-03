## Wijzigingen

### 1. Homepage carrousel (HeroCarousel.tsx)
De huidige carrousel toont 3 slides met oude shirtfoto's (`shirt-new-2.png`, `shirt-new-6.png`) en de jerseys-clothesline. Deze worden vervangen door de nieuwe shirt-foto's:

- Slide "Special Editions" → foto van **FC Barcelona Black & Gold** (voorkant)
- Slide "Nationale Trots" → foto van **Portugal x Louis Vuitton** (voorkant)
- Slide "Italië x Versace" → vervangen door **Italië Special Trainingsshirt** (voorkant), titel/CTA aangepast naar "Italië Special Edition"

De oude imports (`shirt-new-2`, `shirt-new-6`, `jerseys-clothesline`) worden verwijderd uit dit bestand. De vertaalsleutels in `nl.json`/`en.json` voor `home.slides.italyTitle/Subtitle/Cta` worden bijgewerkt.

### 2. Verzendinformatie bij elk shirt (ProductDetailModal)
In het product-modal komt een nieuw blok onder de prijs / boven "In Winkelmandje" met de verzendtarieven:

```
Verzendkosten
1–2 shirts: €10
3–4 shirts: €8
5–6 shirts: €6
7–8 shirts: GRATIS
```

Compacte tabel-achtige weergave, met de gratis-regel in goud-accent.

### 3. Dynamische verzending in winkelmandje (CartDrawer + CartContext)
Een helperfunctie `calculateShipping(count)` wordt toegevoegd:

```
count <= 2 → €10
count 3-4 → €8
count 5-6 → €6
count >= 7 → €0 (gratis)
```

In `CartDrawer`:
- Nieuwe regel "Verzending" boven het totaal met het berekende bedrag (of "GRATIS" in goud).
- Bij minder dan 7 shirts: een hint "Voeg X shirt(s) toe voor gratis verzending".
- Het totaalbedrag wordt: `items-totaal + verzending`.
- De WhatsApp/e-mail-bestelregels krijgen een extra regel "Verzending: €X" (of "GRATIS").

### 4. Vertalingen
Nieuwe sleutels in `nl.json` en `en.json`:
- `product.shippingRates` (titel)
- `cart.shipping`, `cart.shippingFree`, `cart.shippingHint`
- Bijgewerkte `home.slides.italyTitle/Subtitle/Cta`

### Niet aangepast
- Productlijst blijft volledig intact (geen shirts verwijderd).
- Bestaande "shipping" tab in product-modal blijft, hier komt enkel het tarievenblok bij.
- Geen backend-/edge-function-wijzigingen nodig.