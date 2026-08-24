// Maakt een Stripe Embedded Checkout-sessie voor een bestaande bestelling.
// Bedragen komen uit de opgeslagen bestelling (server-side berekend), nooit uit de browser.
import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

interface OrderItem {
  name: string;
  sku: string;
  size: string;
  customName: string | null;
  customNumber: string | null;
  quantity: number;
  price: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json().catch(() => null);
    const orderNumber = String((body as { orderNumber?: string })?.orderNumber ?? "").trim();
    const environment = (body as { environment?: string })?.environment;
    const returnUrl = String((body as { returnUrl?: string })?.returnUrl ?? "");
    const email = String((body as { email?: string })?.email ?? "").trim().toLowerCase().slice(0, 255);

    if (!/^HOFS-[A-Z0-9]{4,12}$/.test(orderNumber)) return json({ error: "Ongeldig bestelnummer" }, 400);
    if (environment !== "sandbox" && environment !== "live") return json({ error: "Ongeldige omgeving" }, 400);
    if (!/^https?:\/\//.test(returnUrl)) return json({ error: "Ongeldige return url" }, 400);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "Ongeldig e-mailadres" }, 400);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    // Twee-factor lookup: bestelnummer + e-mail moeten beide kloppen (zoals track_order).
    const { data: order, error } = await admin
      .from("orders")
      .select("order_number, email, items, shipping, total")
      .eq("order_number", orderNumber)
      .eq("email", email)
      .maybeSingle();

    if (error || !order) return json({ error: "Bestelling niet gevonden" }, 404);

    const items = (order.items ?? []) as OrderItem[];
    if (!items.length) return json({ error: "Bestelling is leeg" }, 400);

    const stripe = createStripeClient(environment as StripeEnv);

    const lineItems = items.map((i) => {
      const extras = [
        i.size ? `Size ${i.size}` : null,
        i.customName ? `Name ${i.customName}` : null,
        i.customNumber ? `Number ${i.customNumber}` : null,
      ].filter(Boolean).join(" · ");
      return {
        price_data: {
          currency: "eur",
          product_data: { name: `${i.name}${extras ? ` (${extras})` : ""}` },
          unit_amount: Math.round(Number(i.price) * 100),
        },
        quantity: i.quantity,
      };
    });

    const shipping = Number(order.shipping ?? 0);
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: "Shipping" },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: returnUrl,
      customer_email: order.email ?? undefined,
      payment_intent_data: { description: `Order ${order.order_number}` },
      metadata: { orderNumber: order.order_number },
    });

    return json({ clientSecret: session.client_secret });
  } catch (e) {
    console.error("create-checkout error:", e instanceof Error ? e.message : e);
    return json({ error: "Checkout kon niet worden gestart" }, 500);
  }
});
