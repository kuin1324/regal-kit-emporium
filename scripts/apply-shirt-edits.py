#!/usr/bin/env python3
"""Eenmalige data-aanpassingen op src/data/public_collectie.ts."""
import json, re, pathlib

P = pathlib.Path("src/data/public_collectie.ts")
raw = P.read_text()
start = raw.index("[", raw.index("] = ["))
head = raw[:start]
items = json.loads(raw[start:raw.rindex("]") + 1])

ZW = "\u200b"
def nm(s): return s.replace(ZW, "").strip()

DELETE = {
    "Chelsea Home Long Sleeve Shirt 26-27",
    "Brighton & Hove Albion Home Shirt 25-26",
    "Brighton & Hove Albion Away Shirt 25-26",
    "South Korea Away Shirt 2026",
    "South Korea Away Shirt 2026 If you would like to explore further",
    "Manchester City FtblNRGY+ Retro Shirt 24-25",
    "Manchester City FtblNrgy+ Retro Shirt 24-25",
    "Manchester City FtblNRGY+ Retro Shirt 24-25 2",
    "Controleer handmatig detail 1",
    "Controleer handmatig detail 2",
    "Controleer handmatig detail 3",
    "Controleer handmatig detail 4",
    "FC Barcelona Special Edition 'Pastel Dream' Shirt 25-26",
}

RENAME = {
    "Colombia Away Shirt 26-27" + ZW: "adidas Campeon 25 Shirt",
    "Colombia Away Longsleeve 2026": "adidas Campeon 25 Shirt",
    "Controleer handmatig": "Liverpool Phoenix Special Edition Shirt 25/26",
    "Sparta Rotterdam Home Shirt 26-27": "Inter Milan Concept Shirt 25/26",
    "Liverpool Icons Shirt 25-26": "Japan Away Shirt 2026",
}

TEAM_FIX = {
    "adidas Campeon 25 Shirt": "adidas Campeon",
    "Liverpool Phoenix Special Edition Shirt 25/26": "Liverpool",
    "Inter Milan Concept Shirt 25/26": "Inter Milan",
    "Japan Away Shirt 2026": "Japan",
}

# gallery-herschikkingen: nieuwe volgorde als 1-based indexlijst
REORDER = {
    "Al-Nassr Away Shirt 25-26": [2, 1, 3, 4],
    "Germany Home Shirt 25-26": [2, 1, 3, 4],
    "Cameroon Home Shirt 22-23": [3, 2, 1, 4],
    "Inter Miami Away Shirt 24-25": [2, 3, 1, 4],
}

out = []
for it in items:
    name = it["name"]
    if nm(name) in DELETE or name in DELETE:
        continue

    order = REORDER.get(nm(name))
    if order:
        g = it.get("gallery") or []
        if len(g) >= max(order):
            it["gallery"] = [g[i - 1] for i in order] + g[max(order):]
            it["image"] = it["gallery"][0]

    if name in RENAME:
        it["name"] = RENAME[name]
        it["team"] = TEAM_FIX.get(it["name"], it["team"])

    n = it["name"]
    low = n.lower()

    # Special-collectie
    if ("special" in low or "concept" in low) and "Special" not in it["leagues"]:
        it["leagues"] = it["leagues"] + ["Special"]

    # Prijzen
    long_sleeve = bool(re.search(r"long\s?sleeve|longsleeve", low))
    retro = "retro" in low
    it["price"] = "€45" if (long_sleeve and retro) else "€40" if long_sleeve else "€35" if retro else "€30"

    out.append(it)

P.write_text(head + json.dumps(out, separators=(",", ":"), ensure_ascii=False).replace("},{", "},\n{") + ";\n")
print(f"{len(items)} -> {len(out)} shirts")
