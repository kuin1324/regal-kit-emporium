import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { X } from "lucide-react";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";
import PaymentTestModeBanner from "@/components/PaymentTestModeBanner";

interface CheckoutModalProps {
  orderNumber: string;
  email: string;
  onClose: () => void;
}

const CheckoutModal = ({ orderNumber, email, onClose }: CheckoutModalProps) => {
  const fetchClientSecret = async (): Promise<string> => {
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        orderNumber,
        email,
        environment: getStripeEnvironment(),
        returnUrl: `${window.location.origin}/checkout/return?order=${orderNumber}&session_id={CHECKOUT_SESSION_ID}`,
      },
    });
    if (error || !data?.clientSecret) {
      throw new Error(error?.message || "Failed to start checkout");
    }
    return data.clientSecret;
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-background/90 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-xl border border-border bg-card p-4 shadow-xl">
        <button
          onClick={onClose}
          aria-label="Close checkout"
          className="absolute right-3 top-3 rounded p-2 hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
        <h2 className="mb-3 font-display text-lg font-bold uppercase tracking-wide">Payment</h2>
        <PaymentTestModeBanner />
        <div id="checkout" className="mt-3">
          <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
