// AI-assistent voor de webshop. Streamt antwoorden via de Lovable AI Gateway.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Je bent de digitale assistent van "The Home of Football Style", een webshop in retro, long sleeve en special edition voetbalshirts.
Antwoord kort, vriendelijk en in de taal van de klant (standaard Nederlands).
Feiten die je mag gebruiken:
- Prijzen: Special Edition €30, Retro €35, Long Sleeve €45. Naam + nummer bedrukken kost €7 extra.
- Verzending: 1-2 shirts €5, 3-5 shirts €3, vanaf 6 shirts gratis.
- Pre-order shirts (Incoming Stock) worden verstuurd zodra ze binnen zijn.
- Bestellen gaat via de winkelwagen; de bestelling komt per e-mail binnen bij the_home_of_football_style@outlook.com. Betalen kan via PayPal, Tikkie of een andere betaalmethode.
- Track & trace via de pagina /track-trace met bestelnummer en e-mailadres.
Weet je iets niet zeker, verwijs dan naar de e-mail van de shop. Verzin geen voorraad of levertijden.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const { messages } = (await req.json()) as { messages: { role: string; content: string }[] };
    const history = (messages ?? []).slice(-20);

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        stream: true,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
      }),
    });

    if (res.status === 429) {
      return new Response(JSON.stringify({ error: "rate_limit" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (res.status === 402) {
      return new Response(JSON.stringify({ error: "no_credits" }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`gateway ${res.status}: ${txt}`);
    }

    return new Response(res.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (e) {
    console.error("chat error:", e instanceof Error ? e.message : e);
    return new Response(JSON.stringify({ error: "chat_failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
