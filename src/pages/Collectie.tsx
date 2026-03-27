import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import shirt1 from "@/assets/shirt-1.jpg";
import shirt2 from "@/assets/shirt-2.jpg";
import shirt3 from "@/assets/shirt-3.jpg";
import shirt4 from "@/assets/shirt-4.jpg";
import shirt5 from "@/assets/shirt-5.jpg";
import shirt6 from "@/assets/shirt-6.jpg";

const allProducts = [
  { image: shirt1, name: "Rossoneri Classic", team: "AC Milan", year: "1994", price: "€249" },
  { image: shirt2, name: "Galácticos Home", team: "Real Madrid", year: "2002", price: "€289" },
  { image: shirt3, name: "Seleção Ouro", team: "Brasil", year: "1998", price: "€349" },
  { image: shirt4, name: "Blaugrana Legend", team: "FC Barcelona", year: "2006", price: "€269" },
  { image: shirt5, name: "Bianconeri Heritage", team: "Juventus", year: "2017", price: "€229" },
  { image: shirt6, name: "Red Devils Classic", team: "Manchester United", year: "1999", price: "€319" },
];

const Collectie = () => {
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
              <ProductCard key={product.name} {...product} index={i} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Collectie;
