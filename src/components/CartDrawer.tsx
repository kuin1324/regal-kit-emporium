import { thumbSrc } from "@/lib/thumb";
import ShirtImage from "@/components/ShirtImage";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "react-i18next";
import ProductDetailModal from "./ProductDetailModal";
import { useProductName } from "@/lib/productName";
import { calculateShipping, FREE_SHIPPING_FROM } from "@/lib/shipping";
import { useAuth } from "@/context/AuthContext";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { items, removeItem, updateQuantity, total, count, clearCart } = useCart();
  const { format } = useCurrency();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const { t } = useTranslation();
  const productName = useProductName();
  const { user } = useAuth();

  const shipping = calculateShipping(count);
  const grandTotal = total + shipping;
  const shirtsToFree = count > 0 && count < FREE_SHIPPING_FROM ? FREE_SHIPPING_FROM - count : 0;

  const handleEmailOrder = async () => {
    if (items.length === 0) return;
    const email = user?.email || window.prompt("Wat is je e-mailadres? (nodig voor track & trace)")?.trim();
    if (!email) return;

    const { supabase } = await import("@/integrations/supabase/client");

    // De bestelling wordt server-side aangemaakt: prijzen, verzendkosten en
    // totalen worden daar opnieuw berekend, niet overgenomen uit de browser.
    const { data, error } = await supabase.functions.invoke("create-order", {
      body: {
        email,
        items: items.map(i => ({
          name: i.name,
          sku: i.sku ?? null,
          size: i.size,
          customName: i.customName ?? null,
          customNumber: i.customNumber ?? null,
          quantity: i.quantity,
        })),
      },
    });

    const orderNumber = (data as { orderNumber?: string } | null)?.orderNumber;
    if (error || !orderNumber) {
      alert("❌ Bestelling kon niet worden geplaatst. Probeer het opnieuw of mail ons.");
      return;
    }

    try {
      const { error: mailError } = await supabase.functions.invoke("send-order-email", {
        body: { orderNumber, email },
      });
      if (mailError) throw mailError;
    } catch {
      /* Bestelling staat opgeslagen; mail kan later alsnog verstuurd worden. */
    }

    alert(`✅ Bestelling verzonden!\nJe bestelnummer: ${orderNumber}\nVolg je bestelling via Track & Trace.`);
    clearCart();
    onClose();
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
                      <div key={item.id} className="flex gap-4 border border-border rounded p-3">
                        <div className="w-20 h-24 shrink-0">
                          <ShirtImage src={thumbSrc(item.image)} fallback={item.image} alt={productName(item.name)} width={80} height={96} loading="lazy" className="w-full h-full object-cover rounded cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setSelectedProduct(item.name)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold truncate cursor-pointer hover:text-primary transition-colors" onClick={() => setSelectedProduct(item.name)}>{productName(item.name)}</h3>
                          <p className="text-xs text-muted-foreground">{t("cart.size")}: {item.size}</p>
                          <p className="text-sm font-bold text-gradient-gold mt-1">{format(item.price * item.quantity)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-muted rounded"><Minus className="h-3 w-3" /></button>
                            <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-muted rounded"><Plus className="h-3 w-3" /></button>
                            <button onClick={() => removeItem(item.id)} className="p-1 hover:bg-destructive/20 rounded ml-auto"><Trash2 className="h-3 w-3 text-destructive" /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-border p-6 space-y-3">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotaal</span>
                      <span>{format(total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verzending ({count} shirt{count !== 1 ? "s" : ""})</span>
                      <span className={shipping === 0 ? "font-bold text-gradient-gold" : "font-semibold"}>
                        {shipping === 0 ? "GRATIS" : format(shipping)}
                      </span>
                    </div>
                    {shirtsToFree > 0 && (
                      <p className="text-[11px] text-primary/80 italic pt-1">
                        + {shirtsToFree} shirt{shirtsToFree !== 1 ? "s" : ""} voor gratis verzending
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between items-center border-t border-border/50 pt-3">
                    <span className="text-sm font-semibold">{t("cart.total")}</span>
                    <span className="font-display text-xl font-bold text-gradient-gold">{format(grandTotal)}</span>
                  </div>

                  <button onClick={handleEmailOrder} className="w-full py-3 rounded bg-primary text-primary-foreground font-semibold text-sm tracking-wide uppercase hover:bg-primary/90 transition-colors">
                    {t("cart.checkoutEmail")}
                  </button>
                  <div className="border-t border-border/50 pt-2">
                    <p className="text-[10px] text-muted-foreground text-center leading-relaxed">{t("cart.paymentNote")}</p>
                  </div>
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
