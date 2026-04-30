import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import shirt2 from "@/assets/shirt-new-2.png";
import shirt4 from "@/assets/shirt-new-4.png";
import shirt6 from "@/assets/shirt-new-6.png";

const slidesData = [
  { titleKey: "home.slides.specialTitle", subtitleKey: "home.slides.specialSubtitle", ctaKey: "home.slides.specialCta", href: "/special-edition", image: shirt6 },
  { titleKey: "home.slides.nationalTitle", subtitleKey: "home.slides.nationalSubtitle", ctaKey: "home.slides.nationalCta", href: "/collectie", image: shirt4 },
  { titleKey: "home.slides.italyTitle", subtitleKey: "home.slides.italySubtitle", ctaKey: "home.slides.italyCta", href: "/collectie", image: shirt2 },
];

const HeroCarousel = () => {
  const [idx, setIdx] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const tm = setInterval(() => setIdx((i) => (i + 1) % slidesData.length), 5000);
    return () => clearInterval(tm);
  }, []);

  const slide = slidesData[idx];

  return (
    <section className="px-4 sm:px-6 pt-24">
      <div className="container mx-auto">
        <div className="relative h-[60vh] min-h-[420px] max-h-[560px] w-full overflow-hidden rounded-2xl border border-border/50 bg-hero-gradient">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <img src={slide.image} alt={t(slide.titleKey)} className="absolute inset-0 h-full w-full object-cover opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 h-full flex flex-col items-center justify-end pb-12 px-6 text-center">
            <motion.div
              key={`text-${idx}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-xs font-medium tracking-[0.3em] uppercase text-primary mb-3">
                {t("home.tagline")}
              </p>
              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-2xl mb-3">
                {t(slide.titleKey)}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mb-6">
                {t(slide.subtitleKey)}
              </p>
              <Link
                to={slide.href}
                className="inline-block px-6 py-3 rounded-full bg-background/90 backdrop-blur border border-primary/40 text-sm font-semibold text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {t(slide.ctaKey)}
              </Link>
            </motion.div>

            <div className="flex gap-2 mt-8">
              {slidesData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-primary" : "w-4 bg-border"}`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
