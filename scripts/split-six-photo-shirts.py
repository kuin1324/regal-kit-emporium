# Splitst shirts met 6 foto's in twee producten met dezelfde naam:
#  - variant A: foto's met de lichte studio-achtergrond (#ece2e1)
#  - variant B: de overige foto's
# De tweede variant krijgt een zero-width space achter de naam zodat de
# weergave identiek is maar de lookup uniek blijft.
import json, re, hashlib, urllib.parse, os
from PIL import Image

TS = "src/data/public_collectie.ts"
TARGET = (0xEC, 0xE2, 0xE1)
TOL = 14

raw = open(TS, encoding="utf8").read()
start = raw.index("[", raw.index("] = ["))
items = json.loads(raw[start:raw.rindex("]") + 1])

def bg(url):
    p = urllib.parse.unquote(url).lstrip("/")
    path = os.path.join("public", p.split("/", 1)[1]) if p.startswith("collectie/") else p
    path = os.path.join("public", p)
    if not os.path.exists(path):
        return None
    try:
        im = Image.open(path).convert("RGB")
    except Exception:
        return None
    w, h = im.size
    pts = [(2, 2), (w - 3, 2), (2, h - 3), (w - 3, h - 3), (w // 2, 2)]
    px = [im.getpixel(pt) for pt in pts]
    return tuple(sum(c[i] for c in px) // len(px) for i in range(3))

def is_studio(url):
    c = bg(url)
    return c is not None and all(abs(c[i] - TARGET[i]) <= TOL for i in range(3))

ZW = "\u200b"
out = []
split_count = 0
for it in items:
    g = it.get("gallery") or []
    if len(g) != 6:
        out.append(it)
        continue
    a = [u for u in g if is_studio(u)]
    b = [u for u in g if u not in a]
    if len(a) < 1 or len(b) < 1:
        out.append(it)
        continue
    split_count += 1
    for idx, gal in enumerate((a, b)):
        nw = dict(it)
        nw["gallery"] = gal
        nw["image"] = gal[0]
        if idx:
            nw["name"] = it["name"] + ZW
        nw["sku"] = "HOFS-" + hashlib.sha1((nw["name"] + str(idx)).encode()).hexdigest()[:5].upper()
        out.append(nw)

header = raw[:start]
open(TS, "w", encoding="utf8").write(
    header + json.dumps(out, ensure_ascii=False, separators=(",", ":")).replace("},{", "},\n{") + ";\n"
)
print(f"{split_count} shirts gesplitst -> {len(out)} producten")
