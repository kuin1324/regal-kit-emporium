// Maakt een bestelling aan met server-side berekende prijzen.
// Prijzen, verzendkosten en pre-order tellers worden NOOIT van de client vertrouwd.
import { createClient } from "npm:@supabase/supabase-js@2";
import catalog from "../_shared/price-catalog.json" with { type: "json" };

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type CatalogEntry = { price: number; name: string; nameKey: string | null; availability: string };
const CATALOG = catalog as Record<string, CatalogEntry>;

// Naam-index voor items zonder sku.
const BY_NAME = new Map<string, { sku: string; entry: CatalogEntry }>();
for (const [sku, entry] of Object.entries(CATALOG)) {
  const key = entry.name.trim().toLowerCase();
  if (!BY_NAME.has(key)) BY_NAME.set(key, { sku, entry });
}

const CUSTOM_PRICE = 5;
const MAX_ITEMS = 50;
const MAX_QTY = 20;

function calculateShipping(count: number): number {
  if (count <= 0) return 0;
  if (count <= 2) return 5;
  if (count <= 5) return 3;
  return 0;
}

/** Verwijdert een personalisatie-suffix zoals " [NAAM #10]" uit de itemnaam. */
function baseName(name: string): string {
  return name.replace(/\s*\[[^\]]*\]\s*$/, "").trim();
}

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const payload = await req.json().catch(() => null);
    if (!payload || typeof payload !== "object") {
      return bad("Ongeldige aanvraag");
    }
    const { email, items } = payload as { email?: unknown; items?: unknown };

    const mail = clean(email, 255).toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) return bad("Ongeldig e-mailadres");

    if (!Array.isArray(items) || items.length === 0) return bad("Winkelwagen is leeg");
    if (items.length > MAX_ITEMS) return bad("Te veel artikelen");

    // Optioneel: ingelogde gebruiker koppelen aan de bestelling.
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization") ?? "";
    if (authHeader.startsWith("Bearer ")) {
      const authClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data } = await authClient.auth.getUser();
      userId = data.user?.id ?? null;
    }

    // Prijzen server-side herberekenen op basis van de vaste catalogus.
    const priced: Array<Record<string, unknown>> = [];
    const preorders = new Map<string, number>();
    let subtotal = 0;
    let count = 0;

    for (const raw of items as Array<Record<string, unknown>>) {
      const sku = clean(raw?.sku, 32).toUpperCase();
      const name = clean(raw?.name, 200);
      const found = (sku && CATALOG[sku])
        ? { sku, entry: CATALOG[sku] }
        : BY_NAME.get(baseName(name).toLowerCase());
      if (!found) return bad(`Onbekend artikel: ${name || sku || "?"}`);

      const qty = Math.floor(Number(raw?.quantity));
      if (!Number.isFinite(qty) || qty < 1 || qty > MAX_QTY) return bad("Ongeldig aantal");

      const size = clean(raw?.size, 10);
      if (!size) return bad("Maat ontbreekt");

      const customName = clean(raw?.customName, 20).toUpperCase();
      const customNumber = clean(raw?.customNumber, 3).replace(/\D/g, "");
      const customized = Boolean(customName || customNumber);

      const unitPrice = found.entry.price + (customized ? CUSTOM_PRICE : 0);
      subtotal += unitPrice * qty;
      count += qty;

      priced.push({
        name: found.entry.name,
        sku: found.sku,
        size,
        customName: customName || null,
        customNumber: customNumber || null,
        quantity: qty,
        price: unitPrice,
      });

      if (found.entry.availability === "incoming" && found.entry.nameKey) {
        preorders.set(found.entry.nameKey, (preorders.get(found.entry.nameKey) ?? 0) + qty);
      }
    }

    const shipping = calculateShipping(count);
    const total = subtotal + shipping;

    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
    const orderNumber = `HOFS-${crypto.randomUUID().replace(/-/g, "").slice(0, 5).toUpperCase()}`;

    const { error: insertError } = await admin.from("orders").insert({
      order_number: orderNumber,
      user_id: userId,
      email: mail,
      items: priced,
      subtotal,
      shipping,
      total,
    });
    if (insertError) {
      console.error("order insert failed:", insertError.message);
      return new Response(JSON.stringify({ error: "Bestelling opslaan mislukt" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Pre-order tellers pas ophogen op basis van de opgeslagen (server-berekende) regels.
    for (const [key, qty] of preorders) {
      const { error } = await admin.rpc("increment_preorder", { _product_key: key, _qty: qty });
      if (error) console.error("increment_preorder failed", key, error.message);
    }

    return new Response(
      JSON.stringify({
        orderNumber,
        email: mail,
        items: priced,
        subtotal,
        shipping,
        total,
        count,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("create-order error:", e instanceof Error ? e.message : e);
    return new Response(JSON.stringify({ error: "Er ging iets mis" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function bad(message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
