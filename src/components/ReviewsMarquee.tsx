import { motion } from "framer-motion";
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

const ReviewCard = ({ name, text, rating }: { name: string; text: string; rating: number }) => (
  <div className="flex-shrink-0 w-[280px] bg-card border border-border rounded-lg p-5 mx-3">
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

  return (
    <section className="py-16 bg-background overflow-hidden">
      <div className="container mx-auto px-6 mb-8">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-center">
          Wat onze klanten <span className="text-gradient-gold">zeggen</span>
        </h2>
      </div>
      <div className="relative">
        <motion.div
          className="flex"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 30, ease: "linear" } }}
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
