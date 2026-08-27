import { useTranslation } from "react-i18next";
import { COLOR_MAP, collectColors, FilterProduct } from "@/lib/productFilters";

interface Props {
  items: FilterProduct[];
  selected: string[];
  onChange: (colors: string[]) => void;
}

/** Altijd zichtbare kleurbalk: zoeken op kleur op elk tabblad. */
const ColorFilterBar = ({ items, selected, onChange }: Props) => {
  const { t } = useTranslation();
  const colors = collectColors(items);
  if (colors.length === 0) return null;

  const toggle = (c: string) =>
    onChange(selected.includes(c) ? selected.filter((x) => x !== c) : [...selected, c]);

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {t("filters.color", { defaultValue: "Color" })}
      </span>
      <button
        type="button"
        onClick={() => onChange([])}
        className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-all ${
          selected.length === 0
            ? "border-primary/40 bg-primary/20 text-primary"
            : "border-border/30 text-muted-foreground hover:border-primary/20"
        }`}
      >
        {t("leagues.all", { defaultValue: "All" })}
      </button>
      {colors.map((c) => {
        const active = selected.includes(c);
        return (
          <button
            key={c}
            type="button"
            onClick={() => toggle(c)}
            title={c}
            aria-label={c}
            aria-pressed={active}
            className={`h-7 w-7 rounded-full border-2 transition-all ${
              active ? "border-primary scale-110" : "border-border/50 hover:border-primary/40"
            }`}
            style={{ background: COLOR_MAP[c] }}
          />
        );
      })}
    </div>
  );
};

export default ColorFilterBar;
