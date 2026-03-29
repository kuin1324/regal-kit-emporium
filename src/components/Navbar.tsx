import { ShoppingBag, Menu, X, Heart } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";

const navItems = [
  { label: "Collectie", path: "/collectie" },
  { label: "Retro", path: "/retro" },
  { label: "Special Edition", path: "/special-edition" },
  { label: "Over Ons", path: "/over-ons" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const { count, favorites } = useCart();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/" className="font-display text-xl font-bold tracking-widest uppercase text-gradient-gold">
            The Home of Football Style
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`text-sm font-medium tracking-wide transition-colors duration-300 uppercase ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/favorieten" className="relative text-foreground hover:text-primary transition-colors">
              <Heart className={`h-5 w-5 ${favorites.size > 0 ? "fill-red-500 text-red-500" : ""}`} />
              {favorites.size > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {favorites.size}
                </span>
              )}
            </Link>
            <button onClick={() => setCartOpen(true)} className="relative text-foreground hover:text-primary transition-colors">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </button>
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
                    key={item.label}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`text-sm font-medium tracking-wide transition-colors uppercase ${
                      location.pathname === item.path
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
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
