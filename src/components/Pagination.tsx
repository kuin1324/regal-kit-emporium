import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const Pagination = ({ page, totalPages, onChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  const go = (p: number) => {
    onChange(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
      <button
        onClick={() => go(Math.max(1, page - 1))}
        disabled={page === 1}
        className="p-2 rounded border border-border hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        aria-label="Vorige"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-2 text-muted-foreground">…</span>
        ) : (
          <button
            key={p}
            onClick={() => go(p)}
            className={`min-w-[2.25rem] h-9 px-3 rounded border text-sm font-medium transition ${
              p === page
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:border-primary/50"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => go(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="p-2 rounded border border-border hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        aria-label="Volgende"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Pagination;
