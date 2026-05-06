import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ChevronDown, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "@/context/CartContext";
import shirt4 from "@/assets/shirt-new-4.png";
import shirt5 from "@/assets/shirt-new-5.png";
import shirt7 from "@/assets/shirt-new-7.png";
import shirtGermany from "@/assets/shirt-germany.jpg";
import barcaGolfFront from "@/assets/shirt-barcelona-golf-front.jpg";
import barcaGolfBack from "@/assets/shirt-barcelona-golf-back.jpg";
import italyVersaceFront from "@/assets/shirt-italy-versace-front.jpg";
import italyVersaceBack from "@/assets/shirt-italy-versace-back.jpg";
import spainAdidasFront from "@/assets/shirt-spain-adidas-front.jpg";
import spainAdidasBack from "@/assets/shirt-spain-adidas-back.jpg";
import napoliFront from "@/assets/shirt-napoli-front.jpg";
import napoliBack from "@/assets/shirt-napoli-back.jpg";
import stoneIslandAjaxFront from "@/assets/shirt-stone-island-ajax-front.jpg";
import stoneIslandAjaxBack from "@/assets/shirt-stone-island-ajax-back.jpg";

export const allProducts = [
  { image: shirt4, gallery: [shirt4], name: "Portugal x Louis Vuitton", nameKey: "portugalLV", team: "Portugal", leagues: ["Nationaal"], price: "€30", description: "Luxe Portugal editie geïnspireerd door Louis Vuitton. Uniek design met Portugese flair.", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["wit"] },
  { image: shirt5, gallery: [shirt5], name: "Italië Special Trainingsshirt", nameKey: "italyTraining", team: "Italië", leagues: ["Nationaal", "Special"], price: "€30", description: "Exclusief Italiaans trainingsshirt met uniek design. Een must-have voor elke voetballiefhebber.", sizes: ["S", "M", "L", "XL", "2XL", "3XL"], colors: ["wit"] },
  { image: shirt7, gallery: [shirt7], name: "Marseille Third", nameKey: "marseilleThird", team: "Olympique Marseille", leagues: ["Ligue 1"], price: "€30", description: "Het stijlvolle third shirt van Olympique Marseille. Frans design op zijn best.", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["blauw"] },
  { image: shirtGermany, gallery: [shirtGermany], name: "Duitsland x Adidas Originals", nameKey: "germanyAdidas", team: "Duitsland", leagues: ["Nationaal", "Special"], price: "€30", description: "Stijlvol Duitsland shirt in samenwerking met Adidas Originals. Donkerblauw met mintgroene accenten en subtiel patroon.", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["blauw"] },
  { image: barcaGolfFront, gallery: [barcaGolfFront, barcaGolfBack], name: "Barcelona x Tyler The Creator Golf", nameKey: "barcaGolf", team: "FC Barcelona", leagues: ["La Liga", "Special"], price: "€30", description: "Unieke Barcelona x Golf le Fleur editie met bloemen en sterren. Speels en kleurrijk design.", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["wit", "roze"] },
  { image: italyVersaceFront, gallery: [italyVersaceFront, italyVersaceBack], name: "Italië x Versace", nameKey: "italyVersace", team: "Italië", leagues: ["Nationaal", "Special"], price: "€30", description: "Luxe Italië shirt geïnspireerd door Versace barok print. Goud en zwart op wit.", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["wit", "goud"] },
  { image: spainAdidasFront, gallery: [spainAdidasFront, spainAdidasBack], name: "Spanje x Adidas Special", nameKey: "spainAdidas", team: "Spanje", leagues: ["Nationaal", "Special"], price: "€30", description: "Spanje special edition van Adidas met pastel roze en blauwe gradient. Uniek artistiek design.", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["roze", "blauw"] },
  { image: napoliFront, gallery: [napoliFront, napoliBack], name: "Napoli Third EA7", nameKey: "napoliThird", team: "SSC Napoli", leagues: ["Serie A"], price: "€30", description: "Napoli third shirt met EA7 en MSC sponsoring. Donkerblauw met oranje accenten.", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["blauw", "oranje"] },
  { image: stoneIslandAjaxFront, gallery: [stoneIslandAjaxFront, stoneIslandAjaxBack], name: "Ajax x Stone Island", nameKey: "ajaxStoneIsland", team: "Ajax", leagues: ["Eredivisie", "Special"], price: "€30", description: "Exclusieve Ajax x Stone Island samenwerking. Volledig zwart met subtiel camo patroon.", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["zwart"] },
];

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

  const selected = productName ? allProducts.find(p => p.name === productName) : null;
  const displayName = selected ? t(`products.${selected.nameKey}`, { defaultValue: selected.name }) : "";

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

  const totalPrice = variants.reduce((sum, v) => sum + (v.customize ? 37 : 30) * v.quantity, 0);
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
        quantity: v.quantity,
        price: v.customize ? 37 : 30,
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
            <button onClick={() => toggleFavorite(selected.name)} className="p-3 rounded-full bg-card border border-border hover:bg-muted transition-colors" aria-label="favorite">
              <Heart className={`h-5 w-5 ${favorites.has(selected.name) ? "fill-red-500 text-red-500" : "text-foreground"}`} />
            </button>
            <button onClick={onClose} className="p-3 rounded-full bg-card border border-border hover:bg-muted transition-colors" aria-label="close">
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
                    aria-label={`view ${idx + 1}`}
                  >
                    <img src={img} alt={`${displayName} ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
              )}

              <div className="order-1 md:order-1 flex-1 flex items-center justify-center min-h-[60vh] md:min-h-0">
                <div className="relative w-full h-full max-h-[85vh] aspect-[4/5] md:aspect-auto overflow-hidden rounded select-none">
                  <motion.img
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    src={gallery[activeImage]}
                    alt={displayName}
                    draggable={false}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12 flex flex-col justify-center max-w-lg mx-auto w-full">
              <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-primary mb-1">{selected.team}</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-wide mb-2">{displayName}</h2>
              <p className="font-display text-3xl font-bold text-gradient-gold mb-8">€{totalPrice}</p>

              <div className="space-y-6 mb-6">
                {variants.map((v, idx) => (
                  <div key={v.id} className="border border-border rounded p-4 space-y-4 relative">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold tracking-wide uppercase text-primary">Shirt {idx + 1}</p>
                      {variants.length > 1 && (
                        <button onClick={() => removeVariant(v.id)} className="p-1 hover:bg-destructive/20 rounded" aria-label="remove">
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
                        <span className="text-xs text-primary ml-auto">+€7</span>
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
                + Nog een shirt toevoegen
              </button>

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

