import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ChevronDown, Heart, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "@/context/CartContext";
import shirt1 from "@/assets/shirt-new-1.png";
import shirt2 from "@/assets/shirt-new-2.png";
import shirt3 from "@/assets/shirt-new-3.png";
import shirt4 from "@/assets/shirt-new-4.png";
import shirt5 from "@/assets/shirt-new-5.png";
import shirt6 from "@/assets/shirt-new-6.png";
import shirt7 from "@/assets/shirt-new-7.png";

// Extra product images sourced from Unsplash (free stock) — back/detail/lifestyle views
const EXTRA = {
  ajax: ["https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80", "https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?w=800&q=80"],
  italy: ["https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800&q=80", "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80"],
  napoli: ["https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80", "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80"],
  portugal: ["https://images.unsplash.com/photo-1551854838-212c50b4c184?w=800&q=80", "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&q=80"],
  italyTraining: ["https://images.unsplash.com/photo-1571736772567-8e3ec1a45ddc?w=800&q=80", "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80"],
  barca: ["https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80", "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80"],
  marseille: ["https://images.unsplash.com/photo-1580087632545-cd0d9d671b1d?w=800&q=80", "https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800&q=80"],
};

// Color rules per user request:
// - blauw: napoli, marseille, italy x versace, italy training (italy shirts moved from blauw -> wit too)
// - wit: italy x versace, italy training, portugal
// - rood: marseille (only) — ajax/portugal/barca removed
// - geel (was goud): empty
// - groen: empty (portugal removed)
// - oranje: empty (napoli removed)
// - meerkleurig: barcelona
// - zwart: ajax (napoli & marseille removed)
export const allProducts = [
  { image: shirt1, gallery: [shirt1, ...EXTRA.ajax], name: "Ajax x Stone Island", nameKey: "ajaxStoneIsland", team: "Ajax", leagues: ["Eredivisie"], price: "€30", description: "Exclusieve samenwerking tussen Ajax en Stone Island. Premium kwaliteit met uniek design.", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["zwart"] },
  { image: shirt2, gallery: [shirt2, ...EXTRA.italy], name: "Italy x Versace", nameKey: "italyVersace", team: "Italië", leagues: ["Nationaal", "Special"], price: "€30", description: "Luxe Italiaans design met Versace-elementen. Een stijlvol eerbetoon aan het Italiaanse voetbal.", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["blauw", "wit"] },
  { image: shirt3, gallery: [shirt3, ...EXTRA.napoli], name: "SSC Napoli EA7 2025/26 Halloween Kit", nameKey: "napoliHalloween", team: "SSC Napoli", leagues: ["Serie A"], price: "€30", description: "Het exclusieve Halloween kit van SSC Napoli in samenwerking met EA7.", sizes: ["S", "M", "L", "XL", "2XL", "3XL"], colors: ["blauw"] },
  { image: shirt4, gallery: [shirt4, ...EXTRA.portugal], name: "Portugal x Louis Vuitton", nameKey: "portugalLV", team: "Portugal", leagues: ["Nationaal"], price: "€30", description: "Luxe Portugal editie geïnspireerd door Louis Vuitton. Uniek design met Portugese flair.", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["wit"] },
  { image: shirt5, gallery: [shirt5, ...EXTRA.italyTraining], name: "Italië Special Trainingsshirt", nameKey: "italyTraining", team: "Italië", leagues: ["Nationaal", "Special"], price: "€30", description: "Exclusief Italiaans trainingsshirt met uniek design. Een must-have voor elke voetballiefhebber.", sizes: ["S", "M", "L", "XL", "2XL", "3XL"], colors: ["blauw", "wit"] },
  { image: shirt6, gallery: [shirt6, ...EXTRA.barca], name: "Barcelona Special Flower Design", nameKey: "barcaFlower", team: "FC Barcelona", leagues: ["La Liga", "Special"], price: "€30", description: "Unieke Barcelona editie met bloemenpatroon en premium afwerking.", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["meerkleurig"] },
  { image: shirt7, gallery: [shirt7, ...EXTRA.marseille], name: "Marseille Third", nameKey: "marseilleThird", team: "Olympique Marseille", leagues: ["Ligue 1"], price: "€30", description: "Het stijlvolle third shirt van Olympique Marseille. Frans design op zijn best.", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["blauw", "rood"] },
];

interface ProductDetailModalProps {
  productName: string | null;
  onClose: () => void;
}

const ProductDetailModal = ({ productName, onClose }: ProductDetailModalProps) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [customize, setCustomize] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");
  const { favorites, toggleFavorite, addItem } = useCart();
  const { t } = useTranslation();

  const selected = productName ? allProducts.find(p => p.name === productName) : null;
  const displayName = selected ? t(`products.${selected.nameKey}`, { defaultValue: selected.name }) : "";

  useEffect(() => {
    setActiveImage(0);
    setSelectedSize(null);
    setQuantity(1);
    setCustomize(false);
    setCustomName("");
    setCustomNumber("");
  }, [productName]);

  const unitPrice = customize ? 37 : 30;

  const handleAddToCart = () => {
    if (!selected || !selectedSize) return;
    const suffix = customize && (customName || customNumber)
      ? ` [${customName || "—"}${customNumber ? ` #${customNumber}` : ""}]`
      : "";
    addItem({
      name: selected.name + suffix,
      image: selected.image,
      size: selectedSize,
      quantity,
      price: unitPrice,
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
              <p className="font-display text-3xl font-bold text-gradient-gold mb-8">€{unitPrice}</p>

              <div className="mb-6">
                <p className="text-sm font-semibold mb-3">{t("product.size")}</p>
                <div className="flex flex-wrap gap-2">
                  {selected.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] h-10 px-3 rounded border text-sm font-medium transition-all ${
                        selectedSize === size ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customization: name + number = €37 */}
              <div className="mb-6 border border-border rounded p-4">
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input type="checkbox" checked={customize} onChange={(e) => setCustomize(e.target.checked)} className="accent-primary h-4 w-4" />
                  <span className="text-sm font-semibold">{t("product.customize")}</span>
                  <span className="text-xs text-primary ml-auto">+€7</span>
                </label>
                {customize && (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      maxLength={20}
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                      placeholder={t("product.namePlaceholder")}
                      className="px-3 py-2 rounded border border-border bg-background text-sm focus:outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      maxLength={2}
                      value={customNumber}
                      onChange={(e) => setCustomNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder={t("product.numberPlaceholder")}
                      className="px-3 py-2 rounded border border-border bg-background text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                )}
              </div>

              <div className="mb-8">
                <p className="text-sm font-semibold mb-3">{t("product.quantity")}</p>
                <div className="flex items-center border border-border rounded w-fit">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-muted transition-colors"><Minus className="h-4 w-4" /></button>
                  <span className="px-5 text-sm font-medium min-w-[40px] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-muted transition-colors"><Plus className="h-4 w-4" /></button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded font-semibold text-sm tracking-wide uppercase transition-all duration-300 mb-6 ${
                  selectedSize ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-gold)]" : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                {selectedSize ? t("product.addToCart") : t("product.pickSize")}
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

