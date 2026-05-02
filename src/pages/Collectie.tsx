import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState, useMemo, useRef } from "react";
import { Search, Heart, Upload, X, ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "@/context/CartContext";
import { useProductName } from "@/lib/productName";
import ProductDetailModal, { allProducts } from "@/components/ProductDetailModal";

const leagues = [
  { key: "all", value: "Alle", teams: [] },
  { key: "eredivisie", value: "Eredivisie", teams: ["Ajax"] },
  { key: "serieA", value: "Serie A", teams: ["SSC Napoli"] },
  { key: "laLiga", value: "La Liga", teams: ["FC Barcelona"] },
  { key: "ligue1", value: "Ligue 1", teams: ["Olympique Marseille"] },
  { key: "national", value: "Nationaal", teams: ["Italië", "Portugal", "Spanje"] },
  { key: "special", value: "Special", teams: ["Special Edition", "FC Barcelona", "Italië"] },
];

const colorMap: Record<string, string> = {
  zwart: "#000000", wit: "#FFFFFF", blauw: "#1E40AF", rood: "#DC2626",
  geel: "#FACC15", groen: "#16A34A", oranje: "#EA580C",
  meerkleurig: "linear-gradient(135deg,#DC2626,#FACC15,#16A34A,#1E40AF)",
};

const allColors = Object.keys(colorMap);
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const Collectie = () => {
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("Alle");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { favorites, toggleFavorite } = useCart();
  const productName = useProductName();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setUploadedImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const currentLeague = leagues.find(l => l.value === selectedLeague);
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-primary mb-3">{t("collection.eyebrow")}</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">{t("collection.title")}</h1>
          </motion.div>

          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("search.placeholderShort")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded border border-border/50 bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <div className="flex justify-center mb-6">
            {!uploadedImage ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-dashed border-border/60 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
              >
                <Upload className="h-4 w-4" />
                {t("collection.uploadCta")}
              </button>
            ) : (
              <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-primary/30 bg-card">
                <ImageIcon className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">{t("collection.photoLoaded")}</span>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[11px] font-medium text-primary hover:underline">
                  {t("collection.edit")}
                </button>
                <button
                  type="button"
                  onClick={() => { setUploadedImage(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="p-1 rounded-full hover:bg-muted transition-colors"
                  aria-label={t("collection.removePhoto")}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <button
              onClick={() => setSelectedColor(null)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide transition-all border ${
                !selectedColor ? "bg-primary/20 text-primary border-primary/40" : "bg-transparent text-muted-foreground border-border/30 hover:border-primary/20"
              }`}
            >
              {t("collection.allColors")}
            </button>
            {allColors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide transition-all border ${
                  selectedColor === color ? "bg-primary/20 text-primary border-primary/40" : "bg-transparent text-muted-foreground border-border/30 hover:border-primary/20"
                }`}
              >
                <span className="w-3 h-3 rounded-full border border-border/50 shrink-0" style={{ backgroundColor: colorMap[color] }} />
                {t(`collection.colors.${color}`)}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-1 mb-4">
            <button
              onClick={() => setSelectedLetter(null)}
              className={`w-7 h-7 rounded text-[10px] font-semibold transition-all ${
                !selectedLetter ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("leagues.all")}
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

          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {leagues.map((league) => (
              <button
                key={league.key}
                onClick={() => { setSelectedLeague(league.value); setSelectedTeam(null); }}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide uppercase transition-all duration-300 border ${
                  selectedLeague === league.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground border-border/50 hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {t(`leagues.${league.key}`)}
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
                {t("collection.allTeams")}
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
                    <img src={product.image} alt={productName(product.name)} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent p-5 pt-12">
                    <h3 className="font-display text-base font-semibold tracking-wide">{productName(product.name)}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{product.team}</p>
                    <p className="font-display text-lg font-bold text-gradient-gold">{product.price}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="text-center text-muted-foreground mt-12">{t("collection.noResults")}</p>
          )}
        </div>

        {uploadedImage && (
          <div className="fixed bottom-4 right-4 z-40 w-28 sm:w-36 rounded-lg overflow-hidden border border-primary/40 bg-card shadow-[var(--shadow-gold)]">
            <div className="relative">
              <img src={uploadedImage} alt={t("collection.yourPhoto")} className="w-full h-36 sm:h-44 object-cover" />
              <button
                type="button"
                onClick={() => { setUploadedImage(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                className="absolute top-1 right-1 p-1 rounded-full bg-background/80 hover:bg-background"
                aria-label={t("collection.close")}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <p className="text-[10px] text-center py-1 text-muted-foreground bg-card">{t("collection.yourPhoto")}</p>
          </div>
        )}
      </section>
      <Footer />
      <ProductDetailModal productName={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default Collectie;
