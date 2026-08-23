import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallback?: string | null;
  /** Toon een nette placeholder wanneer de foto niet geladen kan worden. */
  showPlaceholder?: boolean;
}

/**
 * Afbeelding met skeleton tijdens laden, fallback-bron en nette
 * placeholder bij een fout. Laadt lui en decodeert async.
 */
const ShirtImage = ({ src, fallback, alt = "", showPlaceholder = true, className = "", ...rest }: Props) => {
  const [current, setCurrent] = useState(src);
  const [failed, setFailed] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCurrent(src);
    setFailed(false);
    setUnavailable(false);
    setLoaded(false);
  }, [src]);

  if (unavailable) {
    if (!showPlaceholder) return null;
    return (
      <div className={`flex h-full w-full items-center justify-center bg-muted ${className}`} role="img" aria-label={alt}>
        <ImageOff className="h-6 w-6 text-muted-foreground/60" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {!loaded && <Skeleton className="absolute inset-0 h-full w-full rounded-none" />}
      <img
        {...rest}
        key={src}
        src={current}
        alt={alt}
        loading={rest.loading ?? "lazy"}
        decoding="async"
        onLoad={(e) => {
          setLoaded(true);
          rest.onLoad?.(e);
        }}
        onError={() => {
          if (!failed && fallback && current !== fallback) {
            setCurrent(fallback);
            setFailed(true);
          } else setUnavailable(true);
        }}
        className={`${className} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
};

export default ShirtImage;
