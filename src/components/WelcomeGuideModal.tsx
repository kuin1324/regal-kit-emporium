import { useEffect, useState } from "react";
import { X, Search, Heart, ShoppingBag, SlidersHorizontal, MessageCircle, Moon, Truck, Star, Sparkles, MousePointerClick, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { allCollectieItems } from "@/lib/collection";
import { cdnSrc } from "@/lib/cdn";

const STORAGE_KEY = "hofs-welcome-guide-dismissed";

const features = [
  { icon: Search, title: "Search the collection", description: "Find shirts by team, country, league or name." },
  { icon: SlidersHorizontal, title: "Filter and sort", description: "Narrow your results by colour, decade and price." },
  { icon: Sparkles, title: "View shirt details", description: "Open a shirt for its photos, name and available options." },
  { icon: MousePointerClick, title: "Select several shirts", description: "Ctrl-click or drag a box over shirts to pick many at once, then favourite or add them all to your basket." },
  { icon: Navigation, title: "Clickable breadcrumb trail", description: "Tap any step in the breadcrumb path to jump straight back to that page, search or filter." },
  { icon: Heart, title: "Save favourites", description: "Like shirts and order your favourites whenever you are ready." },
  { icon: ShoppingBag, title: "Build your basket", description: "Choose a size and add a name and number to each shirt." },
  { icon: Truck, title: "Order and track", description: "Complete your order and follow delivery with Track & Trace." },
  { icon: MessageCircle, title: "Ask the chat", description: "Get help while browsing with the chat assistant." },
  { icon: Moon, title: "Choose your view", description: "Switch theme, currency and accent colour from the top bar." },
  { icon: Star, title: "Leave a review", description: "After your order, share your experience with the community." },
];

const WelcomeGuideModal = () => {
  const [open, setOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const featureImage = allCollectieItems[0]?.image;

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) !== "1") setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // The guide still closes when storage is unavailable.
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="welcome-guide-title">
      <div className="relative max-h-[min(900px,calc(100vh-2rem))] w-full max-w-5xl overflow-y-auto rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
        <Button
          variant="ghost"
          size="icon"
          onClick={dismiss}
          aria-label="Close welcome guide"
          className="absolute right-3 top-3 z-10 bg-background/80 text-foreground hover:bg-background"
        >
          <X />
        </Button>

        <div className="grid md:grid-cols-[0.85fr_1.15fr]">
          <div className="relative min-h-64 overflow-hidden bg-hero-gradient md:min-h-full">
            {!imageError && featureImage ? (
              <img
                src={cdnSrc(featureImage)}
                alt="Football shirt from The Home of Football Style collection"
                className="absolute inset-0 h-full w-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-primary">
                <Sparkles className="h-12 w-12" aria-hidden="true" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-left">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-primary">The Home of Football Style</p>
              <p className="font-display text-2xl font-bold text-foreground">Find your next shirt.</p>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-primary">Welcome</p>
            <h2 id="welcome-guide-title" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Everything you can do here</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Browse the collection, personalise your shirt and find the details you need before ordering.</p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {features.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-3 border-t border-border/70 pt-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="gold" onClick={dismiss} className="mt-8 w-full sm:w-auto">
              Start browsing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeGuideModal;
