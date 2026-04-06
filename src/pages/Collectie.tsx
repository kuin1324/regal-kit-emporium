import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useRef } from "react";
import { Search, Heart, Upload, X, ImageIcon } from "lucide-react";
import { useCart } from "@/context/CartContext";
import ProductDetailModal, { allProducts } from "@/components/ProductDetailModal";

const leagues = [
  { name: "Alle", teams: [] },
  { name: "Eredivisie", teams: ["Ajax"] },
  { name: "Serie A", teams: ["SSC Napoli"] },
  { name: "La Liga", teams: ["FC Barcelona"] },
  { name: "Ligue 1", teams: ["Olympique Marseille"] },
  { name: "Nationaal", teams: ["Italië", "Portugal", "Spanje"] },
  { name: "Special", teams: ["Special Edition", "FC Barcelona", "Italië"] },
];

const colorMap: Record<string, string> = {
  zwart: "#000000",
  wit: "#FFFFFF",
  blauw: "#1E40AF",
  rood: "#DC2626",
  goud: "#D4A017",
  groen: "#16A34A",
  oranje: "#EA580C",
};

const allColors = Object.keys(colorMap);
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const Collectie = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("Alle");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const { favorites, toggleFavorite } = useCart();

  const currentLeague = leagues.find(l => l.name === selectedLeague);
  const teamsForLeague = currentLeague?.teams || [];

  const filteredProducts = useMemo(() =>
    allProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.team.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLeague = selectedLeague === "Alle" || p.leagues.includes(selectedLeague);
      const matchesTeam = !selectedTeam || p.team === selectedTeam;
      const matchesColor = !selectedColor || p.colors?.includes(selectedColor);
      const matchesLetter = !selectedLetter || p.name.charAt(0).toUpperCase() === selectedLetter;
      return matchesSearch && matchesLeague && matchesTeam && matchesColor && matchesLetter;
    }), [searchQuery, selectedLeague, selectedTeam, selectedColor, selectedLetter]
  );

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

          {/* Zoekbalk */}
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Zoek op naam of team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded border border-border/50 bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Kleurfilter */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <button
              onClick={() => setSelectedColor(null)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide transition-all border ${
                !selectedColor ? "bg-primary/20 text-primary border-primary/40" : "bg-transparent text-muted-foreground border-border/30 hover:border-primary/20"
              }`}
            >
              Alle kleuren
            </button>
            {allColors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide transition-all border ${
                  selectedColor === color ? "bg-primary/20 text-primary border-primary/40" : "bg-transparent text-muted-foreground border-border/30 hover:border-primary/20"
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-border/50 shrink-0"
                  style={{ backgroundColor: colorMap[color] }}
                />
                {color}
              </button>
            ))}
          </div>

          {/* Letterfilter */}
          <div className="flex flex-wrap justify-center gap-1 mb-4">
            <button
              onClick={() => setSelectedLetter(null)}
              className={`w-7 h-7 rounded text-[10px] font-semibold transition-all ${
                !selectedLetter ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Alle
            </button>
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(selectedLetter === letter ? null : letter)}
                className={`w-7 h-7 rounded text-[10px] font-semibold transition-all ${
                  selectedLetter === letter ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Foto-thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {allProducts.map((product) => (
              <button
                key={product.name}
                onClick={() => setSelectedProduct(product.name)}
                className="shrink-0 w-16 h-20 rounded border border-border/50 overflow-hidden hover:border-primary/50 transition-all"
              >
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </button>
            ))}
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
                  onClick={() => setSelectedProduct(product.name)}
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
      <ProductDetailModal productName={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default Collectie;
