import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ChevronDown, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import shirt1 from "@/assets/shirt-new-1.png";
import shirt2 from "@/assets/shirt-new-2.png";
import shirt3 from "@/assets/shirt-new-3.png";
import shirt4 from "@/assets/shirt-new-4.png";
import shirt5 from "@/assets/shirt-new-5.png";
import shirt6 from "@/assets/shirt-new-6.png";
import shirt7 from "@/assets/shirt-new-7.png";

export const allProducts = [
  { image: shirt1, name: "Stone Island x Ajax", team: "Ajax", leagues: ["Eredivisie"], price: "€30", description: "Exclusieve samenwerking tussen Stone Island en Ajax. Premium kwaliteit met uniek design.", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["zwart", "rood"] },
  { image: shirt2, name: "Italy x Versace", team: "Italië", leagues: ["Nationaal", "Special"], price: "€30", description: "Luxe Italiaans design met Versace-elementen. Een stijlvol eerbetoon aan het Italiaanse voetbal.", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["blauw", "goud"] },
  { image: shirt3, name: "SSC Napoli EA7 2025/26 Halloween Kit", team: "SSC Napoli", leagues: ["Serie A"], price: "€30", description: "Het exclusieve Halloween kit van SSC Napoli in samenwerking met EA7.", sizes: ["S", "M", "L", "XL", "2XL", "3XL"], colors: ["zwart", "oranje"] },
  { image: shirt4, name: "Portugal x Louis Vuitton", team: "Portugal", leagues: ["Nationaal"], price: "€30", description: "Luxe Portugal editie geïnspireerd door Louis Vuitton. Uniek design met Portugese flair.", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["rood", "groen", "goud"] },
  { image: shirt5, name: "Italië Special Trainingsshirt", team: "Italië", leagues: ["Nationaal", "Special"], price: "€30", description: "Exclusief Italiaans trainingsshirt met uniek design. Een must-have voor elke voetballiefhebber.", sizes: ["S", "M", "L", "XL", "2XL", "3XL"], colors: ["blauw", "wit"] },
  { image: shirt6, name: "Barcelona Special Flower Design", team: "FC Barcelona", leagues: ["La Liga", "Special"], price: "€30", description: "Unieke Barcelona editie met bloemenpatroon en premium afwerking.", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["rood", "blauw", "goud"] },
  { image: shirt7, name: "Marseille Third", team: "Olympique Marseille", leagues: ["Ligue 1"], price: "€30", description: "Het stijlvolle third shirt van Olympique Marseille. Frans design op zijn best.", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["zwart", "blauw"] },
];

interface ProductDetailModalProps {
  productName: string | null;
  onClose: () => void;
}

const ProductDetailModal = ({ productName, onClose }: ProductDetailModalProps) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const { favorites, toggleFavorite, addItem } = useCart();

  const selected = productName ? allProducts.find(p => p.name === productName) : null;

  const handleAddToCart = () => {
    if (!selected || !selectedSize) return;
    addItem({ name: selected.name, image: selected.image, size: selectedSize, quantity, price: 30 });
    onClose();
  };

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
            <div className="bg-card flex items-center justify-center p-4">
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={selected.image}
                alt={selected.name}
                className="max-h-[85vh] w-auto object-contain"
              />
            </div>

            <div className="p-8 md:p-12 flex flex-col justify-center max-w-lg mx-auto w-full">
              <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-primary mb-1">{selected.team}</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-wide mb-2">{selected.name}</h2>
              <p className="font-display text-3xl font-bold text-gradient-gold mb-8">{selected.price}</p>

              <div className="mb-6">
                <p className="text-sm font-semibold mb-3">Maat</p>
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
                <p className="text-sm font-semibold mb-3">Aantal</p>
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
                {selectedSize ? "In Winkelmandje" : "Kies eerst een maat"}
              </button>

              <div className="border-t border-border">
                {[
                  { key: "description", label: "Beschrijving", content: selected.description },
                  { key: "shipping", label: "Verzending", content: "Wereldwijde verzending. Levertijd naar Europa is ongeveer 15 dagen. Gratis verzending bij bestellingen boven €75." },
                  { key: "returns", label: "Retourneren", content: "Niet tevreden? Je kunt het shirt binnen 14 dagen retourneren in originele staat." },
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
