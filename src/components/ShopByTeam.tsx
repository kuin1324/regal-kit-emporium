import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { topTeams } from "@/lib/collection";
import { thumbSrc } from "@/lib/thumb";

const ShopByTeam = () => (
  <section className="py-12">
    <div className="container mx-auto px-6">
      <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-6">
        Popular clubs & countries
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-3 sm:gap-4">
        {topTeams.map((t, i) => (
          <motion.div
            key={t.team}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: Math.min(i, 10) * 0.03 }}
          >
            <Link
              to={`/collectie?q=${encodeURIComponent(t.team)}`}
              className="group flex flex-col items-center gap-2"
              aria-label={t.team}
            >
              <div className="aspect-square w-full overflow-hidden rounded-full border border-border/60 bg-card transition-all group-hover:border-primary/50 group-hover:shadow-[var(--shadow-gold)]">
                <img
                  src={thumbSrc(t.image)}
                  alt={t.team}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <span className="text-[11px] text-center font-medium tracking-wide text-muted-foreground group-hover:text-primary line-clamp-1">
                {t.team}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ShopByTeam;
