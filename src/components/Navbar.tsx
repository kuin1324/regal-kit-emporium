import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <a href="/" className="font-display text-xl font-bold tracking-widest uppercase text-gradient-gold">
          Élite Kits
        </a>

        <div className="hidden md:flex items-center gap-8">
          {["Collectie", "Retro", "Limited Edition", "Over Ons"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium tracking-wide text-muted-foreground hover:text-primary transition-colors duration-300 uppercase"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="relative text-foreground hover:text-primary transition-colors">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
              0
            </span>
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
              {["Collectie", "Retro", "Limited Edition", "Over Ons"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm font-medium tracking-wide text-muted-foreground hover:text-primary transition-colors uppercase"
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
