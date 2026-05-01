import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCart } from "@/context/CartContext";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import ProductDetailModal, { allProducts } from "@/components/ProductDetailModal";
import { useProductName } from "@/lib/productName";

const Favorieten = () => {
  const { favorites, toggleFavorite } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const favoriteProducts = allProducts.filter(p => favorites.has(p.name));
  const { t } = useTranslation();
  const productName = useProductName();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-primary mb-3">❤️</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">{t("favorites.title")}</h1>
          </motion.div>

          {favoriteProducts.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground mb-4">{t("favorites.empty")}</p>
              <Link to="/collectie" className="text-primary text-sm hover:underline">{t("favorites.browse")}</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProducts.map((product, i) => (
                <motion.div key={product.name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="group relative cursor-pointer">
                  <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.name); }} className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/70 backdrop-blur-sm">
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </button>
                  <div onClick={() => setSelectedProduct(product.name)}>
                    <div className="relative overflow-hidden rounded bg-card border border-border/50 transition-all duration-500 group-hover:border-primary/30">
                      <div className="aspect-[4/5] overflow-hidden">
                        <img src={product.image} alt={productName(product.name)} className="h-full w-full object-cover" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent p-5 pt-12">
                        <h3 className="font-display text-base font-semibold">{productName(product.name)}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{product.team}</p>
                        <p className="font-display text-lg font-bold text-gradient-gold">{product.price}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
      <ProductDetailModal productName={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default Favorieten;
