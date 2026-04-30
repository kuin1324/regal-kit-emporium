import { Star } from "lucide-react";
import { useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

const reviews = [
  { name: "Jayden", text: "Super snelle levering en top kwaliteit shirt!", rating: 5 },
  { name: "Milan", text: "Precies zoals op de foto, heel blij mee!", rating: 5 },
  { name: "Noah", text: "Mooie collectie, zeker vaker bestellen.", rating: 5 },
  { name: "Sem", text: "Unieke shirts die je nergens anders vindt.", rating: 5 },
  { name: "Daan", text: "Goed ingepakt en snelle reactie op vragen.", rating: 5 },
  { name: "Lucas", text: "Top service en mooi shirt, aanrader!", rating: 5 },
  { name: "Levi", text: "Kwaliteit is echt geweldig voor de prijs.", rating: 4 },
  { name: "Finn", text: "Hele gave special editions, super tevreden.", rating: 5 },
];

const ReviewCard = ({ name, text, rating }: { name: string; text: string; rating: number }) => (
  <div className="flex-shrink-0 w-[260px] sm:w-[280px] bg-card border border-border rounded-lg p-5 mx-3 select-none">
    <div className="flex gap-0.5 mb-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
        />
      ))}
    </div>
    <p className="text-sm text-foreground mb-3 leading-relaxed">"{text}"</p>
    <p className="text-xs font-medium text-muted-foreground">— {name}</p>
  </div>
);

const ReviewsMarquee = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const speedRef = useRef(0.5);
  const isInteracting = useRef(false);

  const animate = useCallback(() => {
    const el = scrollRef.current;
    if (el && !isInteracting.current) {
      el.scrollLeft += speedRef.current;
      // Loop: when scrolled past half (the duplicated content), reset
      const halfWidth = el.scrollWidth / 2;
      if (el.scrollLeft >= halfWidth) {
        el.scrollLeft -= halfWidth;
      }
    }
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  const handleInteractionStart = () => {
    isInteracting.current = true;
  };

  const handleInteractionEnd = () => {
    // Resume after a short delay
    setTimeout(() => {
      isInteracting.current = false;
    }, 1500);
  };

  return (
    <section className="py-16 bg-background overflow-hidden">
      <div className="container mx-auto px-6 mb-8">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-center">
          {t("home.reviewsTitle")} <span className="text-gradient-gold">{t("home.reviewsTitleAccent")}</span>
        </h2>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide"
        style={{ touchAction: "pan-x" }}
        onMouseDown={handleInteractionStart}
        onMouseUp={handleInteractionEnd}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
      >
        {/* Duplicate reviews for seamless loop */}
        {[...reviews, ...reviews].map((review, i) => (
          <ReviewCard key={i} {...review} />
        ))}
      </div>
    </section>
  );
};

export default ReviewsMarquee;
