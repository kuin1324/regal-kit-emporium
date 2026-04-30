import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const leagues = [
  { key: "eredivisie", emoji: "🇳🇱", href: "/collectie" },
  { key: "serieA", emoji: "🇮🇹", href: "/collectie" },
  { key: "laLiga", emoji: "🇪🇸", href: "/collectie" },
  { key: "ligue1", emoji: "🇫🇷", href: "/collectie" },
  { key: "national", emoji: "🌍", href: "/collectie" },
  { key: "special", emoji: "⭐", href: "/special-edition" },
];

const ShopByLeague = () => {
  const { t } = useTranslation();
  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          {t("home.shopByLeague")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {leagues.map((l, i) => (
            <motion.div
              key={l.key}
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
                  {t(`leagues.${l.key}`)}
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
