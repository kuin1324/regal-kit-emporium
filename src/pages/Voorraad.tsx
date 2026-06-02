import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Truck, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetailModal, { allProducts } from "@/components/ProductDetailModal";
import { useCart } from "@/context/CartContext";
import { useProductName } from "@/lib/productName";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Voorraad = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);
  const { favorites, toggleFavorite } = useCart();
  const productName = useProductName();

  const ready = allProducts.filter((p) => (p as any).availability !== "incoming");
  const incoming = allProducts.filter((p) => (p as any).availability === "incoming");

  const Grid = ({ items, incoming: isIncoming }: { items: typeof allProducts; incoming?: boolean }) => (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {items.map((product, i) => (
        <motion.div
          key={product.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          viewport={{ once: true }}
          className="group cursor-pointer relative"
        >
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(product.name); }}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/70 backdrop-blur-sm hover:bg-background/90 transition-colors"
          >
            <Heart className={`h-4 w-4 ${favorites.has(product.name) ? "fill-red-500 text-red-500" : "text-foreground"}`} />
          </button>

          {isIncoming && (
            <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-[10px] font-semibold tracking-wider uppercase">
              Pre-order
            </span>
          )}

          <div
            onClick={() => setSelected(product.name)}
            className="relative overflow-hidden rounded bg-card border border-border/50 transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-[var(--shadow-gold)]"
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={product.image}
                alt={productName(product.name)}
                loading="lazy"
                className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${isIncoming ? "opacity-90" : ""}`}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent p-4 sm:p-5 pt-10">
              <h3 className="font-display text-sm sm:text-base font-semibold tracking-wide">{productName(product.name)}</h3>
              <p className="text-xs text-muted-foreground mb-2">{product.team}</p>
              <p className="font-display text-base sm:text-lg font-bold text-gradient-gold">{product.price}</p>
              {isIncoming && (
                <p className="text-[11px] text-primary mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Binnenkort — pre-order mogelijk
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-24 sm:pt-28 pb-24">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-primary mb-3">Voorraad</p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">Ready to Ship & Incoming Stock</h1>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-sm sm:text-base">
              Bekijk wat direct verzendklaar is en welke shirts onderweg zijn — pre-order nu jouw favoriet.
            </p>
          </motion.div>

          <Tabs defaultValue="ready" className="w-full">
            <TabsList className="mx-auto grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="ready" className="flex items-center gap-2">
                <Truck className="h-4 w-4" /> Ready to Ship
              </TabsTrigger>
              <TabsTrigger value="incoming" className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Incoming Stock
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ready">
              <Grid items={ready} />
            </TabsContent>

            <TabsContent value="incoming">
              <div className="mb-6 p-4 rounded border border-primary/30 bg-primary/5 text-sm text-foreground/80 max-w-2xl mx-auto text-center">
                Deze shirts zijn nog onderweg. Je kunt ze nu al <span className="text-primary font-semibold">pre-orderen</span> — wij sturen ze zodra ze binnenkomen.
              </div>
              <Grid items={incoming} incoming />
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <Footer />
      <ProductDetailModal productName={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default Voorraad;
