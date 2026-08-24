import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2 } from "lucide-react";

const CheckoutReturn = () => {
  const [params] = useSearchParams();
  const orderNumber = params.get("order");
  const sessionId = params.get("session_id");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto flex flex-col items-center px-6 py-24 text-center">
        <CheckCircle2 className="mb-4 h-12 w-12 text-primary" />
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide">
          {sessionId ? "Thank you for your order!" : "No payment information found"}
        </h1>
        {orderNumber && (
          <p className="mt-3 text-sm text-muted-foreground">
            Your order number is <span className="font-semibold text-foreground">{orderNumber}</span>. Keep it to
            follow your order.
          </p>
        )}
        <div className="mt-6 flex gap-3">
          <Link
            to="/track-trace"
            className="rounded bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-wide text-primary-foreground"
          >
            Track &amp; Trace
          </Link>
          <Link
            to="/collectie"
            className="rounded border border-border px-5 py-3 text-xs font-semibold uppercase tracking-wide"
          >
            Continue shopping
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutReturn;
