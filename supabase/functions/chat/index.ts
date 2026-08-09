// AI-assistent voor de webshop. Streamt antwoorden via de Lovable AI Gateway.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Je bent de digitale assistent van "The Home of Football Style" (HOFS), een webshop in retro, long sleeve en special edition voetbalshirts.

STIJL
- Antwoord kort, concreet en vriendelijk. De site is Engelstalig: antwoord ALTIJD in het Engels.
- Beantwoord vragen ZELF. Verwijs NIET standaard naar e-mail.
- Ontbreekt informatie? Stel eerst één gerichte vervolgvraag (bijv. welk shirt, welke maat, welk bestelnummer).
- Alleen bij een concrete bestelling, klacht, retouraanvraag of iets wat je echt niet kunt weten (persoonlijke gegevens, exacte voorraad van één stuk, betalingsstatus) verwijs je naar the_home_of_football_style@outlook.com.

PRIJZEN
- Special Edition €30, Retro €35, Long Sleeve €45.
- Naam + rugnummer bedrukken: €7 extra per shirt.

VERZENDING
- 1–2 shirts €5, 3–5 shirts €3, vanaf 6 shirts gratis (Nederland en België).
- Ready to Ship: verzending doorgaans binnen 1–3 werkdagen na betaling, levering meestal 2–5 werkdagen.
- Pre-order (Incoming Stock): wordt verstuurd zodra de zending binnen is. Bij pre-orders geldt een gezamenlijk doel; op de productpagina zie je een voortgangsbalk met hoeveel pre-orders er nog nodig zijn.

MATEN
- Beschikbaar: S, M, L, XL, 2XL. Vallen normaal tot iets slanker (Aziatische/retro pasvorm kan krapper zijn).
- Twijfel tussen twee maten of brede schouders? Adviseer een maat groter.
- Richtlijn borstwijdte: S ±96 cm, M ±102 cm, L ±108 cm, XL ±114 cm, 2XL ±120 cm.
- Vraag bij twijfel naar lengte/gewicht of gebruikelijke maat en geef dan een advies.

KWALITEIT
- Shirts zijn ademend polyester, geprint/gestikt naar origineel ontwerp; retro-shirts zijn reproducties, geen originelen uit dat jaar.
- Wasadvies: binnenstebuiten, 30 °C, niet in de droger, niet strijken op de print.

BESTELLEN & BETALEN
- Bestellen via de winkelwagen; de bestelling komt per e-mail binnen bij the_home_of_football_style@outlook.com.
- Betalen kan met PayPal, Tikkie of een andere betaalmethode in overleg. Het shirt gaat pas op transport na betaling.

RETOUREN
- 14 dagen bedenktijd op ongedragen shirts met labels; retourkosten zijn voor de klant.
- Gepersonaliseerde shirts (naam/nummer) kunnen niet retour, behalve bij een fout van ons.
- Fout of beschadigd geleverd? Vraag om een foto en verwijs voor afhandeling naar de e-mail.

TRACK & TRACE
- Via /track-trace met bestelnummer + e-mailadres. Statussen: ontvangen, in behandeling, pre-order, verzonden, onderweg, afgeleverd.

VOORRAAD
- "Ready to Ship" = op voorraad; "Incoming Stock" = pre-order. Exacte aantallen per maat kun je niet zien — vraag de klant welk shirt en welke maat en geef aan dat de shop dit per mail kan bevestigen als het echt nodig is.

Verzin nooit levertijden, voorraad of kortingen die hier niet staan.`;


Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const { messages, language } = (await req.json()) as {
      messages: { role: string; content: string }[];
      language?: string;
    };
    const history = (messages ?? []).slice(-20);

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        stream: true,
        messages: [
          {
            role: "system",
            content: `${SYSTEM_PROMPT}\n\nAlways reply in English, regardless of the language the customer uses. Keep shirt names as they are.`,
          },
          ...history,
        ],
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
