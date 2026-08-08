import { useState } from "react";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallback?: string | null;
}

/**
 * Afbeelding met automatische fallback wanneer het bestand (nog) niet bestaat.
 * Laadt lui en decodeert async voor snellere paginaweergave.
 */
const ShirtImage = ({ src, fallback, alt = "", ...rest }: Props) => {
  const [current, setCurrent] = useState(src);
  const [failed, setFailed] = useState(false);

  return (
    <img
      {...rest}
      key={src}
      src={current}
      alt={alt}
      loading={rest.loading ?? "lazy"}
      decoding="async"
      onError={() => {
        if (!failed && fallback && current !== fallback) {
          setCurrent(fallback);
          setFailed(true);
        } else if (current !== "/placeholder.svg") {
          setCurrent("/placeholder.svg");
          setFailed(true);
        }
      }}
    />
  );
};

export default ShirtImage;
