import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { allCollectieItems } from "@/lib/collection";
import { collectLeagues } from "@/lib/productFilters";

const leagues = [
  { key: "eredivisie", emoji: "🇳🇱", href: "/collectie?league=Eredivisie" },
  { key: "serieA", emoji: "🇮🇹", href: "/collectie?league=Serie%20A" },
  { key: "laLiga", emoji: "🇪🇸", href: "/collectie?league=La%20Liga" },
  { key: "ligue1", emoji: "🇫🇷", href: "/collectie?league=Ligue%201" },
  { key: "national", emoji: "🌍", href: "/collectie?league=Nationaal" },
  { key: "special", emoji: "⭐", href: "/special-edition" },
];

/** Competities uit de data die nog niet in de hoofdtegels staan. */
const KNOWN = new Set(["Eredivisie", "Serie A", "La Liga", "Ligue 1", "Nationaal", "Special"]);
const extraLeagues = collectLeagues(allCollectieItems).filter((l) => !KNOWN.has(l));

const ShopByLeague = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            {t("home.shopByLeague")}
          </h2>
          {extraLeagues.length > 0 && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors hover:border-primary/50 hover:text-primary"
              aria-expanded={expanded}
            >
              {expanded ? "Show less" : "More leagues"}
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
        </div>
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
          {expanded &&
            extraLeagues.map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(i, 12) * 0.03 }}
              >
                <Link
                  to={`/collectie?league=${encodeURIComponent(name)}`}
                  className="group flex flex-col items-center justify-center aspect-square rounded-xl bg-card border border-border/50 hover:border-primary/40 transition-all hover:shadow-[var(--shadow-gold)]"
                >
                  <span className="text-4xl mb-2 transition-transform group-hover:scale-110">
                    🏆
                  </span>
                  <span className="text-xs font-medium tracking-wide text-center px-2">
                    {name}
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
