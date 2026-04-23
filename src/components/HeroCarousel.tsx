import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import shirt2 from "@/assets/shirt-new-2.png";
import shirt4 from "@/assets/shirt-new-4.png";
import shirt6 from "@/assets/shirt-new-6.png";

const slides = [
  {
    title: "Special Editions",
    subtitle: "Luxe shirts, gemaakt om op te vallen.",
    cta: "Special Edition",
    href: "/special-edition",
    image: shirt6,
  },
  {
    title: "Nationale Trots",
    subtitle: "Draag de kleuren van je land — premium kwaliteit.",
    cta: "Bekijk Nationaal",
    href: "/collectie",
    image: shirt4,
  },
  {
    title: "Italië x Versace",
    subtitle: "Italiaans design, wereldwijd icoon.",
    cta: "Shop Now",
    href: "/collectie",
    image: shirt2,
  },
];

const HeroCarousel = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[idx];

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
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 h-full w-full object-cover opacity-40"
              />
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
                The Home of Football Style
              </p>
              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-2xl mb-3">
                {slide.title}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mb-6">
                {slide.subtitle}
              </p>
              <Link
                to={slide.href}
                className="inline-block px-6 py-3 rounded-full bg-background/90 backdrop-blur border border-primary/40 text-sm font-semibold text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {slide.cta}
              </Link>
            </motion.div>

            <div className="flex gap-2 mt-8">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === idx ? "w-8 bg-primary" : "w-4 bg-border"
                  }`}
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
