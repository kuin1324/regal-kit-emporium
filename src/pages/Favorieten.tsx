import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import shirt1 from "@/assets/shirt-new-1.png";
import shirt2 from "@/assets/shirt-new-2.png";
import shirt3 from "@/assets/shirt-new-3.png";
import shirt4 from "@/assets/shirt-new-4.png";
import shirt5 from "@/assets/shirt-new-5.png";
import shirt6 from "@/assets/shirt-new-6.png";
import shirt7 from "@/assets/shirt-new-7.png";

const allProducts = [
  { image: shirt1, name: "Stone Island x Ajax", team: "Ajax", price: "€30" },
  { image: shirt2, name: "Italy x Versace", team: "Italië", price: "€30" },
  { image: shirt3, name: "SSC Napoli EA7 2025/26 Halloween Kit", team: "SSC Napoli", price: "€30" },
  { image: shirt4, name: "Portugal x Louis Vuitton", team: "Portugal", price: "€30" },
  { image: shirt5, name: "Baroque Classic", team: "Special Edition", price: "€30" },
  { image: shirt6, name: "Betis Art Edition", team: "Real Betis", price: "€30" },
  { image: shirt7, name: "Marseille Third", team: "Olympique Marseille", price: "€30" },
];

const Favorieten = () => {
  const { favorites, toggleFavorite } = useCart();
  const favoriteProducts = allProducts.filter(p => favorites.has(p.name));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-primary mb-3">❤️</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">Favorieten</h1>
          </motion.div>

          {favoriteProducts.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground mb-4">Je hebt nog geen favorieten</p>
              <Link to="/collectie" className="text-primary text-sm hover:underline">Bekijk de collectie →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProducts.map((product, i) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="group relative"
                >
                  <button
                    onClick={() => toggleFavorite(product.name)}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/70 backdrop-blur-sm"
                  >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </button>
                  <Link to="/collectie">
                    <div className="relative overflow-hidden rounded bg-card border border-border/50 transition-all duration-500 group-hover:border-primary/30">
                      <div className="aspect-[4/5] overflow-hidden">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent p-5 pt-12">
                        <h3 className="font-display text-base font-semibold">{product.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{product.team}</p>
                        <p className="font-display text-lg font-bold text-gradient-gold">{product.price}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Favorieten;
