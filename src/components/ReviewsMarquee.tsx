import { Star } from "lucide-react";
import { useRef, useEffect, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  name: string;
  text: string;
  rating: number;
}

const ReviewCard = ({ name, text, rating }: Review) => (
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
  const { t } = useTranslation();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const loadReviews = useCallback(async () => {
    const { data } = await supabase
      .from("reviews")
      .select("name, body, rating")
      .order("created_at", { ascending: false })
      .limit(30);
    if (data) setReviews(data.map((r) => ({ name: r.name, text: r.body, rating: r.rating })));
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || body.trim().length < 3 || !orderNumber.trim() || !email.trim()) return;
    setStatus("sending");
    setErrorMsg("");
    const { data, error } = await supabase.functions.invoke("submit-review", {
      body: {
        orderNumber: orderNumber.trim(),
        email: email.trim(),
        name: name.trim().slice(0, 60),
        rating,
        body: body.trim().slice(0, 600),
      },
    });
    const failure = error || (data && (data as { error?: string }).error);
    if (failure) {
      const code = typeof failure === "string" ? failure : "";
      setStatus("error");
      setErrorMsg(
        code === "already_reviewed"
          ? "You already left a review for this order."
          : "We could not find that order. Check your order number and email address.",
      );
      return;
    }
    setName("");
    setBody("");
    setOrderNumber("");
    setEmail("");
    setRating(5);
    setStatus("done");
    loadReviews();
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const speedRef = useRef(0.5);
  const isInteracting = useRef(false);

  const animate = useCallback(() => {
    const el = scrollRef.current;
    if (el && !isInteracting.current) {
      el.scrollLeft += speedRef.current;
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
    setTimeout(() => {
      isInteracting.current = false;
    }, 1500);
  };

  const inputClass =
    "w-full rounded border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

  return (
    <section className="py-16 bg-background overflow-hidden">
      <div className="container mx-auto px-6 mb-6">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-center">
          {t("home.reviewsTitle")} <span className="text-gradient-gold">{t("home.reviewsTitleAccent")}</span>
        </h2>
        <p className="mt-3 text-center text-xs text-muted-foreground max-w-xl mx-auto">
          Only customers with a real order can leave a review, so everything you read here comes from a verified
          purchase.
        </p>
      </div>

      {reviews.length > 0 ? (
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
          {(reviews.length >= 4 ? [...reviews, ...reviews] : reviews).map((review, i) => (
            <ReviewCard key={i} {...review} />
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          No reviews yet — be the first customer to share your experience.
        </p>
      )}

      <div className="container mx-auto px-6 mt-10">
        <form onSubmit={submit} className="mx-auto max-w-xl rounded-lg border border-border bg-card p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">Leave your review</h3>
          <p className="text-xs text-muted-foreground">
            Enter the order number and email address you used when ordering to verify your purchase.
          </p>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} type="button" onClick={() => setRating(i + 1)} aria-label={`${i + 1} stars`}>
                <Star className={`h-6 w-6 ${i < rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              value={orderNumber}
              maxLength={40}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Order number"
              className={inputClass}
            />
            <input
              type="email"
              value={email}
              maxLength={255}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email used for the order"
              className={inputClass}
            />
          </div>
          <input
            type="text"
            value={name}
            maxLength={60}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={inputClass}
          />
          <textarea
            value={body}
            maxLength={600}
            rows={3}
            onChange={(e) => setBody(e.target.value)}
            placeholder="How was your shirt?"
            className={inputClass}
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded bg-primary py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Post review"}
          </button>
          {status === "done" && <p className="text-xs text-primary">Thanks for your review!</p>}
          {status === "error" && <p className="text-xs text-destructive">{errorMsg}</p>}
        </form>
      </div>
    </section>
  );
};

export default ReviewsMarquee;
