import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Search, X, Minus, Plus, ChevronDown, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import shirt1 from "@/assets/shirt-new-1.png";
import shirt2 from "@/assets/shirt-new-2.png";
import shirt3 from "@/assets/shirt-new-3.png";
import shirt4 from "@/assets/shirt-new-4.png";
import shirt5 from "@/assets/shirt-new-5.png";
import shirt6 from "@/assets/shirt-new-6.png";
import shirt7 from "@/assets/shirt-new-7.png";

const leagues = [
  { name: "Alle", teams: [] },
  { name: "Eredivisie", teams: ["Ajax"] },
  { name: "Serie A", teams: ["SSC Napoli"] },
  { name: "La Liga", teams: ["FC Barcelona"] },
  { name: "Ligue 1", teams: ["Olympique Marseille"] },
  { name: "Nationaal", teams: ["Italië", "Portugal", "Spanje"] },
  { name: "Special", teams: ["Special Edition", "FC Barcelona", "Italië"] },
];

const allProducts = [
  { image: shirt1, name: "Stone Island x Ajax", team: "Ajax", leagues: ["Eredivisie"], price: "€30", description: "Exclusieve samenwerking tussen Stone Island en Ajax. Premium kwaliteit met uniek design.", sizes: ["S", "M", "L", "XL", "2XL"] },
  { image: shirt2, name: "Italy x Versace", team: "Italië", leagues: ["Nationaal", "Special"], price: "€30", description: "Luxe Italiaans design met Versace-elementen. Een stijlvol eerbetoon aan het Italiaanse voetbal.", sizes: ["S", "M", "L", "XL", "2XL"] },
  { image: shirt3, name: "SSC Napoli EA7 2025/26 Halloween Kit", team: "SSC Napoli", leagues: ["Serie A"], price: "€30", description: "Het exclusieve Halloween kit van SSC Napoli in samenwerking met EA7.", sizes: ["S", "M", "L", "XL", "2XL", "3XL"] },
  { image: shirt4, name: "Portugal x Louis Vuitton", team: "Portugal", leagues: ["Nationaal"], price: "€30", description: "Luxe Portugal editie geïnspireerd door Louis Vuitton. Uniek design met Portugese flair.", sizes: ["S", "M", "L", "XL", "2XL"] },
  { image: shirt5, name: "Italië Special Trainingsshirt", team: "Italië", leagues: ["Nationaal", "Special"], price: "€30", description: "Exclusief Italiaans trainingsshirt met uniek design. Een must-have voor elke voetballiefhebber.", sizes: ["S", "M", "L", "XL", "2XL", "3XL"] },
  { image: shirt6, name: "Barcelona Special Flower Design", team: "FC Barcelona", leagues: ["La Liga", "Special"], price: "€30", description: "Unieke Barcelona editie met bloemenpatroon en premium afwerking.", sizes: ["S", "M", "L", "XL", "2XL"] },
  { image: shirt7, name: "Marseille Third", team: "Olympique Marseille", leagues: ["Ligue 1"], price: "€30", description: "Het stijlvolle third shirt van Olympique Marseille. Frans design op zijn best.", sizes: ["S", "M", "L", "XL", "2XL"] },
];

const Collectie = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("Alle");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const { favorites, toggleFavorite, addItem } = useCart();

  const currentLeague = leagues.find(l => l.name === selectedLeague);
  const teamsForLeague = currentLeague?.teams || [];

  const filteredProducts = useMemo(() =>
    allProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.team.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLeague = selectedLeague === "Alle" || p.leagues.includes(selectedLeague);
      const matchesTeam = !selectedTeam || p.team === selectedTeam;
      return matchesSearch && matchesLeague && matchesTeam;
    }), [searchQuery, selectedLeague, selectedTeam]
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

  const handleAddToCart = () => {
    if (!selected || !selectedSize) return;
    addItem({ name: selected.name, image: selected.image, size: selectedSize, quantity, price: 30 });
    closeModal();
  };

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
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-primary mb-3">Onze Shirts</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">Hele Collectie</h1>
          </motion.div>

          {/* Search */}
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

          {/* League filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {leagues.map((league) => (
              <button
                key={league.name}
                onClick={() => { setSelectedLeague(league.name); setSelectedTeam(null); }}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide uppercase transition-all duration-300 border ${
                  selectedLeague === league.name
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground border-border/50 hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {league.name}
              </button>
            ))}
          </div>

          {/* Team sub-filters */}
          {teamsForLeague.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <button
                onClick={() => setSelectedTeam(null)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide transition-all border ${
                  !selectedTeam ? "bg-primary/20 text-primary border-primary/40" : "bg-transparent text-muted-foreground border-border/30 hover:border-primary/20"
                }`}
              >
                Alle teams
              </button>
              {teamsForLeague.map((team) => (
                <button
                  key={team}
                  onClick={() => setSelectedTeam(team)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide transition-all border ${
                    selectedTeam === team ? "bg-primary/20 text-primary border-primary/40" : "bg-transparent text-muted-foreground border-border/30 hover:border-primary/20"
                  }`}
                >
                  {team}
                </button>
              ))}
            </div>
          )}

          {teamsForLeague.length === 0 && <div className="mb-8" />}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, i) => (
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
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/70 backdrop-blur-sm transition-colors hover:bg-background/90"
                >
                  <Heart className={`h-4 w-4 transition-colors ${favorites.has(product.name) ? "fill-red-500 text-red-500" : "text-foreground"}`} />
                </button>
                <div
                  onClick={() => openModal(i)}
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

          {filteredProducts.length === 0 && (
            <p className="text-center text-muted-foreground mt-12">Geen shirts gevonden.</p>
          )}
        </div>
      </section>
      <Footer />

      {/* Fullscreen Product Detail */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background overflow-y-auto"
          >
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button
                onClick={() => toggleFavorite(selected.name)}
                className="p-3 rounded-full bg-card border border-border hover:bg-muted transition-colors"
              >
                <Heart className={`h-5 w-5 ${favorites.has(selected.name) ? "fill-red-500 text-red-500" : "text-foreground"}`} />
              </button>
              <button
                onClick={closeModal}
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

                {/* Sizes */}
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

                {/* Quantity */}
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

                {/* Add to cart */}
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

                {/* Accordions */}
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
    </div>
  );
};

export default Collectie;
