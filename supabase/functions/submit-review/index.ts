// Neemt reviews aan van de site en verifieert de bestelling server-side.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const payload = await req.json().catch(() => null);
    if (!payload || typeof payload !== "object") {
      return json({ error: "invalid_request" }, 400);
    }

    const orderNumber = clean((payload as Record<string, unknown>).orderNumber, 40);
    const email = clean((payload as Record<string, unknown>).email, 255);
    const name = clean((payload as Record<string, unknown>).name, 60);
    const body = clean((payload as Record<string, unknown>).body, 600);
    const ratingRaw = Number((payload as Record<string, unknown>).rating);
    const rating = Number.isFinite(ratingRaw) ? Math.round(ratingRaw) : 0;

    if (!orderNumber || !email || !name || body.length < 3 || rating < 1 || rating > 5) {
      return json({ error: "invalid_input" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { error } = await supabase.rpc("submit_review", {
      _order_number: orderNumber,
      _email: email,
      _name: name,
      _rating: rating,
      _body: body,
    });

    if (error) {
      const duplicate = /already/i.test(error.message);
      return json({ error: duplicate ? "already_reviewed" : "order_not_found" }, 400);
    }

    return json({ ok: true });
  } catch (_e) {
    return json({ error: "server_error" }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
