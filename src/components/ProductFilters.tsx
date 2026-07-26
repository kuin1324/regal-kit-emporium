import { useRef, useState } from "react";
import { Search, Upload, X, ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import SortDecadeBar from "@/components/SortDecadeBar";
import {
  COLOR_MAP,
  FilterState,
  buildPhotoSignature,
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

  const leagues = collectLeagues(items);
  const countries = collectCountries(items);
  const colors = collectColors(items);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const url = ev.target?.result as string;
      setPhoto(url);
      try {
        onChange({ photoSig: await buildPhotoSignature(url) });
      } catch {
        onChange({ photoSig: null });
      }
    };
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    setPhoto(null);
    onChange({ photoSig: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="mb-8">
      <div className="relative max-w-md mx-auto mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={t("search.placeholderShort")}
          value={state.q}
          onChange={(e) => onChange({ q: e.target.value })}
          className="w-full pl-11 pr-4 py-3 rounded border border-border/50 bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      <div className="flex justify-center mb-4">
        {!photo ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-dashed border-border/60 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
          >
            <Upload className="h-4 w-4" />
            {t("collection.photoSearchCta", { defaultValue: "Zoek met een foto" })}
          </button>
        ) : (
          <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-primary/30 bg-card">
            <img src={photo} alt={t("collection.yourPhoto")} className="h-8 w-8 rounded object-cover" />
            <ImageIcon className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">
              {t("collection.photoSearchActive", { defaultValue: "Zoekresultaten op basis van je foto" })}
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[11px] font-medium text-primary hover:underline"
            >
              {t("collection.edit")}
            </button>
            <button
              type="button"
              onClick={clearPhoto}
              className="p-1 rounded-full hover:bg-muted transition-colors"
              aria-label={t("collection.removePhoto")}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

      </div>

      {colors.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          <button onClick={() => onChange({ color: null })} className={chip(!state.color)}>
            {t("collection.allColors")}
          </button>
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => onChange({ color: state.color === color ? null : color })}
              className={`flex items-center gap-1.5 ${chip(state.color === color)}`}
            >
              <span
                className="w-3 h-3 rounded-full border border-border/50 shrink-0"
                style={
                  COLOR_MAP[color].startsWith("linear")
                    ? { backgroundImage: COLOR_MAP[color] }
                    : { backgroundColor: COLOR_MAP[color] }
                }
              />
              {t(`collection.colors.${color}`, { defaultValue: color })}
            </button>
          ))}
        </div>
      )}

      {leagues.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          <button onClick={() => onChange({ league: null })} className={chip(!state.league)}>
            {t("leagues.all")}
          </button>
          {leagues.map((l) => (
            <button
              key={l}
              onClick={() => onChange({ league: state.league === l ? null : l })}
              className={chip(state.league === l)}
            >
              {l}
            </button>
          ))}
        </div>
      )}

      {countries.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          <button onClick={() => onChange({ country: null })} className={chip(!state.country)}>
            {t("filters.allCountries", { defaultValue: "Alle landen" })}
          </button>
          {countries.map((c) => (
            <button
              key={c}
              onClick={() => onChange({ country: state.country === c ? null : c })}
              className={chip(state.country === c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-1 mb-4">
        <button
          onClick={() => onChange({ letter: null })}
          className={`w-7 h-7 rounded text-[10px] font-semibold transition-all ${
            !state.letter ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("leagues.all")}
        </button>
        {ALPHABET.map((letter) => (
          <button
            key={letter}
            onClick={() => onChange({ letter: state.letter === letter ? null : letter })}
            className={`w-7 h-7 rounded text-[10px] font-semibold transition-all ${
              state.letter === letter
                ? "bg-primary text-primary-foreground"
                : "bg-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      <SortDecadeBar
        sort={state.sort}
        onSortChange={(sort) => onChange({ sort })}
        decade={state.decade}
        onDecadeChange={(decade) => onChange({ decade })}
      />
    </div>
  );
};

export default ProductFilters;
