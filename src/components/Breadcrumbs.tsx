import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const LABELS: Record<string, string> = {
  collectie: "Collection",
  "special-edition": "Special Edition",
  retro: "Retro",
  "long-sleeve": "Long Sleeve",
  shorts: "Shorts",
  "full-kits": "Full Kits",
  favorieten: "Favorites",
  "over-ons": "About Us",
  admin: "Admin",
  auth: "Login",
  "track-trace": "Track & Trace",
};

interface Props {
  /** Extra crumb at the end, e.g. the product you clicked on. */
  current?: string;
  /** Render without relying on the route (used inside the product modal). */
  base?: { label: string; to: string }[];
}

/** Automatisch kruimelpad: route + zoekopdracht + eventueel gekozen shirt. */
const Breadcrumbs = ({ current, base }: Props) => {
  const { pathname, search } = useLocation();
  const query = new URLSearchParams(search).get("q")?.trim();
  if (pathname === "/" && !current && !base) return null;

  const crumbs: { label: string; to?: string }[] = [];

  if (base) {
    base.forEach((b) => crumbs.push({ label: b.label, to: b.to }));
  } else {
    const segments = pathname.split("/").filter(Boolean);
    segments.forEach((seg, i) => {
      crumbs.push({
        label: LABELS[seg] ?? decodeURIComponent(seg),
        to: "/" + segments.slice(0, i + 1).join("/"),
      });
    });
  }

  if (query) crumbs.push({ label: `Search: “${query}”`, to: `${pathname}?q=${encodeURIComponent(query)}` });
  if (current) crumbs.push({ label: current });

  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 transition-colors hover:text-primary"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
        </li>
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 opacity-50" />
              {last || !c.to ? (
                <span className="font-medium text-foreground line-clamp-1" aria-current="page">
                  {c.label}
                </span>
              ) : (
                <Link to={c.to} className="transition-colors hover:text-primary">
                  {c.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
