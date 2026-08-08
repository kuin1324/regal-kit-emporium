import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Search, ShoppingBag, SlidersHorizontal, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useProductName } from "@/lib/productName";
import Pagination from "@/components/Pagination";
import ProductFilters from "@/components/ProductFilters";
import { applyFilters, initialFilterState, FilterState } from "@/lib/productFilters";

const PAGE_SIZE = 60;

interface Product {
  name: string;
  nameKey?: string;
  team: string;
  price: string;
  image: string;
  leagues: string[];
  colors?: string[];
  sku?: string;
}

interface Props {
  items: Product[];
  onSelect: (name: string) => void;
}

interface Band {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const CollectionView = ({ items, onSelect }: Props) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    ...initialFilterState,
    q: searchParams.get("q") || "",
    league: searchParams.get("league") || null,
  });
  const [page, setPage] = useState(1);
  const { favorites, toggleFavorite, addItem } = useCart();
  const { formatPrice } = useCurrency();
  const productName = useProductName();
  const touchX = useRef<number | null>(null);

  // Meervoudige selectie (ctrl-klik + sleepkader zoals in de verkenner)
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [band, setBand] = useState<Band | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const dragStart = useRef<{ x: number; y: number; add: boolean } | null>(null);
  const dragged = useRef(false);

  useEffect(() => {
    setFilters((f) => ({
      ...f,
      q: searchParams.get("q") || "",
      league: searchParams.get("league") || null,
    }));
  }, [searchParams]);

  const filtered = useMemo(() => applyFilters(items, filters), [items, filters]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const goPage = (p: number) => {
    setPage(Math.min(totalPages, Math.max(1, p)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleSelect = (name: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });

  const selectedProducts = useMemo(
    () => filtered.filter((p) => selected.has(p.name)),
    [filtered, selected]
  );

  const bulkFavorite = () => {
    selectedProducts.forEach((p) => {
      if (!favorites.has(p.name)) toggleFavorite(p.name);
    });
    setSelected(new Set());
  };

  const bulkCart = () => {
    selectedProducts.forEach((p) => {
      addItem({
        name: p.name,
        image: p.image,
        size: "M",
        quantity: 1,
        price: parseInt(p.price.replace(/[^\d]/g, ""), 10) || 30,
        sku: p.sku,
      });
    });
    setSelected(new Set());
  };

  // --- Sleepkader ---
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    dragStart.current = { x: e.clientX, y: e.clientY, add: e.ctrlKey || e.metaKey || e.shiftKey };
    dragged.current = false;
  };

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const start = dragStart.current;
      if (!start) return;
      if (!dragged.current && Math.hypot(e.clientX - start.x, e.clientY - start.y) < 8) return;
      dragged.current = true;
      const rect: Band = { x1: start.x, y1: start.y, x2: e.clientX, y2: e.clientY };
      setBand(rect);
      const left = Math.min(rect.x1, rect.x2);
      const right = Math.max(rect.x1, rect.x2);
      const top = Math.min(rect.y1, rect.y2);
      const bottom = Math.max(rect.y1, rect.y2);
      const hit = new Set<string>();
      cardRefs.current.forEach((el, name) => {
        const b = el.getBoundingClientRect();
        if (b.right >= left && b.left <= right && b.bottom >= top && b.top <= bottom) hit.add(name);
      });
      setSelected((prev) => (start.add ? new Set([...prev, ...hit]) : hit));
    };
    const up = () => {
      dragStart.current = null;
      setBand(null);
      setTimeout(() => (dragged.current = false), 0);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  return (
    <div className="relative">
      {/* Bovenbalk: zoeken + filterknop, zodat de shirts volle breedte houden */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => setShowFilters((s) => !s)}
          className="flex items-center gap-2 rounded-xl border border-border/50 bg-card/60 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary transition-colors hover:border-primary/40 sm:w-48 sm:shrink-0"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {t("filters.title", { defaultValue: "Filters" })}
          {showFilters ? <X className="ml-auto h-4 w-4 text-muted-foreground" /> : null}
        </button>
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={filters.q}
            onFocus={() => setShowFilters(true)}
            onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
            placeholder={t("search.placeholderShort")}
            className="w-full rounded-xl border border-border/50 bg-card py-3 pl-11 pr-4 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {showFilters && (
          <aside className="lg:w-64 lg:shrink-0">
            <ProductFilters
              items={items}
              state={filters}
              onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
            />
          </aside>
        )}

        <div className="min-w-0 flex-1">
          <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} className="mb-6 mt-0" />

          <div
            ref={gridRef}
            onMouseDown={onMouseDown}
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) > 70) goPage(currentPage + (dx < 0 ? 1 : -1));
            }}
            className="grid select-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {pageItems.map((product, i) => (
              <motion.div
                key={product.name + i}
                ref={(el) => {
                  if (el) cardRefs.current.set(product.name, el);
                  else cardRefs.current.delete(product.name);
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.03 }}
                viewport={{ once: true }}
                className="group relative cursor-pointer"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.name);
                  }}
                  className="absolute right-3 top-3 z-10 rounded-full bg-background/70 p-2 backdrop-blur-sm transition-colors hover:bg-background/90"
                  aria-label="favorite"
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      favorites.has(product.name) ? "fill-red-500 text-red-500" : "text-foreground"
                    }`}
                  />
                </button>
                <div
                  onClick={(e) => {
                    if (dragged.current) return;
                    if (e.ctrlKey || e.metaKey || e.shiftKey) {
                      toggleSelect(product.name);
                      return;
                    }
                    if (selected.size > 0) {
                      toggleSelect(product.name);
                      return;
                    }
                    onSelect(product.name);
                  }}
                  className={`relative overflow-hidden rounded border bg-card transition-all duration-500 group-hover:shadow-[var(--shadow-gold)] ${
                    selected.has(product.name)
                      ? "border-primary ring-2 ring-primary"
                      : "border-border/50 group-hover:border-primary/30"
                  }`}
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={product.image}
                      alt={productName(product.name)}
                      loading="lazy"
                      draggable={false}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent p-5 pt-12">
                    <h3 className="font-display text-base font-semibold tracking-wide">{productName(product.name)}</h3>
                    <p className="mb-2 text-xs text-muted-foreground">{product.team}</p>
                    <p className="font-display text-lg font-bold text-gradient-gold">{formatPrice(product.price)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length > 0 && (
            <>
              <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
              <p className="mt-4 text-center text-xs text-muted-foreground">
                {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} / {filtered.length}
              </p>
            </>
          )}

          {filtered.length === 0 && (
            <p className="mt-12 text-center text-muted-foreground">{t("collection.noResults")}</p>
          )}
        </div>
      </div>

      {/* Sleepkader */}
      {band && (
        <div
          className="pointer-events-none fixed z-50 rounded border-2 border-primary/70 bg-primary/10"
          style={{
            left: Math.min(band.x1, band.x2),
            top: Math.min(band.y1, band.y2),
            width: Math.abs(band.x2 - band.x1),
            height: Math.abs(band.y2 - band.y1),
          }}
        />
      )}

      {/* Actiebalk bij selectie */}
      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-border bg-card/95 px-5 py-3 shadow-lg backdrop-blur">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">
            {t("selection.count", { count: selected.size, defaultValue: "{{count}} geselecteerd" })}
          </span>
          <button
            onClick={bulkFavorite}
            className="flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-semibold transition-colors hover:border-primary"
          >
            <Heart className="h-4 w-4" />
            {t("selection.favorite", { defaultValue: "Favorieten" })}
          </button>
          <button
            onClick={bulkCart}
            className="flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <ShoppingBag className="h-4 w-4" />
            {t("selection.cart", { defaultValue: "In winkelmandje (M)" })}
          </button>
          <button onClick={() => setSelected(new Set())} aria-label="clear selection" className="p-1">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CollectionView;
