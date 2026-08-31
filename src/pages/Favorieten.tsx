import { thumbSrc } from "@/lib/thumb";
import ShirtImage from "@/components/ShirtImage";
import { useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import PhotoNotice from "@/components/PhotoNotice";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCart } from "@/context/CartContext";
import { Heart, ShoppingBag, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import ProductDetailModal, { allProducts, CUSTOM_PRICE } from "@/components/ProductDetailModal";
import { useProductName } from "@/lib/productName";
import { productIdentity } from "@/lib/productIdentity";

interface Config {
  size: string;
  quantity: number;
  customize: boolean;
  customName: string;
  customNumber: string;
}

const defaultConfig: Config = { size: "M", quantity: 1, customize: false, customName: "", customNumber: "" };

const Favorieten = () => {
  const { favorites, toggleFavorite, addItem } = useCart();
  const { formatPrice, format } = useCurrency();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [configs, setConfigs] = useState<Record<string, Config>>({});
  const [added, setAdded] = useState(false);
  // Favorieten worden op unieke id (SKU/foto) bewaard; oude opslag op naam blijft werken.
  const favoriteProducts = allProducts.filter(
    (p) => favorites.has(productIdentity(p)) || favorites.has(p.name)
  );

  const { t } = useTranslation();
  const productName = useProductName();

  const cfg = (id: string) => configs[id] ?? defaultConfig;
  const setCfg = (id: string, patch: Partial<Config>) =>
    setConfigs((prev) => ({ ...prev, [id]: { ...(prev[id] ?? defaultConfig), ...patch } }));

  const orderAll = () => {
    favoriteProducts.forEach((p) => {
      const c = cfg(productIdentity(p));
      const suffix = c.customize && (c.customName || c.customNumber)
        ? ` [${c.customName || "—"}${c.customNumber ? ` #${c.customNumber}` : ""}]`
        : "";
      addItem({
        name: p.name + suffix,
        image: p.image,
        size: c.size,
        sku: (p as { sku?: string }).sku,
        quantity: c.quantity,
        price: (parseInt(p.price.replace(/[^\d]/g, ""), 10) || 30) + (c.customize ? CUSTOM_PRICE : 0),
        customName: c.customize ? c.customName : undefined,
        customNumber: c.customize ? c.customNumber : undefined,
      });
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-6">
          <PhotoNotice />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-primary mb-3">❤️</p>
            <Breadcrumbs />
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">{t("favorites.title")}</h1>
          </motion.div>

          {favoriteProducts.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground mb-4">{t("favorites.empty")}</p>
              <Link to="/collectie" className="text-primary text-sm hover:underline">{t("favorites.browse")}</Link>
            </div>
          ) : (
            <>
              <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">
                  Adjust size, quantity and personalisation below, then order all favourites in one go.
                </p>
                <button
                  onClick={orderAll}
                  className="flex items-center justify-center gap-2 rounded bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {added ? "Added to cart" : `Order all (${favoriteProducts.length})`}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProducts.map((product, i) => {
                  const id = productIdentity(product);
                  const c = cfg(id);
                  return (
                    <motion.div key={id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="group relative">
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(favorites.has(product.name) ? product.name : id); }} className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/70 backdrop-blur-sm">
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </button>
                      <div onClick={() => setSelectedProduct(id)} className="cursor-pointer">
                        <div className="relative overflow-hidden rounded-t bg-card border border-border/50 transition-all duration-500 group-hover:border-primary/30">
                          <div className="aspect-[4/5] overflow-hidden">
                            <ShirtImage src={thumbSrc(product.image)} fallback={product.image} alt={productName(product.name)} width={420} height={525} loading="lazy" className="h-full w-full object-cover" />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent p-5 pt-12">
                            <h3 className="font-display text-base font-semibold">{productName(product.name)}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{product.team}</p>
                            <p className="font-display text-lg font-bold text-gradient-gold">{formatPrice(product.price)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 rounded-b border border-t-0 border-border/50 bg-card p-4">
                        <div className="flex flex-wrap gap-2">
                          {product.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => setCfg(id, { size })}
                              className={`h-8 min-w-[40px] rounded border px-2 text-xs font-medium transition-all ${
                                c.size === size ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:border-primary/50"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center rounded border border-border">
                            <button onClick={() => setCfg(id, { quantity: Math.max(1, c.quantity - 1) })} className="p-2 hover:bg-muted"><Minus className="h-3 w-3" /></button>
                            <span className="min-w-[32px] text-center text-sm tabular-nums">{c.quantity}</span>
                            <button onClick={() => setCfg(id, { quantity: c.quantity + 1 })} className="p-2 hover:bg-muted"><Plus className="h-3 w-3" /></button>
                          </div>
                          <label className="flex items-center gap-2 text-xs cursor-pointer">
                            <input type="checkbox" checked={c.customize} onChange={(e) => setCfg(id, { customize: e.target.checked })} className="accent-primary h-4 w-4" />
                            {t("product.customize")} <span className="text-primary">+{format(CUSTOM_PRICE)}</span>
                          </label>
                        </div>

                        {c.customize && (
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              maxLength={20}
                              value={c.customName}
                              onChange={(e) => setCfg(id, { customName: e.target.value.toUpperCase() })}
                              placeholder={t("product.namePlaceholder")}
                              className="rounded border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                            />
                            <input
                              type="text"
                              maxLength={2}
                              value={c.customNumber}
                              onChange={(e) => setCfg(id, { customNumber: e.target.value.replace(/\D/g, "") })}
                              placeholder={t("product.numberPlaceholder")}
                              className="rounded border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />
      <ProductDetailModal productName={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default Favorieten;
