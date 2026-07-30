import { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Package, Search, Truck, CheckCircle2, Clock, MapPin, Copy, Check, ExternalLink, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TrackResult {
  order_number: string;
  status: string;
  carrier: string | null;
  tracking_code: string | null;
  tracking_url: string | null;
  items: unknown;
  total: number;
  created_at: string;
  updated_at: string;
}

/** Volledige statusketen zoals getoond aan de klant. */
const STEPS = [
  { key: "ontvangen", label: "Order ontvangen", icon: Package },
  { key: "in behandeling", label: "In behandeling", icon: Clock },
  { key: "pre-order", label: "Pre-order", icon: Clock },
  { key: "verzonden", label: "Verzonden", icon: Truck },
  { key: "onderweg", label: "Onderweg", icon: MapPin },
  { key: "afgeleverd", label: "Afgeleverd", icon: CheckCircle2 },
];

/** Oudere statuswaarden blijven werken. */
const STATUS_ALIAS: Record<string, string> = {
  geleverd: "afgeleverd",
  preorder: "pre-order",
  behandeling: "in behandeling",
};

const normalizeStatus = (s: string) => {
  const v = s.trim().toLowerCase();
  return STATUS_ALIAS[v] ?? v;
};

/** Geschatte leverdatum op basis van status en verzenddatum. */
const estimatedDelivery = (r: TrackResult): string | null => {
  const status = normalizeStatus(r.status);
  if (status === "afgeleverd") return null;
  const base = new Date(status === "verzonden" || status === "onderweg" ? r.updated_at : r.created_at);
  const days = status === "onderweg" ? 1 : status === "verzonden" ? 3 : status === "pre-order" ? 21 : 6;
  const eta = new Date(base.getTime() + days * 86400000);
  return eta.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" });
};

const TrackTrace = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null);
  const lastQuery = useRef<{ order: string; email: string } | null>(null);

  const fetchOrder = useCallback(async (order: string, mail: string, silent = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
      setResult(null);
    }
    const { data, error: err } = await supabase.rpc("track_order", {
      _order_number: order,
      _email: mail,
    });
    if (!silent) setLoading(false);
    if (err) {
      if (!silent) setError("Er ging iets mis. Probeer het opnieuw.");
      return;
    }
    const row = (data as TrackResult[] | null)?.[0];
    if (!row) {
      if (!silent) setError("Geen bestelling gevonden met dit bestelnummer en e-mailadres.");
      return;
    }
    setResult(row);
    setRefreshedAt(new Date());
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !email.trim()) return;
    lastQuery.current = { order: orderNumber.trim(), email: email.trim() };
    await fetchOrder(orderNumber.trim(), email.trim());
  };

  // Status automatisch verversen zolang de bestelling nog niet is afgeleverd.
  useEffect(() => {
    if (!result || normalizeStatus(result.status) === "afgeleverd") return;
    const id = setInterval(() => {
      const q = lastQuery.current;
      if (q) void fetchOrder(q.order, q.email, true);
    }, 30000);
    return () => clearInterval(id);
  }, [result, fetchOrder]);

  const copyTracking = async () => {
    if (!result?.tracking_code) return;
    await navigator.clipboard.writeText(result.tracking_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stepIndex = result ? Math.max(0, STEPS.findIndex((s) => s.key === normalizeStatus(result.status))) : 0;
  const items = Array.isArray(result?.items) ? (result!.items as Array<Record<string, unknown>>) : [];
  const eta = result ? estimatedDelivery(result) : null;


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-6 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-primary mb-3">Track &amp; Trace</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">Volg je bestelling</h1>
            <p className="text-sm text-muted-foreground mt-3">Vul je bestelnummer en e-mailadres in om de status te zien.</p>
          </motion.div>

          <form onSubmit={handleSearch} className="space-y-3 mb-10">
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Bestelnummer (bijv. HOFS-4821)"
              className="w-full px-4 py-3 rounded border border-border/50 bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mailadres van je bestelling"
              className="w-full px-4 py-3 rounded border border-border/50 bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded bg-primary text-primary-foreground font-semibold text-sm tracking-wide uppercase hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              <Search className="h-4 w-4" />
              {loading ? "Zoeken…" : "Zoek bestelling"}
            </button>
          </form>

          {error && <p className="text-center text-sm text-destructive mb-8">{error}</p>}

          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Bestelnummer</p>
                  <p className="font-display text-lg font-bold">{result.order_number}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-primary/15 text-primary capitalize">{result.status}</span>
              </div>

              <div className="flex items-center mb-6">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex-1 flex items-center last:flex-none">
                    <div className={`flex flex-col items-center ${i <= stepIndex ? "text-primary" : "text-muted-foreground"}`}>
                      {i === 0 && <Package className="h-5 w-5" />}
                      {i === 1 && <Package className="h-5 w-5" />}
                      {i === 2 && <Truck className="h-5 w-5" />}
                      {i === 3 && <CheckCircle2 className="h-5 w-5" />}
                      <span className="text-[10px] mt-1 capitalize whitespace-nowrap">{s}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`h-[2px] flex-1 mx-2 ${i < stepIndex ? "bg-primary" : "bg-border"}`} />
                    )}
                  </div>
                ))}
              </div>

              {result.tracking_code && (
                <div className="rounded border border-border/60 p-4 mb-4 text-sm">
                  <p className="text-muted-foreground text-xs mb-1">{result.carrier || "Vervoerder"}</p>
                  <p className="font-semibold">{result.tracking_code}</p>
                  {result.tracking_url && (
                    <a href={result.tracking_url} target="_blank" rel="noreferrer" className="text-primary text-xs hover:underline">
                      Volg bij vervoerder →
                    </a>
                  )}
                </div>
              )}

              {items.length > 0 && (
                <ul className="text-sm space-y-1 mb-4">
                  {items.map((it, i) => (
                    <li key={i} className="flex justify-between">
                      <span className="text-muted-foreground truncate pr-3">
                        {String(it.name ?? "")} {it.size ? `(${String(it.size)})` : ""} x{String(it.quantity ?? 1)}
                      </span>
                      <span>€{String(it.price ?? "")}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex justify-between border-t border-border pt-3 text-sm">
                <span className="font-semibold">Totaal</span>
                <span className="font-display font-bold text-gradient-gold">€{result.total}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-3">
                Laatste update: {new Date(result.updated_at).toLocaleString("nl-NL")}
              </p>
            </motion.div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default TrackTrace;
