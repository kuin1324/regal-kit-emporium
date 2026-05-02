// Sends a new-order email to the shop's Outlook inbox via the Microsoft Outlook connector gateway.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/microsoft_outlook";

interface OrderItem {
  name: string;
  size: string;
  quantity: number;
  price: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const OUTLOOK_API_KEY = Deno.env.get("MICROSOFT_OUTLOOK_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
    if (!OUTLOOK_API_KEY) throw new Error("MICROSOFT_OUTLOOK_API_KEY missing");

    const { subject, body, items, total } = await req.json() as {
      subject?: string; body?: string; items?: OrderItem[]; total?: number;
    };
    if (!subject || !body) {
      return new Response(JSON.stringify({ error: "subject and body required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build a nice HTML body
    const rows = (items ?? []).map(i =>
      `<tr><td style="padding:6px 10px;border-bottom:1px solid #eee">${escapeHtml(i.name)}</td>
       <td style="padding:6px 10px;border-bottom:1px solid #eee">${escapeHtml(i.size)}</td>
       <td style="padding:6px 10px;border-bottom:1px solid #eee">${i.quantity}</td>
       <td style="padding:6px 10px;border-bottom:1px solid #eee">€${i.price * i.quantity}</td></tr>`
    ).join("");

    const html = `
      <div style="font-family:Arial,sans-serif;color:#111">
        <h2 style="color:#D4A017">🛒 Nieuwe bestelling — The Home of Football Style</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;margin-top:12px">
          <thead><tr style="background:#f5f5f5">
            <th style="text-align:left;padding:8px 10px">Shirt</th>
            <th style="text-align:left;padding:8px 10px">Maat</th>
            <th style="text-align:left;padding:8px 10px">Aantal</th>
            <th style="text-align:left;padding:8px 10px">Prijs</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="margin-top:16px;font-size:16px"><b>Totaal: €${total ?? 0}</b></p>
        <hr style="margin:20px 0"/>
        <pre style="font-family:Arial;white-space:pre-wrap;color:#444">${escapeHtml(body)}</pre>
      </div>`;

    // Send to self (the connected mailbox owner)
    const profileRes = await fetch(`${GATEWAY_URL}/me`, {
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "X-Connection-Api-Key": OUTLOOK_API_KEY },
    });
    const profile = await profileRes.json();
    const recipient = profile?.mail || profile?.userPrincipalName;

    const sendRes = await fetch(`${GATEWAY_URL}/me/sendMail`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": OUTLOOK_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject,
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

    return new Response(JSON.stringify({ success: true, sentTo: recipient }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("send-order-email error:", msg);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
