import { useRef, useState } from "react";
import { motion, useAnimationControls, PanInfo } from "framer-motion";
import { Star } from "lucide-react";

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

const CARD_WIDTH = 280 + 24; // width + margin
const TOTAL_WIDTH = reviews.length * CARD_WIDTH;

const ReviewCard = ({ name, text, rating }: { name: string; text: string; rating: number }) => (
  <div className="flex-shrink-0 w-[280px] bg-card border border-border rounded-lg p-5 mx-3 select-none">
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
  const doubled = [...reviews, ...reviews];
  const controls = useAnimationControls();
  const xRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const startAutoScroll = (fromX: number) => {
    // Normalize position within the loop
    let normalized = fromX % TOTAL_WIDTH;
    if (normalized > 0) normalized -= TOTAL_WIDTH;

    const remaining = Math.abs(normalized + TOTAL_WIDTH);
    const speed = TOTAL_WIDTH / 30; // pixels per second (matches 30s duration)
    const duration = remaining / speed;

    controls.set({ x: normalized });
    controls.start({
      x: -TOTAL_WIDTH,
      transition: { duration, ease: "linear", repeat: Infinity, repeatType: "loop" },
    });
  };

  const handleDragStart = () => {
    setIsDragging(true);
    controls.stop();
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false);
    // Get current position from the velocity-adjusted offset
    const currentX = xRef.current + info.offset.x;
    startAutoScroll(currentX);
  };

  return (
    <section className="py-16 bg-background overflow-hidden">
      <div className="container mx-auto px-6 mb-8">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-center">
          Wat onze klanten <span className="text-gradient-gold">zeggen</span>
        </h2>
      </div>
      <div className="relative cursor-grab active:cursor-grabbing">
        <motion.div
          className="flex"
          drag="x"
          dragConstraints={{ left: -TOTAL_WIDTH, right: 0 }}
          dragElastic={0.1}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          animate={controls}
          initial={{ x: 0 }}
          onUpdate={(latest) => {
            xRef.current = latest.x as number;
          }}
          onAnimationStart={() => {
            if (!isDragging) {
              // initial auto scroll
            }
          }}
          ref={(el) => {
            // Start auto-scroll on mount
            if (el && !isDragging) {
              startAutoScroll(0);
            }
          }}
        >
          {doubled.map((review, i) => (
            <ReviewCard key={i} {...review} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsMarquee;
