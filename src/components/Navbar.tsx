import { ShoppingBag, Menu, X, Heart, User, LogOut, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import CartDrawer from "./CartDrawer";
import ThemeToggle from "./ThemeToggle";
import CurrencySwitcher from "./CurrencySwitcher";
import AccentSwitcher from "./AccentSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { count, favorites } = useCart();
  const { user, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { t } = useTranslation();

  const navItems = [
    { label: t("nav.collection"), path: "/collectie" },
    { label: t("nav.retro", { defaultValue: "Retro" }), path: "/retro" },
    { label: t("nav.longSleeve", { defaultValue: "Long Sleeve" }), path: "/long-sleeve" },
    { label: "Shorts", path: "/shorts" },
    { label: "Full Kits", path: "/full-kits" },
    { label: t("nav.specialEdition"), path: "/special-edition" },
    { label: t("nav.about"), path: "/over-ons" },
  ];

  const IconActions = ({ inMenu = false }: { inMenu?: boolean }) => (
    <div className={inMenu ? "flex flex-wrap items-center gap-5" : "flex items-center gap-5"}>
      <CurrencySwitcher />
      <AccentSwitcher />
      <ThemeToggle />
      <Link
        to="/favorieten"
        onClick={() => setMobileOpen(false)}
        className="relative text-foreground hover:text-primary transition-colors"
        aria-label={t("nav.favorites")}
      >
        <Heart className={`h-5 w-5 ${favorites.size > 0 ? "fill-red-500 text-red-500" : ""}`} />
        {favorites.size > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
            {favorites.size}
          </span>
        )}
      </Link>
      <button
        onClick={() => { setCartOpen(true); setMobileOpen(false); }}
        className="relative text-foreground hover:text-primary transition-colors"
        aria-label={t("nav.cart")}
      >
        <ShoppingBag className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
            {count}
          </span>
        )}
      </button>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="text-foreground hover:text-primary transition-colors" aria-label={t("nav.account")}>
            <User className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem disabled className="text-xs text-muted-foreground">{user.email}</DropdownMenuItem>
            <DropdownMenuSeparator />
            {isAdmin && (
              <DropdownMenuItem onClick={() => { navigate("/admin"); setMobileOpen(false); }}>
                <ShieldCheck className="h-4 w-4 mr-2" />
                Manage orders
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="h-4 w-4 mr-2" />
              {t("nav.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <button
          onClick={() => { navigate("/auth"); setMobileOpen(false); }}
          className="text-foreground hover:text-primary transition-colors"
          aria-label={t("nav.login")}
        >
          <User className="h-5 w-5" />
        </button>
      )}
    </div>
  );

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/85 backdrop-blur-xl">
        <div className="container mx-auto flex h-14 sm:h-[4.5rem] items-center gap-4 px-3 sm:px-6 lg:gap-8">
          <Link to="/" className="shrink-0 font-display text-[11px] sm:text-base lg:text-lg font-bold tracking-wider sm:tracking-[0.18em] uppercase text-gradient-gold whitespace-nowrap">
            <span className="lg:hidden">HOFS</span>
            <span className="hidden lg:inline">The Home of Football Style</span>
          </Link>

          {/* Desktop nav links (center) */}
          <div className="hidden md:flex flex-1 min-w-0 items-center justify-center gap-1 overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`whitespace-nowrap rounded-full px-3 py-2 text-[11px] lg:text-xs font-medium tracking-[0.12em] uppercase transition-colors duration-300 ${
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile: horizontally scrollable nav links in place of icons */}
          <div className="md:hidden flex-1 min-w-0 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-medium tracking-wide uppercase ${
                    location.pathname === item.path ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop icon actions on the right */}
          <div className="hidden md:flex shrink-0 items-center gap-5 border-l border-border/60 pl-5">
            <IconActions />
          </div>


          {/* Mobile hamburger */}
          <button className="md:hidden text-foreground shrink-0" onClick={() => setMobileOpen(!mobileOpen)} aria-label="menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-border overflow-hidden bg-background"
            >
              <div className="flex flex-col gap-4 p-6">
                <IconActions inMenu />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
