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
import shirt1Back from "@/assets/shirt-1-back.jpg";
import shirt1Detail from "@/assets/shirt-1-detail.jpg";
import shirt2Back from "@/assets/shirt-2-back.jpg";
import shirt2Detail from "@/assets/shirt-2-detail.jpg";
import shirt3Back from "@/assets/shirt-3-back.jpg";
import shirt3Detail from "@/assets/shirt-3-detail.jpg";
import shirt4Back from "@/assets/shirt-4-back.jpg";
import shirt4Detail from "@/assets/shirt-4-detail.jpg";
import shirt5Back from "@/assets/shirt-5-back.jpg";
import shirt5Detail from "@/assets/shirt-5-detail.jpg";
import shirt6Back from "@/assets/shirt-6-back.jpg";
import shirt6Detail from "@/assets/shirt-6-detail.jpg";
import shirt7Back from "@/assets/shirt-7-back.jpg";
import shirt7Detail from "@/assets/shirt-7-detail.jpg";

export const allProducts = [
  { image: shirt1, gallery: [shirt1, shirt1Back, shirt1Detail], name: "Stone Island x Ajax", team: "Ajax", leagues: ["Eredivisie"], price: "€30", description: "Exclusieve samenwerking tussen Stone Island en Ajax. Premium kwaliteit met uniek design.", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["zwart", "rood"] },
  { image: shirt2, gallery: [shirt2, shirt2Back, shirt2Detail], name: "Italy x Versace", team: "Italië", leagues: ["Nationaal", "Special"], price: "€30", description: "Luxe Italiaans design met Versace-elementen. Een stijlvol eerbetoon aan het Italiaanse voetbal.", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["blauw", "goud"] },
  { image: shirt3, gallery: [shirt3, shirt3Back, shirt3Detail], name: "SSC Napoli EA7 2025/26 Halloween Kit", team: "SSC Napoli", leagues: ["Serie A"], price: "€30", description: "Het exclusieve Halloween kit van SSC Napoli in samenwerking met EA7.", sizes: ["S", "M", "L", "XL", "2XL", "3XL"], colors: ["zwart", "oranje"] },
  { image: shirt4, gallery: [shirt4, shirt4Back, shirt4Detail], name: "Portugal x Louis Vuitton", team: "Portugal", leagues: ["Nationaal"], price: "€30", description: "Luxe Portugal editie geïnspireerd door Louis Vuitton. Uniek design met Portugese flair.", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["rood", "groen", "goud"] },
  { image: shirt5, gallery: [shirt5, shirt5Back, shirt5Detail], name: "Italië Special Trainingsshirt", team: "Italië", leagues: ["Nationaal", "Special"], price: "€30", description: "Exclusief Italiaans trainingsshirt met uniek design. Een must-have voor elke voetballiefhebber.", sizes: ["S", "M", "L", "XL", "2XL", "3XL"], colors: ["blauw", "wit"] },
  { image: shirt6, gallery: [shirt6, shirt6Back, shirt6Detail], name: "Barcelona Special Flower Design", team: "FC Barcelona", leagues: ["La Liga", "Special"], price: "€30", description: "Unieke Barcelona editie met bloemenpatroon en premium afwerking.", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["rood", "blauw", "goud"] },
  { image: shirt7, gallery: [shirt7, shirt7Back, shirt7Detail], name: "Marseille Third", team: "Olympique Marseille", leagues: ["Ligue 1"], price: "€30", description: "Het stijlvolle third shirt van Olympique Marseille. Frans design op zijn best.", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["zwart", "blauw"] },
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
  const { favorites, toggleFavorite, addItem } = useCart();
  const { t } = useTranslation();

  const selected = productName ? allProducts.find(p => p.name === productName) : null;

  useEffect(() => {
    setActiveImage(0);
    setSelectedSize(null);
    setQuantity(1);
  }, [productName]);

  const handleAddToCart = () => {
    if (!selected || !selectedSize) return;
    addItem({ name: selected.name, image: selected.image, size: selectedSize, quantity, price: 30 });
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
            <button
              onClick={() => toggleFavorite(selected.name)}
              className="p-3 rounded-full bg-card border border-border hover:bg-muted transition-colors"
            >
              <Heart className={`h-5 w-5 ${favorites.has(selected.name) ? "fill-red-500 text-red-500" : "text-foreground"}`} />
            </button>
            <button
              onClick={onClose}
              className="p-3 rounded-full bg-card border border-border hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            <div className="bg-card flex flex-col items-center justify-center p-4 gap-4">
              <motion.img
                key={activeImage}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={gallery[activeImage]}
                alt={selected.name}
                className="max-h-[70vh] w-auto object-contain"
              />
              {gallery.length > 1 && (
                <div className="flex gap-3 flex-wrap justify-center">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-20 h-20 rounded overflow-hidden border-2 transition-all ${
                        activeImage === idx
                          ? "border-primary shadow-[var(--shadow-gold)]"
                          : "border-border hover:border-primary/50 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`${selected.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-8 md:p-12 flex flex-col justify-center max-w-lg mx-auto w-full">
              <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-primary mb-1">{selected.team}</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-wide mb-2">{selected.name}</h2>
              <p className="font-display text-3xl font-bold text-gradient-gold mb-8">{selected.price}</p>

              <div className="mb-6">
                <p className="text-sm font-semibold mb-3">{t("product.size")}</p>
                <div className="flex flex-wrap gap-2">
                  {selected.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] h-10 px-3 rounded border text-sm font-medium transition-all ${
                        selectedSize === size
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-transparent text-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <p className="text-sm font-semibold mb-3">{t("product.quantity")}</p>
                <div className="flex items-center border border-border rounded w-fit">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-muted transition-colors">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-5 text-sm font-medium min-w-[40px] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-muted transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded font-semibold text-sm tracking-wide uppercase transition-all duration-300 mb-6 ${
                  selectedSize
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-gold)]"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
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
                    <button
                      onClick={() => setOpenAccordion(openAccordion === item.key ? null : item.key)}
                      className="w-full flex items-center justify-between py-4 text-sm font-semibold hover:text-primary transition-colors"
                    >
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
