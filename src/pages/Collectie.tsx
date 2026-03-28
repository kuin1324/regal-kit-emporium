import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Search, X, Minus, Plus, ChevronDown } from "lucide-react";
import shirt1 from "@/assets/shirt-new-1.png";
import shirt2 from "@/assets/shirt-new-2.png";
import shirt3 from "@/assets/shirt-new-3.png";
import shirt4 from "@/assets/shirt-new-4.png";
import shirt5 from "@/assets/shirt-new-5.png";
import shirt6 from "@/assets/shirt-new-6.png";
import shirt7 from "@/assets/shirt-new-7.png";

const categories = ["Alle", "Special Collab", "Italië", "SSC Napoli", "Spanje", "Special Edition", "Real Betis", "Olympique Marseille"];

const allProducts = [
  { image: shirt1, name: "Stone Island x Adidas", team: "Special Collab", year: "2024", price: "€30", description: "Exclusieve samenwerking tussen Stone Island en Adidas. Premium kwaliteit met uniek design.", sizes: ["S", "M", "L", "XL", "2XL"] },
  { image: shirt2, name: "Versace Italia", team: "Italië", year: "2024", price: "€30", description: "Luxe Italiaans design met Versace-elementen. Een stijlvol eerbetoon aan het Italiaanse voetbal.", sizes: ["S", "M", "L", "XL", "2XL"] },
  { image: shirt3, name: "Napoli Third Kit", team: "SSC Napoli", year: "2024", price: "€30", description: "Het third kit van SSC Napoli met een modern en elegant ontwerp.", sizes: ["S", "M", "L", "XL", "2XL", "3XL"] },
  { image: shirt4, name: "LV Spain Edition", team: "Spanje", year: "2024", price: "€30", description: "Luxe Spain editie geïnspireerd door high-end fashion. Uniek design met Spaanse flair.", sizes: ["S", "M", "L", "XL", "2XL"] },
  { image: shirt5, name: "Baroque Classic", team: "Special Edition", year: "2024", price: "€30", description: "Barok-geïnspireerd design met klassieke elementen. Een echte eyecatcher.", sizes: ["S", "M", "L", "XL", "2XL", "3XL"] },
  { image: shirt6, name: "Betis Art Edition", team: "Real Betis", year: "2024", price: "€30", description: "Artistieke editie van Real Betis met creatief patroon en premium afwerking.", sizes: ["S", "M", "L", "XL", "2XL"] },
  { image: shirt7, name: "Marseille Third", team: "Olympique Marseille", year: "2024", price: "€30", description: "Het stijlvolle third shirt van Olympique Marseille. Frans design op zijn best.", sizes: ["S", "M", "L", "XL", "2XL"] },
];

const Collectie = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Alle");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const filteredProducts = useMemo(() =>
    allProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.team.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "Alle" || p.team === selectedCategory;
      return matchesSearch && matchesCategory;
    }), [searchQuery, selectedCategory]
  );

  const openModal = (index: number) => {
    const product = filteredProducts[index];
    const realIndex = allProducts.findIndex(p => p.name === product.name);
    setSelectedIndex(realIndex);
    setSelectedSize(null);
    setQuantity(1);
    setOpenAccordion(null);
  };
  const closeModal = () => setSelectedIndex(null);

  const selected = selectedIndex !== null ? allProducts[selectedIndex] : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-primary mb-3">
              Onze Shirts
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
              Hele Collectie
            </h1>
          </motion.div>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Zoek op naam of team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded border border-border/50 bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide uppercase transition-all duration-300 border ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground border-border/50 hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
                onClick={() => openModal(i)}
              >
                <div className="relative overflow-hidden rounded bg-card border border-border/50 transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-[var(--shadow-gold)]">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent p-5 pt-12">
                    <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-primary mb-1">{product.year}</p>
                    <h3 className="font-display text-base font-semibold tracking-wide">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{product.team}</p>
                    <p className="font-display text-lg font-bold text-gradient-gold">{product.price}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="text-center text-muted-foreground mt-12">Geen shirts gevonden.</p>
          )}
        </div>
      </section>
      <Footer />

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md p-4 overflow-y-auto"
            onClick={closeModal}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl w-full bg-card border border-border rounded-lg overflow-hidden my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left: Image */}
                <div className="bg-muted/30">
                  <img
                    src={selected.image}
                    alt={selected.name}
                    className="w-full aspect-[4/5] object-cover"
                  />
                </div>

                {/* Right: Product details */}
                <div className="p-6 md:p-8 flex flex-col">
                  <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-primary mb-1">
                    {selected.team}
                  </p>
                  <h2 className="font-display text-2xl md:text-3xl font-bold tracking-wide mb-2">
                    {selected.name}
                  </h2>
                  <p className="font-display text-2xl font-bold text-gradient-gold mb-6">
                    {selected.price}
                  </p>

                  {/* Size selector */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold mb-3">Maat</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[48px] h-10 px-3 rounded border text-sm font-medium transition-all duration-200 ${
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

                  {/* Quantity */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold mb-3">Aantal</p>
                    <div className="flex items-center border border-border rounded w-fit">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-muted transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-5 text-sm font-medium min-w-[40px] text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 hover:bg-muted transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Accordions */}
                  <div className="border-t border-border mt-auto">
                    {[
                      { key: "description", label: "Beschrijving", content: selected.description },
                      { key: "shipping", label: "Verzending & Levering", content: "Wereldwijde verzending. Levertijd naar Europa is ongeveer 15 dagen. Gratis verzending bij bestellingen boven €75." },
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
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Collectie;
