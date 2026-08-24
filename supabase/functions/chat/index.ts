// AI-assistent voor de webshop. Streamt antwoorden via de Lovable AI Gateway.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are the assistant of "The Home of Football Style" (HOFS), an online shop for football shirts: retro, long sleeve, special editions, shorts and full kits.

STYLE
- The website is English-only: ALWAYS answer in English, whatever language the customer uses. Keep shirt names exactly as they are.
- Be short, concrete, friendly. Answer the question yourself, do not default to "email us".
- Missing info? Ask ONE focused follow-up question (which shirt, which size, which order number).
- Only refer to the_home_of_football_style@outlook.com for a concrete complaint, a return request, a payment issue, or personal data you cannot know.

PRICES
- Standard shirt EUR 30, Retro EUR 35, Long Sleeve EUR 40, Retro Long Sleeve EUR 45, Full Kit EUR 40, Shorts as listed on the product.
- Name and/or number printing: EUR 5 extra per shirt.

SHIPPING
- 1-2 shirts EUR 5, 3-5 shirts EUR 3, 6 shirts or more free.
- Delivery time is 10-20 working days after payment.

SIZES
- S, M, L, XL, 2XL. Fit is normal to slightly slim. In doubt between two sizes, or broad shoulders: go one size up.
- Chest guide: S ~96 cm, M ~102 cm, L ~108 cm, XL ~114 cm, 2XL ~120 cm.
- If unsure, ask for height/weight or their usual size, then advise.

QUALITY
- Breathable polyester, printed/stitched to the original design. Retro shirts are reproductions, not originals from that year.
- Washing: inside out, 30 C, no dryer, do not iron the print.

ORDERING & PAYMENT
- Order through the cart with "Order by email": you get an order number and we email the payment instructions.
- Paying is done afterwards by iDEAL, bank transfer, PayPal or Tikkie — there is no card checkout on the website.
- Shirts are shipped after the payment is received.

RETURNS
- 14 days, only for unworn shirts with the tags still attached and without a printed name or number.
- Personalised shirts cannot be returned, unless we made the mistake. Wrong or damaged item? Ask for a photo and refer to email.

TRACK & TRACE
- There is no track & trace page. As soon as the parcel is shipped we email the tracking code and link to the customer.

PHOTOS & CATALOGUE
- Some shirts appear twice in the catalogue (different photo sets of the same shirt); we are cleaning that up. Photos may have small cut-outs from the AI background remover, and customers can always ask for extra photos.

Never invent delivery times, stock levels or discounts that are not listed here.`;


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
