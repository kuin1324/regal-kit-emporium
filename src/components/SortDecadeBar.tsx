import { useTranslation } from "react-i18next";
import { DECADES, SortKey } from "@/lib/productMeta";

interface Props {
  sort: SortKey;
  onSortChange: (s: SortKey) => void;
  decade: string | null;
  onDecadeChange: (d: string | null) => void;
}

const SORT_OPTIONS: { value: SortKey; key: string }[] = [
  { value: "newest", key: "newest" },
  { value: "oldest", key: "oldest" },
  { value: "az", key: "az" },
  { value: "priceAsc", key: "priceAsc" },
  { value: "priceDesc", key: "priceDesc" },
];

const SortDecadeBar = ({ sort, onSortChange, decade, onDecadeChange }: Props) => {
  const { t } = useTranslation();
  return (
    <div className="mb-6 flex flex-col gap-3 items-center">
      <div className="flex items-center gap-2">
        <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {t("filters.sortLabel", { defaultValue: "Sorteer" })}
        </label>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          className="bg-card border border-border/50 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-primary/50"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(`filters.sort.${opt.key}`, {
                defaultValue: opt.key,
              })}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => onDecadeChange(null)}
          className={`px-3 py-1 rounded-full text-[11px] font-medium border transition ${
            !decade
              ? "bg-primary/20 text-primary border-primary/40"
              : "bg-transparent text-muted-foreground border-border/30 hover:border-primary/20"
          }`}
        >
          {t("filters.allDecades", { defaultValue: "Alle jaren" })}
        </button>
        {DECADES.map((d) => (
          <button
            key={d}
            onClick={() => onDecadeChange(decade === d ? null : d)}
            className={`px-3 py-1 rounded-full text-[11px] font-medium border transition ${
              decade === d
                ? "bg-primary/20 text-primary border-primary/40"
                : "bg-transparent text-muted-foreground border-border/30 hover:border-primary/20"
            }`}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SortDecadeBar;
