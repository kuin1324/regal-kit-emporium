import { useRef, useState } from "react";
import { Search, Upload, X, ImageIcon, Pipette } from "lucide-react";
import { useTranslation } from "react-i18next";
import SortDecadeBar from "@/components/SortDecadeBar";
import {
  COLOR_MAP,
  FilterState,
  buildPhotoSignatures,
  nearestColorName,
  collectColors,
  collectCountries,
  collectLeagues,
  ALPHABET,
  FilterProduct,
} from "@/lib/productFilters";

interface Props {
  items: FilterProduct[];
  state: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
}

const chip = (active: boolean) =>
  `px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide transition-all border ${
    active
      ? "bg-primary/20 text-primary border-primary/40"
      : "bg-transparent text-muted-foreground border-border/30 hover:border-primary/20"
  }`;

const ProductFilters = ({ items, state, onChange }: Props) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [picked, setPicked] = useState("#1E40AF");

  const leagues = collectLeagues(items);
  const countries = collectCountries(items);
  const colors = collectColors(items);

  const toggleColor = (color: string) =>
    onChange({
      colors: state.colors.includes(color)
        ? state.colors.filter((c) => c !== color)
        : [...state.colors, color],
    });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const url = ev.target?.result as string;
      setPhoto(url);
      try {
        onChange({ photoSigs: await buildPhotoSignatures(url) });
      } catch {
        onChange({ photoSigs: null });
      }
    };
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    setPhoto(null);
    onChange({ photoSigs: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };


  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );

  return (
    <div className="mb-8 flex flex-col items-start gap-5 rounded-2xl border border-border/50 bg-card/40 p-5 text-left">
      <h2 className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-primary">
        {t("filters.title", { defaultValue: "Filter" })}
      </h2>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder={t("search.placeholderShort")}
          value={state.q}
          onChange={(e) => onChange({ q: e.target.value })}
          className="w-full rounded-xl border border-border/50 bg-card py-3 pl-11 pr-4 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
        />
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      <div>
        {!photo ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-full border border-dashed border-border/60 px-5 py-2.5 text-sm text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
          >
            <Upload className="h-4 w-4" />
            {t("collection.photoSearchCta", { defaultValue: "Zoek met een foto" })}
          </button>
        ) : (
          <div className="flex items-center gap-3 rounded-full border border-primary/30 bg-card px-4 py-2">
            <img src={photo} alt={t("collection.yourPhoto")} className="h-8 w-8 rounded object-cover" />
            <ImageIcon className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">
              {t("collection.photoSearchActive", { defaultValue: "Zoekresultaten op basis van je foto" })}
            </span>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[11px] font-medium text-primary hover:underline">
              {t("collection.edit")}
            </button>
            <button type="button" onClick={clearPhoto} className="rounded-full p-1 transition-colors hover:bg-muted" aria-label={t("collection.removePhoto")}>
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {colors.length > 0 && (
        <Row label={t("filters.color", { defaultValue: "Kleur" })}>
          <button onClick={() => onChange({ colors: [] })} className={chip(state.colors.length === 0)}>
            {t("collection.allColors")}
          </button>
          {colors.map((color) => (
            <button key={color} onClick={() => toggleColor(color)} className={`flex items-center gap-1.5 ${chip(state.colors.includes(color))}`}>
              <span
                className="h-3 w-3 shrink-0 rounded-full border border-border/50"
                style={
                  COLOR_MAP[color].startsWith("linear")
                    ? { backgroundImage: COLOR_MAP[color] }
                    : { backgroundColor: COLOR_MAP[color] }
                }
              />
              {t(`collection.colors.${color}`, { defaultValue: color })}
            </button>
          ))}
          <label className={`flex cursor-pointer items-center gap-1.5 ${chip(false)}`}>
            <Pipette className="h-3 w-3" />
            {t("filters.colorPicker", { defaultValue: "Kleur kiezen" })}
            <input
              type="color"
              value={picked}
              onChange={(e) => {
                setPicked(e.target.value);
                const name = nearestColorName(e.target.value);
                if (!state.colors.includes(name)) onChange({ colors: [...state.colors, name] });
              }}
              className="h-4 w-4 cursor-pointer appearance-none rounded-full border-0 bg-transparent p-0"
            />
          </label>
        </Row>
      )}

      {leagues.length > 0 && (
        <Row label={t("filters.league", { defaultValue: "Competitie" })}>
          <button onClick={() => onChange({ league: null })} className={chip(!state.league)}>
            {t("leagues.all")}
          </button>
          {leagues.map((l) => (
            <button key={l} onClick={() => onChange({ league: state.league === l ? null : l })} className={chip(state.league === l)}>
              {l}
            </button>
          ))}
        </Row>
      )}

      {countries.length > 0 && (
        <Row label={t("filters.country", { defaultValue: "Land" })}>
          <button onClick={() => onChange({ country: null })} className={chip(!state.country)}>
            {t("filters.allCountries", { defaultValue: "Alle landen" })}
          </button>
          {countries.map((c) => (
            <button key={c} onClick={() => onChange({ country: state.country === c ? null : c })} className={chip(state.country === c)}>
              {c}
            </button>
          ))}
        </Row>
      )}

      <Row label={t("filters.letter", { defaultValue: "Letter" })}>
        <button
          onClick={() => onChange({ letter: null })}
          className={`h-7 w-7 rounded text-[10px] font-semibold transition-all ${
            !state.letter ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("leagues.all")}
        </button>
        {ALPHABET.map((letter) => (
          <button
            key={letter}
            onClick={() => onChange({ letter: state.letter === letter ? null : letter })}
            className={`h-7 w-7 rounded text-[10px] font-semibold transition-all ${
              state.letter === letter ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {letter}
          </button>
        ))}
      </Row>

      <div className="w-full">
        <SortDecadeBar
          sort={state.sort}
          onSortChange={(sort) => onChange({ sort })}
          decade={state.decade}
          onDecadeChange={(decade) => onChange({ decade })}
        />
      </div>
    </div>
  );
};


export default ProductFilters;
