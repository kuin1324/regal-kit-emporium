import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import shirt1 from "@/assets/shirt-1.jpg";
import shirt2 from "@/assets/shirt-2.jpg";
import shirt3 from "@/assets/shirt-3.jpg";
import shirt4 from "@/assets/shirt-4.jpg";
import shirt5 from "@/assets/shirt-5.jpg";
import shirt6 from "@/assets/shirt-6.jpg";

const products = [
  { image: shirt1, name: "Rossoneri Classic", team: "AC Milan", year: "1994", price: "€249" },
  { image: shirt2, name: "Galácticos Home", team: "Real Madrid", year: "2002", price: "€289" },
  { image: shirt3, name: "Seleção Ouro", team: "Brasil", year: "1998", price: "€349" },
  { image: shirt4, name: "Blaugrana Legend", team: "FC Barcelona", year: "2006", price: "€269" },
  { image: shirt5, name: "Bianconeri Heritage", team: "Juventus", year: "2017", price: "€229" },
  { image: shirt6, name: "Red Devils Classic", team: "Manchester United", year: "1999", price: "€319" },
];

const FeaturedCollection = () => {
  return (
    <section className="py-24 bg-background">
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
            <ProductCard key={product.name} {...product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
