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

/** Automatisch kruimelpad op basis van de huidige route. */
const Breadcrumbs = () => {
  const { pathname } = useLocation();
  if (pathname === "/") return null;
  const segments = pathname.split("/").filter(Boolean);

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
        {segments.map((seg, i) => {
          const to = "/" + segments.slice(0, i + 1).join("/");
          const label = LABELS[seg] ?? decodeURIComponent(seg);
          const last = i === segments.length - 1;
          return (
            <li key={to} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 opacity-50" />
              {last ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {label}
                </span>
              ) : (
                <Link to={to} className="transition-colors hover:text-primary">
                  {label}
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
