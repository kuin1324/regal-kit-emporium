import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import shirt1 from "@/assets/shirt-new-1.png";
import shirt2 from "@/assets/shirt-new-2.png";
import shirt3 from "@/assets/shirt-new-3.png";
import shirt4 from "@/assets/shirt-new-4.png";
import shirt5 from "@/assets/shirt-new-5.png";
import shirt6 from "@/assets/shirt-new-6.png";

const products = [
  { image: shirt1, name: "Stone Island x Adidas", team: "Special Collab", year: "2024", price: "€30" },
  { image: shirt2, name: "Versace Italia", team: "Italië", year: "2024", price: "€30" },
  { image: shirt3, name: "Napoli Third Kit", team: "SSC Napoli", year: "2024", price: "€30" },
  { image: shirt4, name: "LV Spain Edition", team: "Spanje", year: "2024", price: "€30" },
  { image: shirt5, name: "Baroque Classic", team: "Special Edition", year: "2024", price: "€30" },
  { image: shirt6, name: "Betis Art Edition", team: "Real Betis", year: "2024", price: "€30" },
];

const FeaturedCollection = () => {
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
            <ProductCard key={product.name} {...product} index={i} />
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
    </section>
  );
};

export default FeaturedCollection;
