import { thumbSrc } from "@/lib/thumb";
import ShirtImage from "@/components/ShirtImage";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, CheckCircle2, Mail, Truck } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "react-i18next";
import ProductDetailModal from "./ProductDetailModal";
import { useProductName } from "@/lib/productName";
import { calculateShipping, FREE_SHIPPING_FROM } from "@/lib/shipping";
import { useAuth } from "@/context/AuthContext";
import EmailPromptModal from "@/components/EmailPromptModal";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { items, removeItem, updateQuantity, total, count, clearCart } = useCart();
  const { format } = useCurrency();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [askMode, setAskMode] = useState<"pay" | "email" | null>(null);
  const [orderResult, setOrderResult] = useState<{ ok: boolean; orderNumber?: string } | null>(null);
  const { t } = useTranslation();
  const productName = useProductName();
  const { user } = useAuth();

  const shipping = calculateShipping(count);
  const grandTotal = total + shipping;
  const shirtsToFree = count > 0 && count < FREE_SHIPPING_FROM ? FREE_SHIPPING_FROM - count : 0;

  /** Maakt de bestelling server-side aan en geeft het bestelnummer terug. */
  const createOrder = async (email: string) => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase.functions.invoke("create-order", {
      body: {
        email,
        items: items.map(i => ({
          name: i.name,
          sku: i.sku ?? null,
          image: i.image ?? null,
          size: i.size,
          customName: i.customName ?? null,
          customNumber: i.customNumber ?? null,
          quantity: i.quantity,
        })),
      },
    });
    const orderNumber = (data as { orderNumber?: string } | null)?.orderNumber;
    if (error || !orderNumber) return null;
    return { orderNumber, supabase };
  };

  /** Vraag e-mail via de nette modal (of gebruik het account-adres). */
  const requestEmail = (mode: "pay" | "email") => {
    if (items.length === 0 || busy) return;
    if (user?.email) {
      void runOrder(mode, user.email);
      return;
    }
    setAskMode(mode);
  };

  const runOrder = async (mode: "pay" | "email", email: string) => {
    if (submittingRef.current || items.length === 0) return;
    submittingRef.current = true;
    setAskMode(null);
    setBusy(true);
    const created = await createOrder(email);
    setBusy(false);
    if (!created) {
      setOrderResult({ ok: false });
      return;
    }

    try {
      const { error: mailError } = await created.supabase.functions.invoke("send-order-email", {
        body: { orderNumber: created.orderNumber, email },
      });
      if (mailError) throw mailError;
    } catch {
      /* Bestelling staat opgeslagen; mail kan later alsnog verstuurd worden. */
    }

    setOrderResult({ ok: true, orderNumber: created.orderNumber });
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
                      <span>Subtotal</span>
                      <span>{format(total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping ({count} shirt{count !== 1 ? "s" : ""})</span>
                      <span className={shipping === 0 ? "font-bold text-gradient-gold" : "font-semibold"}>
                        {shipping === 0 ? "FREE" : format(shipping)}
                      </span>
                    </div>
                    {shirtsToFree > 0 && (
                      <p className="text-[11px] text-primary/80 italic pt-1">
                        + {shirtsToFree} more shirt{shirtsToFree !== 1 ? "s" : ""} for free shipping
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between items-center border-t border-border/50 pt-3">
                    <span className="text-sm font-semibold">{t("cart.total")}</span>
                    <span className="font-display text-xl font-bold text-gradient-gold">{format(grandTotal)}</span>
                  </div>

                  <button
                    onClick={() => requestEmail("email")}
                    disabled={busy}
                    className="w-full py-3 rounded border border-border font-semibold text-sm tracking-wide uppercase hover:bg-muted transition-colors disabled:opacity-60"
                  >
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
      <EmailPromptModal
        open={askMode !== null}
        confirmLabel="Send order"
        onCancel={() => setAskMode(null)}
        onConfirm={(email) => void runOrder(askMode ?? "email", email)}
      />
      <AnimatePresence>
        {orderResult && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm"
              onClick={() => setOrderResult(null)}
            />
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ type: "spring", damping: 22, stiffness: 260 }}
                className="pointer-events-auto w-full max-w-sm bg-card border border-border rounded-xl shadow-2xl p-8 text-center"
              >
                {orderResult.ok ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 10, stiffness: 200, delay: 0.1 }}
                      className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
                    >
                      <CheckCircle2 className="h-9 w-9 text-primary" />
                    </motion.div>
                    <h3 className="font-display text-xl font-bold uppercase tracking-wide">Order sent!</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Your order number:</p>
                    <p className="mt-1 font-display text-2xl font-bold text-gradient-gold tracking-wider">{orderResult.orderNumber}</p>
                    <div className="mt-6 space-y-2 text-left">
                      <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/40 p-3">
                        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <p className="text-xs text-muted-foreground leading-relaxed">We will email you the payment instructions (PayPal, Tikkie, etc.).</p>
                      </div>
                      <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/40 p-3">
                        <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <p className="text-xs text-muted-foreground leading-relaxed">Tracking details follow once your order ships. You can also check Track &amp; Trace.</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                      <X className="h-9 w-9 text-destructive" />
                    </div>
                    <h3 className="font-display text-xl font-bold uppercase tracking-wide">Order failed</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Your order could not be placed. Please try again or email us.</p>
                  </>
                )}
                <button
                  onClick={() => setOrderResult(null)}
                  className="mt-6 w-full rounded bg-primary py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
                >
                  OK
                </button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
      <ProductDetailModal productName={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  );
};

export default CartDrawer;
