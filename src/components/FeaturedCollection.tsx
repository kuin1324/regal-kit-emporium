import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import ProductDetailModal, { allProducts } from "./ProductDetailModal";

const products = allProducts.slice(0, 6);

const FeaturedCollection = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const { favorites, toggleFavorite } = useCart();

  return (
    <section id="collectie" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-primary mb-3">
            Uitgelicht
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Onze Collectie
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
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

        <Link to="/collectie" className="flex flex-col items-center gap-2 mt-12 group cursor-pointer">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-primary group-hover:text-primary/80 transition-colors">
              Bekijk hele collectie
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="h-6 w-6 text-primary" />
            </motion.div>
          </motion.div>
        </Link>
      </div>

      <ProductDetailModal productName={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </section>
  );
};

export default FeaturedCollection;
