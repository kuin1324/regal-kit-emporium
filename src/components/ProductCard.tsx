import { motion } from "framer-motion";

interface ProductCardProps {
  image: string;
  name: string;
  team: string;
  year: string;
  price: string;
  index: number;
}

const ProductCard = ({ image, name, team, year, price, index }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded bg-card border border-border/50 transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-[var(--shadow-gold)]">
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={image}
            alt={name}
            loading="lazy"
            width={800}
            height={960}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent p-5 pt-12">
          {year && <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-primary mb-1">{year}</p>}
          <h3 className="font-display text-base font-semibold tracking-wide">{name}</h3>
          <p className="text-xs text-muted-foreground mb-2">{team}</p>
          <p className="font-display text-lg font-bold text-gradient-gold">{price}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
