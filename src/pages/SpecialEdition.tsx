import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Heart, X, Minus, Plus, ChevronDown, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import shirt2 from "@/assets/shirt-new-2.png";
import shirt5 from "@/assets/shirt-new-5.png";
import shirt6 from "@/assets/shirt-new-6.png";

const specialProducts = [
  { image: shirt2, name: "Italy x Versace", team: "Italië", price: "€30", description: "Luxe Italiaans design met Versace-elementen.", sizes: ["S", "M", "L", "XL", "2XL"] },
  { image: shirt5, name: "Italië Special Trainingsshirt", team: "Italië", price: "€30", description: "Exclusief Italiaans trainingsshirt met uniek design.", sizes: ["S", "M", "L", "XL", "2XL", "3XL"] },
  { image: shirt6, name: "Barcelona Special Flower Design", team: "FC Barcelona", price: "€30", description: "Unieke Barcelona editie met bloemenpatroon en premium afwerking.", sizes: ["S", "M", "L", "XL", "2XL"] },
];

const SpecialEdition = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const { favorites, toggleFavorite, addItem } = useCart();

  const selected = selectedIndex !== null ? specialProducts[selectedIndex] : null;

  const handleAddToCart = () => {
    if (!selected || !selectedSize) return;
    addItem({ name: selected.name, image: selected.image, size: selectedSize, quantity, price: 30 });
    setSelectedIndex(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-primary mb-3">Exclusief</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">Special Edition</h1>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
              Ontdek onze exclusieve special edition shirts — uniek en stijlvol.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialProducts.map((product, i) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="group cursor-pointer relative"
              >
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(product.name); }}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/70 backdrop-blur-sm transition-colors hover:bg-white/90"
                >
                  <Heart className={`h-4 w-4 transition-colors ${favorites.has(product.name) ? "fill-red-500 text-red-500" : "text-foreground"}`} />
                </button>
                <div
                  onClick={() => { setSelectedIndex(i); setSelectedSize(null); setQuantity(1); setOpenAccordion(null); }}
                  className="relative overflow-hidden rounded bg-card border border-border/50 transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-[var(--shadow-gold)]"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent p-5 pt-12">
                    <h3 className="font-display text-base font-semibold tracking-wide">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{product.team}</p>
                    <p className="font-display text-lg font-bold text-gradient-gold">{product.price}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background overflow-y-auto"
          >
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button onClick={() => toggleFavorite(selected.name)} className="p-3 rounded-full bg-card border border-border hover:bg-muted transition-colors">
                <Heart className={`h-5 w-5 ${favorites.has(selected.name) ? "fill-red-500 text-red-500" : "text-foreground"}`} />
              </button>
              <button onClick={() => setSelectedIndex(null)} className="p-3 rounded-full bg-card border border-border hover:bg-muted transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
              <div className="bg-card flex items-center justify-center p-4">
                <motion.img initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={selected.image} alt={selected.name} className="max-h-[85vh] w-auto object-contain" />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center max-w-lg mx-auto w-full">
                <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-primary mb-1">{selected.team}</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold tracking-wide mb-2">{selected.name}</h2>
                <p className="font-display text-3xl font-bold text-gradient-gold mb-8">{selected.price}</p>

                <div className="mb-6">
                  <p className="text-sm font-semibold mb-3">Maat</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.sizes.map((size) => (
                      <button key={size} onClick={() => setSelectedSize(size)} className={`min-w-[48px] h-10 px-3 rounded border text-sm font-medium transition-all ${selectedSize === size ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-foreground border-border hover:border-primary/50"}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-sm font-semibold mb-3">Aantal</p>
                  <div className="flex items-center border border-border rounded w-fit">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-muted transition-colors"><Minus className="h-4 w-4" /></button>
                    <span className="px-5 text-sm font-medium min-w-[40px] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-muted transition-colors"><Plus className="h-4 w-4" /></button>
                  </div>
                </div>

                <button onClick={handleAddToCart} disabled={!selectedSize} className={`w-full flex items-center justify-center gap-2 py-4 rounded font-semibold text-sm tracking-wide uppercase transition-all duration-300 mb-6 ${selectedSize ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-gold)]" : "bg-muted text-muted-foreground cursor-not-allowed"}`}>
                  <ShoppingBag className="h-4 w-4" />
                  {selectedSize ? "In Winkelmandje" : "Kies eerst een maat"}
                </button>

                <div className="border-t border-border">
                  {[
                    { key: "description", label: "Beschrijving", content: selected.description },
                    { key: "shipping", label: "Verzending", content: "Wereldwijde verzending. Levertijd naar Europa is ongeveer 15 dagen." },
                    { key: "returns", label: "Retourneren", content: "Niet tevreden? Je kunt het shirt binnen 14 dagen retourneren in originele staat." },
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
    </div>
  );
};

export default SpecialEdition;
