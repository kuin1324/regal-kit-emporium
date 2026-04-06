

## Plan: Filters toevoegen — Kleur, Letter en Foto

### Wat wordt er gebouwd

Drie nieuwe filteropties op de Collectie-pagina, naast de bestaande zoekbalk en league/team filters:

1. **Kleurfilter** — Gekleurde bolletjes (zwart, wit, blauw, rood, goud, groen, etc.) waarop je kunt klikken om shirts van die kleur te tonen
2. **Letterfilter** — Een A-Z rij knoppen waarmee je shirts filtert op beginletter van de naam
3. **Fotofilter** — Kleine thumbnail-previews van alle shirts zodat je visueel kunt zoeken en direct naar een shirt kunt springen

### Technische aanpak

**1. Product data uitbreiden** (`src/components/ProductDetailModal.tsx`)
- Voeg een `colors` property toe aan elk product in `allProducts`, bijv.:
  - Stone Island x Ajax → `["zwart", "rood"]`
  - Italy x Versace → `["blauw", "goud"]`
  - etc.

**2. Filters toevoegen aan Collectie** (`src/pages/Collectie.tsx`)
- Nieuwe state: `selectedColor`, `selectedLetter`
- **Kleurbollen**: Een rij met gekleurde cirkels onder de zoekbalk. Klik = filter op die kleur
- **Letterbalk**: A-Z knoppen. Klik op een letter = toon alleen shirts die met die letter beginnen. "Alle" knop om te resetten
- **Foto-rij**: Horizontaal scrollbare rij met kleine thumbnails van alle shirts. Klik = open dat product direct
- Alle filters werken samen (kleur + letter + league + zoekterm)

**3. Layout**
De filters komen onder de zoekbalk in deze volgorde:
1. Zoekbalk (bestaand)
2. Kleurbollen + Letterbalk (nieuwe rij)
3. Foto-thumbnails (scrollbare rij)
4. League/Team tabs (bestaand)
5. Product grid (bestaand)

