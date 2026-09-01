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
  /** Close overlays before following a breadcrumb link. */
  onNavigate?: () => void;
}

/** Automatisch kruimelpad: route + zoekopdracht + eventueel gekozen shirt. */
const FILTER_LABELS: Record<string, string> = {
  league: "League",
  country: "Country",
  letter: "Letter",
  decade: "Decade",
  colors: "Colour",
};

const Breadcrumbs = ({ current, base, onNavigate }: Props) => {
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  const query = params.get("q")?.trim();
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

  // Actieve filters als klikbare kruimels: elke link bevat de filters tot en met die stap.
  const filterPath = base?.length ? base[base.length - 1].to : pathname;
  const active = new URLSearchParams();
  if (query) {
    active.set("q", query);
    crumbs.push({ label: `Search: “${query}”`, to: `${filterPath}?${active.toString()}` });
  }
  Object.keys(FILTER_LABELS).forEach((key) => {
    const value = params.get(key)?.trim();
    if (!value) return;
    active.set(key, value);
    crumbs.push({
      label: `${FILTER_LABELS[key]}: ${value.split(",").join(", ")}`,
      to: `${filterPath}?${active.toString()}`,
    });
  });

  if (current) crumbs.push({ label: current });

  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <li>
          <Link
            to="/"
            onClick={onNavigate}
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
              {!c.to ? (
                <span className="font-medium text-foreground line-clamp-1" aria-current="page">
                  {c.label}
                </span>
              ) : (
                <Link
                  to={c.to}
                  onClick={onNavigate}
                  aria-current={last ? "page" : undefined}
                  className={`transition-colors hover:text-primary hover:underline ${
                    last ? "font-medium text-foreground" : ""
                  }`}
                >
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
