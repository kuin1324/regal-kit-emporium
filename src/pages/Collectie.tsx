import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import shirt1 from "@/assets/shirt-new-1.png";
import shirt2 from "@/assets/shirt-new-2.png";
import shirt3 from "@/assets/shirt-new-3.png";
import shirt4 from "@/assets/shirt-new-4.png";
import shirt5 from "@/assets/shirt-new-5.png";
import shirt6 from "@/assets/shirt-new-6.png";
import shirt7 from "@/assets/shirt-new-7.png";

const allProducts = [
  { image: shirt1, name: "Stone Island x Adidas", team: "Special Collab", year: "2024", price: "€30" },
  { image: shirt2, name: "Versace Italia", team: "Italië", year: "2024", price: "€30" },
  { image: shirt3, name: "Napoli Third Kit", team: "SSC Napoli", year: "2024", price: "€30" },
  { image: shirt4, name: "LV Spain Edition", team: "Spanje", year: "2024", price: "€30" },
  { image: shirt5, name: "Baroque Classic", team: "Special Edition", year: "2024", price: "€30" },
  { image: shirt6, name: "Betis Art Edition", team: "Real Betis", year: "2024", price: "€30" },
  { image: shirt7, name: "Marseille Third", team: "Olympique Marseille", year: "2024", price: "€30" },
];

const Collectie = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openModal = (index: number) => setSelectedIndex(index);
  const closeModal = () => setSelectedIndex(null);
  const goNext = () => setSelectedIndex((prev) => (prev !== null ? (prev + 1) % allProducts.length : null));
  const goPrev = () => setSelectedIndex((prev) => (prev !== null ? (prev - 1 + allProducts.length) % allProducts.length : null));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-primary mb-3">
              Onze Shirts
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
              Hele Collectie
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProducts.map((product, i) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
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
        </div>
      </section>
      <Footer />

      {/* Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-lg w-full bg-card border border-border rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <button
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <img
                src={allProducts[selectedIndex].image}
                alt={allProducts[selectedIndex].name}
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="p-5">
                <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-primary mb-1">
                  {allProducts[selectedIndex].year}
                </p>
                <h3 className="font-display text-xl font-semibold tracking-wide">
                  {allProducts[selectedIndex].name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{allProducts[selectedIndex].team}</p>
                <p className="font-display text-2xl font-bold text-gradient-gold">
                  {allProducts[selectedIndex].price}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Collectie;
