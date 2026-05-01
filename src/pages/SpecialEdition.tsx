import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState } from "react";
import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "@/context/CartContext";
import ProductDetailModal, { allProducts } from "@/components/ProductDetailModal";
import { useProductName } from "@/lib/productName";

const SpecialEdition = () => {
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const { favorites, toggleFavorite } = useCart();
  const productName = useProductName();

  const specialProducts = allProducts.filter(p => p.leagues.includes("Special"));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-primary mb-3">{t("special.eyebrow")}</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">{t("special.title")}</h1>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto">{t("special.subtitle")}</p>
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
        </div>
      </section>
      <Footer />
      <ProductDetailModal productName={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default SpecialEdition;
