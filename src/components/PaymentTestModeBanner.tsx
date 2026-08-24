const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN;

export function PaymentTestModeBanner() {
  if (!clientToken) {
    return (
      <div className="w-full border-b border-destructive/40 bg-destructive/10 px-4 py-2 text-center text-xs text-destructive">
        Live checkout is not configured yet. Complete go-live to accept real payments.
      </div>
    );
  }
  if (clientToken.startsWith("pk_test_")) {
    return (
      <div className="w-full border-b border-primary/40 bg-primary/10 px-4 py-2 text-center text-xs text-primary">
        All payments in the preview are test payments.
      </div>
    );
  }
  return null;
}

export default PaymentTestModeBanner;
