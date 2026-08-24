import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DECADES, SortKey } from "@/lib/productMeta";
import {
  FilterState,
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

const SORT_OPTIONS: SortKey[] = ["newest", "oldest", "az", "za", "photos", "priceAsc", "priceDesc"];

/** Uitklapbaar filterblok: klik op de naam om de opties te tonen. */
const Group = ({
  label,
  value,
  children,
}: {
  label: string;
  value?: string | null;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/40 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 py-3 text-left"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">{label}</span>
        <span className="flex items-center gap-2">
          {value ? <span className="text-[10px] text-primary">{value}</span> : null}
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </button>
      {open && <div className="flex flex-wrap items-center gap-2 pb-4">{children}</div>}
    </div>
  );
};

const ProductFilters = ({ items, state, onChange }: Props) => {
  const { t } = useTranslation();

  const leagues = collectLeagues(items);
  const countries = collectCountries(items);

  return (
    <div className="rounded-xl border border-border/50 bg-card/40 p-3 text-left">
      <div className="mb-1 flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-primary" />
        <h2 className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-primary">
          {t("filters.title", { defaultValue: "Filters" })}
        </h2>
      </div>


      {leagues.length > 0 && (
        <Group label={t("filters.league", { defaultValue: "Competitie" })} value={state.league}>
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
        </Group>
      )}

      {countries.length > 0 && (
        <Group label={t("filters.country", { defaultValue: "Land" })} value={state.country}>
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
        </Group>
      )}

      <Group label={t("filters.letter", { defaultValue: "Letter" })} value={state.letter}>
        <button
          onClick={() => onChange({ letter: null })}
          className={`h-7 w-7 rounded text-[10px] font-semibold transition-all ${
            !state.letter ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("leagues.all")}
        </button>
        {ALPHABET.map((letter) => (
          <button
            key={letter}
            onClick={() => onChange({ letter: state.letter === letter ? null : letter })}
            className={`h-7 w-7 rounded text-[10px] font-semibold transition-all ${
              state.letter === letter ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {letter}
          </button>
        ))}
      </Group>

      <Group label={t("filters.decade", { defaultValue: "Jaren" })} value={state.decade}>
        <button onClick={() => onChange({ decade: null })} className={chip(!state.decade)}>
          {t("filters.allDecades", { defaultValue: "Alle jaren" })}
        </button>
        {DECADES.map((d) => (
          <button
            key={d}
            onClick={() => onChange({ decade: state.decade === d ? null : d })}
            className={chip(state.decade === d)}
          >
            {d}
          </button>
        ))}
      </Group>

      <Group
        label={t("filters.sortLabel", { defaultValue: "Sorteer" })}
        value={t(`filters.sort.${state.sort}`, { defaultValue: state.sort })}
      >
        {SORT_OPTIONS.map((opt) => (
          <button key={opt} onClick={() => onChange({ sort: opt })} className={chip(state.sort === opt)}>
            {t(`filters.sort.${opt}`, { defaultValue: opt })}
          </button>
        ))}
      </Group>
    </div>
  );
};

export default ProductFilters;
