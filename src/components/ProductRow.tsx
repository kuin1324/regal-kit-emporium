import { useRef, useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "@/context/CartContext";
import { useProductName } from "@/lib/productName";

export interface RowProduct {
  name: string;
  team: string;
  price: string;
  image: string;
}

interface ProductRowProps {
  title: string;
  products: RowProduct[];
  seeAllHref?: string;
  onProductClick?: (name: string) => void;
}

const ProductRow = ({ title, products, seeAllHref, onProductClick }: ProductRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const [added, setAdded] = useState<string | null>(null);
  const { t } = useTranslation();
  const productName = useProductName();

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  const handleAdd = (e: React.MouseEvent, p: RowProduct) => {
    e.stopPropagation();
    addItem({ name: p.name, image: p.image, size: "M", quantity: 1, price: 30 });
    setAdded(p.name);
    setTimeout(() => setAdded((cur) => (cur === p.name ? null : cur)), 1200);
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-6">
        <div className="flex items-end justify-between mb-5">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
          <div className="flex items-center gap-2">
            {seeAllHref && (
              <Link to={seeAllHref} className="text-xs font-medium text-primary underline-offset-4 hover:underline mr-2">
                {t("home.seeAll")}
              </Link>
            )}
            <button
              onClick={() => scroll("left")}
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-border/60 hover:border-primary/40 hover:text-primary transition-colors"
              aria-label={t("home.prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-border/60 hover:border-primary/40 hover:text-primary transition-colors"
              aria-label={t("home.next")}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-6 px-6 pb-2">
          {products.map((p) => (
            <div
              key={p.name}
              onClick={() => onProductClick?.(p.name)}
              className="group relative shrink-0 w-[60%] sm:w-[280px] snap-start cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg bg-card border border-border/50 transition-all duration-300 group-hover:border-primary/40">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={p.image} alt={productName(p.name)} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <button
                  onClick={(e) => handleAdd(e, p)}
                  className="absolute top-3 right-3 h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[var(--shadow-gold)] hover:scale-110 transition-transform"
                  aria-label={t("home.addToCart")}
                >
                  {added === p.name ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </button>
              </div>
              <div className="pt-3 px-1">
                <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-1">{p.team}</p>
                <h3 className="font-display text-sm font-semibold tracking-wide line-clamp-2">{productName(p.name)}</h3>
                <p className="font-display text-base font-bold text-gradient-gold mt-1">{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductRow;
