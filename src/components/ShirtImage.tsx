import { useEffect, useRef, useState } from "react";
import { ImageOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallback?: string | null;
  /** Toon een nette placeholder wanneer de foto niet geladen kan worden. */
  showPlaceholder?: boolean;
}

/**
 * Afbeelding die pas laadt wanneer ze bijna in beeld komt. Het grid gebruikt
 * kleine WebP-thumbnails, waardoor de browser downloads betrouwbaarder kan
 * plannen dan een globale JavaScript-wachtrij. Mislukte requests vallen terug
 * op het origineel en worden daarna automatisch opnieuw geprobeerd.
 */
const MAX_RETRIES = 6;

const ShirtImage = ({ src, fallback, alt = "", showPlaceholder = true, className = "", ...rest }: Props) => {
  const [current, setCurrent] = useState(src);
  const [failed, setFailed] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [bust, setBust] = useState(0);
  const [start, setStart] = useState(false);
  const retries = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrent(src);
    setFailed(false);
    setUnavailable(false);
    setLoaded(false);
    setBust(0);
    retries.current = 0;
  }, [src]);

  // Pas laden zodra de foto (bijna) in beeld is.
  useEffect(() => {
    const el = wrapper.current;
    if (!el || start) return;
    if (typeof IntersectionObserver === "undefined") {
      setStart(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStart(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [start]);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Vangnet voor requests die zonder load/error-event blijven hangen.
  useEffect(() => {
    if (!start || loaded || unavailable) return;
    const id = setTimeout(() => {
      if (retries.current < MAX_RETRIES) {
        retries.current += 1;
        setBust(Date.now());
      } else {
        setUnavailable(true);
      }
    }, 12000);
    return () => clearTimeout(id);
  }, [start, current, loaded, unavailable, bust]);


  // Handmatige "Reload photos"-knop: altijd opnieuw proberen.
  useEffect(() => {
    const reload = () => {
      retries.current = 0;
      setUnavailable(false);
      setFailed(false);
      setCurrent(src);
      setStart(true);
      setBust(Date.now());
    };
    window.addEventListener("shirts:refresh", reload);
    return () => window.removeEventListener("shirts:refresh", reload);
  }, [src]);

  // Opgegeven foto's nog eens proberen zodra de verbinding of het tabblad terug is.
  useEffect(() => {
    if (!unavailable) return;
    const again = () => {
      retries.current = 0;
      setUnavailable(false);
      setBust(Date.now());
    };
    window.addEventListener("online", again);
    window.addEventListener("focus", again);
    return () => {
      window.removeEventListener("online", again);
      window.removeEventListener("focus", again);
    };
  }, [unavailable]);

  if (unavailable) {
    if (!showPlaceholder) return null;
    return (
      <div className={`flex h-full w-full items-center justify-center bg-muted ${className}`} role="img" aria-label={alt}>
        <ImageOff className="h-6 w-6 text-muted-foreground/60" />
      </div>
    );
  }

  return (
    <div ref={wrapper} className="relative h-full w-full">
      {!loaded && <Skeleton className="absolute inset-0 h-full w-full rounded-none" />}
      {start && (
        <img
          {...rest}
          key={src}
          src={bust ? `${current}${current.includes("?") ? "&" : "?"}r=${bust}` : current}
          alt={alt}
          decoding="async"
          onLoad={(e) => {
            clearTimeout(timer.current);
            setLoaded(true);
            rest.onLoad?.(e);
          }}
          onError={() => {
            clearTimeout(timer.current);
            if (!failed && fallback && current !== fallback) {
              setCurrent(fallback);
              setFailed(true);
              setBust(0);
              retries.current = 0;
            } else if (fallback && current === fallback && src !== fallback) {
              // Terug naar de originele bron als de fallback ook faalt.
              setCurrent(src);
              retries.current = 0;
              setBust(Date.now());
            } else if (retries.current < MAX_RETRIES) {
              const n = ++retries.current;
              clearTimeout(timer.current);
              timer.current = setTimeout(() => setBust(Date.now()), 500 * n);
            } else {
              setUnavailable(true);
            }
          }}
          className={`${className} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
};

export default ShirtImage;
