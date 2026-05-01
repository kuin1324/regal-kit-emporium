import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "react-i18next";
import ProductDetailModal from "./ProductDetailModal";
import { useProductName } from "@/lib/productName";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const { t } = useTranslation();
  const productName = useProductName();

  const handleOrder = () => {
    if (items.length === 0) return;
    const lines = items.map(i => `🏷️ ${productName(i.name)} (${i.size}) x${i.quantity} — €${i.price * i.quantity}`).join("\n");
    const message = `${t("cart.orderGreeting")}\n\n${lines}\n\n💰 ${t("cart.orderTotal")}: €${total}`;
    window.open(`https://wa.me/31612345678?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={onClose} />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="font-display text-lg font-bold tracking-wide uppercase">{t("cart.title")}</h2>
                <button onClick={onClose} className="p-2 hover:bg-muted rounded transition-colors"><X className="h-5 w-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <ShoppingBag className="h-12 w-12 mb-4 opacity-30" />
                    <p className="text-sm">{t("cart.empty")}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={`${item.name}-${item.size}`} className="flex gap-4 border border-border rounded p-3">
                        <img src={item.image} alt={productName(item.name)} className="w-20 h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setSelectedProduct(item.name)} />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold truncate cursor-pointer hover:text-primary transition-colors" onClick={() => setSelectedProduct(item.name)}>{productName(item.name)}</h3>
                          <p className="text-xs text-muted-foreground">{t("cart.size")}: {item.size}</p>
                          <p className="text-sm font-bold text-gradient-gold mt-1">€{item.price * item.quantity}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => updateQuantity(item.name, item.size, item.quantity - 1)} className="p-1 hover:bg-muted rounded"><Minus className="h-3 w-3" /></button>
                            <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.name, item.size, item.quantity + 1)} className="p-1 hover:bg-muted rounded"><Plus className="h-3 w-3" /></button>
                            <button onClick={() => removeItem(item.name, item.size)} className="p-1 hover:bg-destructive/20 rounded ml-auto"><Trash2 className="h-3 w-3 text-destructive" /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-border p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">{t("cart.total")}</span>
                    <span className="font-display text-xl font-bold text-gradient-gold">€{total}</span>
                  </div>
                  <button onClick={handleOrder} className="w-full py-3 rounded bg-primary text-primary-foreground font-semibold text-sm tracking-wide uppercase hover:bg-primary/90 transition-colors">
                    {t("cart.checkout")}
                  </button>
                  <button onClick={clearCart} className="w-full py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {t("cart.clear")}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <ProductDetailModal productName={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  );
};

export default CartDrawer;
