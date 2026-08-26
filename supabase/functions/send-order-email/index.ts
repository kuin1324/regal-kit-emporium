// Verstuurt een bestelmail naar de Outlook-inbox van de shop.
// De inhoud komt uit de opgeslagen bestelling (server-side prijzen), niet uit de browser.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/microsoft_outlook";

interface StoredItem {
  name?: string;
  sku?: string | null;
  size?: string;
  quantity?: number;
  price?: number;
  customName?: string | null;
  customNumber?: string | null;
  image?: string | null;
}

const SITE_URL = "https://the-home-of-football-style.lovable.app";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const OUTLOOK_API_KEY = Deno.env.get("MICROSOFT_OUTLOOK_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
    if (!OUTLOOK_API_KEY) throw new Error("MICROSOFT_OUTLOOK_API_KEY missing");

    const body = await req.json().catch(() => null) as { orderNumber?: unknown; email?: unknown } | null;
    const orderNumber = typeof body?.orderNumber === "string" ? body.orderNumber.trim().slice(0, 32) : "";
    const email = typeof body?.email === "string" ? body.email.trim().slice(0, 255).toLowerCase() : "";
    if (!orderNumber || !email) {
      return new Response(JSON.stringify({ error: "orderNumber and email required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const { data: order, error } = await admin
      .from("orders")
      .select("order_number, email, items, subtotal, shipping, total")
      .eq("order_number", orderNumber)
      .eq("email", email)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!order) {
      return new Response(JSON.stringify({ error: "Bestelling niet gevonden" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const items = (Array.isArray(order.items) ? order.items : []) as StoredItem[];

    const rows = items.map((i) => {
      const extra = [i.customName, i.customNumber ? `#${i.customNumber}` : null].filter(Boolean).join(" ");
      const sku = i.sku ? String(i.sku) : "";
      const itemName = String(i.name ?? "").trim();
      // Open exact het juiste (dubbele) shirt: match op fotopad, dan naam, dan zoekcode.
      const params = new URLSearchParams();
      if (i.image) params.set("img", String(i.image));
      if (itemName) params.set("open", itemName);
      if (sku) params.set("code", sku);
      const link = params.toString() ? `${SITE_URL}/collectie?${params.toString()}` : SITE_URL;
      return `<tr><td style="padding:6px 10px;border-bottom:1px solid #eee">${escapeHtml(String(i.name ?? ""))}${
        i.sku ? ` <small style="color:#888">[${escapeHtml(String(i.sku))}]</small>` : ""
      }${extra ? `<br/><small>${escapeHtml(extra)}</small>` : ""}${
        itemName ? `<br/><small>${sku ? `Zoekcode: <b>${escapeHtml(sku)}</b> — ` : ""}<a href="${escapeHtml(link)}">bekijk shirt</a></small>` : ""
      }</td>
       <td style="padding:6px 10px;border-bottom:1px solid #eee">${escapeHtml(String(i.size ?? ""))}</td>
       <td style="padding:6px 10px;border-bottom:1px solid #eee">${Number(i.quantity ?? 0)}</td>
       <td style="padding:6px 10px;border-bottom:1px solid #eee">€${Number(i.price ?? 0) * Number(i.quantity ?? 0)}</td></tr>`;
    }).join("");

    const html = `
      <div style="font-family:Arial,sans-serif;color:#111">
        <h2 style="color:#D4A017">🛒 Nieuwe bestelling — The Home of Football Style</h2>
        <p>📦 Bestelnummer: <b>${escapeHtml(order.order_number)}</b><br/>✉️ E-mail: ${escapeHtml(order.email)}</p>
        <table style="border-collapse:collapse;width:100%;max-width:600px;margin-top:12px">
          <thead><tr style="background:#f5f5f5">
            <th style="text-align:left;padding:8px 10px">Shirt</th>
            <th style="text-align:left;padding:8px 10px">Maat</th>
            <th style="text-align:left;padding:8px 10px">Aantal</th>
            <th style="text-align:left;padding:8px 10px">Prijs</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="margin-top:16px">Subtotaal: €${order.subtotal}<br/>Verzending: €${order.shipping}</p>
        <p style="font-size:16px"><b>Totaal: €${order.total}</b></p>
      </div>`;

    const recipient = "the_home_of_football_style@outlook.com";

    const sendRes = await fetch(`${GATEWAY_URL}/me/sendMail`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": OUTLOOK_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject: `Nieuwe bestelling ${order.order_number} — €${order.total}`,
          body: { contentType: "HTML", content: html },
          toRecipients: [{ emailAddress: { address: recipient } }],
          
        },
        saveToSentItems: true,
      }),
    });

    if (!sendRes.ok) {
      const txt = await sendRes.text();
      throw new Error(`Outlook send failed [${sendRes.status}]: ${txt}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-order-email error:", e instanceof Error ? e.message : e);
    return new Response(JSON.stringify({ success: false, error: "E-mail versturen mislukt" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
