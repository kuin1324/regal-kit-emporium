import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumbs from "@/components/Breadcrumbs";
import { X, Minus, Plus, ChevronDown, Heart, ShoppingBag, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { collectieShirts } from "@/data/collectie_shirts";
import { publicCollectieShirts } from "@/data/public_collectie";

import ZoomableImage from "@/components/ZoomableImage";
import ShirtImage from "@/components/ShirtImage";
import { thumbSrc } from "@/lib/thumb";
import { useAdminView } from "@/lib/admin";
import { useProductName } from "@/lib/productName";
import { findProduct, mergeById, productIdentity } from "@/lib/productIdentity";

type AnyProduct = (typeof collectieShirts)[number] | (typeof publicCollectieShirts)[number];

export const allProducts: AnyProduct[] = mergeById<AnyProduct>(collectieShirts, publicCollectieShirts);



interface ProductDetailModalProps {
  productName: string | null;
  onClose: () => void;
}

interface Variant {
  id: string;
  size: string | null;
  quantity: number;
  customize: boolean;
  customName: string;
  customNumber: string;
}

export const CUSTOM_PRICE = 5;

const newVariant = (): Variant => ({
  id: crypto.randomUUID(),
  size: null,
  quantity: 1,
  customize: false,
  customName: "",
  customNumber: "",
});

const ProductDetailModal = ({ productName, onClose }: ProductDetailModalProps) => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [variants, setVariants] = useState<Variant[]>([newVariant()]);
  const { favorites, toggleFavorite, addItem } = useCart();
  const { t } = useTranslation();
  const { format } = useCurrency();
  const isAdmin = useAdminView();
  const translate = useProductName();

  // productName bevat de unieke id (SKU/fotopad); oude links met alleen de naam werken ook.
  const selected = findProduct(allProducts, productName) ?? null;

  const displayName = selected
    ? t(`products.${selected.nameKey}`, { defaultValue: translate(selected.name) })
    : "";

  useEffect(() => {
    setActiveImage(0);
    setVariants([newVariant()]);
  }, [productName]);

  const updateVariant = (id: string, patch: Partial<Variant>) => {
    setVariants(prev => prev.map(v => (v.id === id ? { ...v, ...patch } : v)));
  };
  const removeVariant = (id: string) => {
    setVariants(prev => (prev.length > 1 ? prev.filter(v => v.id !== id) : prev));
  };

  const basePrice = selected ? parseInt(selected.price.replace(/[^\d]/g, ""), 10) || 30 : 30;
  const totalPrice = variants.reduce((sum, v) => sum + (basePrice + (v.customize ? CUSTOM_PRICE : 0)) * v.quantity, 0);
  const allValid = variants.every(v => !!v.size);

  const handleAddToCart = () => {
    if (!selected || !allValid) return;
    variants.forEach(v => {
      const suffix = v.customize && (v.customName || v.customNumber)
        ? ` [${v.customName || "—"}${v.customNumber ? ` #${v.customNumber}` : ""}]`
        : "";
      addItem({
        name: selected.name + suffix,
        image: selected.image,
        size: v.size!,
        sku: (selected as { sku?: string }).sku,
        customName: v.customize ? v.customName : undefined,
        customNumber: v.customize ? v.customNumber : undefined,
        quantity: v.quantity,
        price: basePrice + (v.customize ? CUSTOM_PRICE : 0),
      });
    });
    onClose();
  };

  const gallery = selected?.gallery || (selected ? [selected.image] : []);

  return (
    <AnimatePresence>
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-background overflow-y-auto"
        >
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button onClick={() => toggleFavorite(favorites.has(selected.name) ? selected.name : productIdentity(selected))} className="p-3 rounded-full bg-card border border-border hover:bg-muted transition-colors" aria-label={t("product.favorite")}>
              <Heart className={`h-5 w-5 ${(favorites.has(selected.name) || favorites.has(productIdentity(selected))) ? "fill-red-500 text-red-500" : "text-foreground"}`} />
            </button>
            <button onClick={onClose} className="p-3 rounded-full bg-card border border-border hover:bg-muted transition-colors" aria-label={t("product.close")}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            <div className="bg-card flex flex-col md:flex-row p-4 gap-4 md:max-h-screen md:sticky md:top-0">
              {gallery.length > 1 && (
              <div className="order-2 md:order-2 flex md:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden md:max-h-[85vh] md:w-20 shrink-0 pb-2 md:pb-0 scrollbar-thin">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded overflow-hidden border-2 transition-all ${
                      activeImage === idx ? "border-primary shadow-[var(--shadow-gold)]" : "border-border hover:border-primary/50 opacity-70 hover:opacity-100"
                    }`}
                    aria-label={`${displayName} ${idx + 1}`}
                  >
                    <ShirtImage src={thumbSrc(img)} fallback={img} alt={`${displayName} ${idx + 1}`} loading="lazy" fetchPriority={activeImage === idx ? "high" : "low"} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              )}

              <div className="order-1 md:order-1 flex-1 flex flex-col items-center justify-center min-h-[60vh] md:min-h-0 gap-3">
                <div className="relative w-full h-full max-h-[85vh] aspect-[4/5] md:aspect-auto overflow-hidden rounded select-none">
                  <ZoomableImage
                    key={gallery[activeImage]}
                    src={gallery[activeImage]}
                    preview={thumbSrc(gallery[activeImage])}
                    fallback={(selected as { fallback?: string | null }).fallback}
                    alt={displayName}
                  />
                </div>
                {gallery.length > 1 && (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setActiveImage((activeImage - 1 + gallery.length) % gallery.length)}
                      className="p-2 rounded-full bg-card border border-border hover:bg-muted transition-colors"
                      aria-label={t("product.previous")}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="text-xs text-muted-foreground tabular-nums">{activeImage + 1} / {gallery.length}</span>
                    <button
                      onClick={() => setActiveImage((activeImage + 1) % gallery.length)}
                      className="p-2 rounded-full bg-card border border-border hover:bg-muted transition-colors"
                      aria-label={t("product.next")}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 md:p-12 flex flex-col justify-center max-w-lg mx-auto w-full">
              <Breadcrumbs current={displayName} />
              <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-primary mb-1">{selected.team}</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-wide mb-2">{displayName}</h2>
              {isAdmin && (selected as { sku?: string }).sku && (
                <p className="mb-2 font-mono text-xs text-muted-foreground">SKU: {(selected as { sku?: string }).sku}</p>
              )}
              <p className="font-display text-3xl font-bold text-gradient-gold mb-8">{format(totalPrice)}</p>

              <div className="space-y-6 mb-6">
                {variants.map((v, idx) => (
                  <div key={v.id} className="border border-border rounded p-4 space-y-4 relative">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold tracking-wide uppercase text-primary">{t("product.variant", { n: idx + 1 })}</p>
                      {variants.length > 1 && (
                        <button onClick={() => removeVariant(v.id)} className="p-1 hover:bg-destructive/20 rounded" aria-label={t("product.remove")}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold mb-3">{t("product.size")}</p>
                      <div className="flex flex-wrap gap-2">
                        {selected.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => updateVariant(v.id, { size })}
                            className={`min-w-[48px] h-10 px-3 rounded border text-sm font-medium transition-all ${
                              v.size === size ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-foreground border-border hover:border-primary/50"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 cursor-pointer mb-3">
                        <input type="checkbox" checked={v.customize} onChange={(e) => updateVariant(v.id, { customize: e.target.checked })} className="accent-primary h-4 w-4" />
                        <span className="text-sm font-semibold">{t("product.customize")}</span>
                        <span className="text-xs text-primary ml-auto">+{format(CUSTOM_PRICE)}</span>
                      </label>
                      {v.customize && (
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            maxLength={20}
                            value={v.customName}
                            onChange={(e) => updateVariant(v.id, { customName: e.target.value.toUpperCase() })}
                            placeholder={t("product.namePlaceholder")}
                            className="px-3 py-2 rounded border border-border bg-background text-sm focus:outline-none focus:border-primary"
                          />
                          <input
                            type="text"
                            maxLength={2}
                            value={v.customNumber}
                            onChange={(e) => updateVariant(v.id, { customNumber: e.target.value.replace(/\D/g, "") })}
                            placeholder={t("product.numberPlaceholder")}
                            className="px-3 py-2 rounded border border-border bg-background text-sm focus:outline-none focus:border-primary"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold mb-3">{t("product.quantity")}</p>
                      <div className="flex items-center border border-border rounded w-fit">
                        <button onClick={() => updateVariant(v.id, { quantity: Math.max(1, v.quantity - 1) })} className="p-2 hover:bg-muted transition-colors"><Minus className="h-4 w-4" /></button>
                        <span className="px-5 text-sm font-medium min-w-[40px] text-center">{v.quantity}</span>
                        <button onClick={() => updateVariant(v.id, { quantity: v.quantity + 1 })} className="p-2 hover:bg-muted transition-colors"><Plus className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setVariants(prev => [...prev, newVariant()])}
                className="w-full py-3 rounded border border-dashed border-primary/50 text-primary font-semibold text-sm tracking-wide uppercase hover:bg-primary/10 transition-colors mb-6"
              >
                {t("product.addAnother")}
              </button>

              <div className="mb-4 rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-xs font-semibold tracking-wide uppercase mb-2">{t("product.shippingRates")}</p>
                <ul className="text-xs space-y-1">
                  <li className="flex justify-between"><span className="text-muted-foreground">1–2 {t("product.shirtsLabel")}</span><span className="font-semibold">€5</span></li>
                  <li className="flex justify-between"><span className="text-muted-foreground">3–5 {t("product.shirtsLabel")}</span><span className="font-semibold">€3</span></li>
                  <li className="flex justify-between"><span className="text-muted-foreground">6+ {t("product.shirtsLabel")}</span><span className="font-semibold text-gradient-gold">{t("product.free")}</span></li>
                </ul>
              </div>


              <button
                onClick={handleAddToCart}
                disabled={!allValid}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded font-semibold text-sm tracking-wide uppercase transition-all duration-300 mb-6 ${
                  allValid ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-gold)]" : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                {allValid ? t("product.addToCart") : t("product.pickSize")}
              </button>


              <div className="border-t border-border">
                {[
                  { key: "description", label: t("product.description"), content: selected.description },
                  { key: "shipping", label: t("product.shipping"), content: t("product.shippingInfo") },
                  { key: "returns", label: t("product.returns"), content: t("product.returnsInfo") },
                ].map((item) => (
                  <div key={item.key} className="border-b border-border">
                    <button onClick={() => setOpenAccordion(openAccordion === item.key ? null : item.key)} className="w-full flex items-center justify-between py-4 text-sm font-semibold hover:text-primary transition-colors">
                      {item.label}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openAccordion === item.key ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {openAccordion === item.key && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <p className="text-sm text-muted-foreground pb-4">{item.content}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;

