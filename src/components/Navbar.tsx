import { ShoppingBag, Menu, X, Heart, User, LogOut } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import CartDrawer from "./CartDrawer";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
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
  const { t } = useTranslation();

  const navItems = [
    { label: t("nav.collection"), path: "/collectie" },
    { label: t("nav.retro"), path: "/retro" },
    { label: t("nav.specialEdition"), path: "/special-edition" },
    { label: t("nav.stock", { defaultValue: "Voorraad" }), path: "/voorraad" },
    { label: t("nav.about"), path: "/over-ons" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6 gap-2">
          <Link to="/" className="font-display text-[11px] sm:text-xl font-bold tracking-wider sm:tracking-widest uppercase text-gradient-gold truncate max-w-[42%] sm:max-w-none">
            <span className="sm:hidden">HOFS</span>
            <span className="hidden sm:inline">The Home of Football Style</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium tracking-wide transition-colors duration-300 uppercase ${
                  location.pathname === item.path ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link to="/favorieten" className="relative text-foreground hover:text-primary transition-colors" aria-label={t("nav.favorites")}>
              <Heart className={`h-5 w-5 ${favorites.size > 0 ? "fill-red-500 text-red-500" : ""}`} />
              {favorites.size > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {favorites.size}
                </span>
              )}
            </Link>
            <button onClick={() => setCartOpen(true)} className="relative text-foreground hover:text-primary transition-colors" aria-label={t("nav.cart")}>
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
                  <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="text-foreground hover:text-primary transition-colors"
                aria-label={t("nav.login")}
              >
                <User className="h-5 w-5" />
              </button>
            )}

            <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
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
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`text-sm font-medium tracking-wide transition-colors uppercase ${
                      location.pathname === item.path ? "text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                {!user && (
                  <Link
                    to="/auth"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium tracking-wide uppercase text-primary"
                  >
                    {t("nav.login")}
                  </Link>
                )}
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
