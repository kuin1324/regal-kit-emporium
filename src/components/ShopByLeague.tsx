import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const leagues = [
  { name: "Eredivisie", emoji: "🇳🇱", href: "/collectie" },
  { name: "Serie A", emoji: "🇮🇹", href: "/collectie" },
  { name: "La Liga", emoji: "🇪🇸", href: "/collectie" },
  { name: "Ligue 1", emoji: "🇫🇷", href: "/collectie" },
  { name: "Nationaal", emoji: "🌍", href: "/collectie" },
  { name: "Special", emoji: "⭐", href: "/special-edition" },
];

const ShopByLeague = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Shop by league
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {leagues.map((l, i) => (
            <motion.div
              key={l.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                to={l.href}
                className="group flex flex-col items-center justify-center aspect-square rounded-xl bg-card border border-border/50 hover:border-primary/40 transition-all hover:shadow-[var(--shadow-gold)]"
              >
                <span className="text-4xl mb-2 transition-transform group-hover:scale-110">
                  {l.emoji}
                </span>
                <span className="text-xs font-medium tracking-wide text-center px-2">
                  {l.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByLeague;
