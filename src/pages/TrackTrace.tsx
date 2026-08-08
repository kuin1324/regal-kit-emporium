import { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Package, Search, Truck, CheckCircle2, Clock, MapPin, Copy, Check, ExternalLink, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

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
  { key: "ontvangen", i18n: "track.steps.received", icon: Package },
  { key: "in behandeling", i18n: "track.steps.processing", icon: Clock },
  { key: "pre-order", i18n: "track.steps.preorder", icon: Clock },
  { key: "verzonden", i18n: "track.steps.shipped", icon: Truck },
  { key: "onderweg", i18n: "track.steps.intransit", icon: MapPin },
  { key: "afgeleverd", i18n: "track.steps.delivered", icon: CheckCircle2 },
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
const estimatedDelivery = (r: TrackResult, locale: string): string | null => {
  const status = normalizeStatus(r.status);
  if (status === "afgeleverd") return null;
  const base = new Date(status === "verzonden" || status === "onderweg" ? r.updated_at : r.created_at);
  const days = status === "onderweg" ? 1 : status === "verzonden" ? 3 : status === "pre-order" ? 21 : 6;
  const eta = new Date(base.getTime() + days * 86400000);
  return eta.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" });
};

const TrackTrace = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "nl";
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
      if (!silent) setError(t("track.errorGeneric"));
      return;
    }
    const row = (data as TrackResult[] | null)?.[0];
    if (!row) {
      if (!silent) setError(t("track.errorNotFound"));
      return;
    }
    setResult(row);
    setRefreshedAt(new Date());
  }, [t]);

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
  const eta = result ? estimatedDelivery(result, locale) : null;


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-6 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-primary mb-3">{t("track.eyebrow")}</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">{t("track.title")}</h1>
            <p className="text-sm text-muted-foreground mt-3">{t("track.subtitle")}</p>
          </motion.div>

          <form onSubmit={handleSearch} className="space-y-3 mb-10">
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder={t("track.orderPlaceholder")}
              className="w-full px-4 py-3 rounded border border-border/50 bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("track.emailPlaceholder")}
              className="w-full px-4 py-3 rounded border border-border/50 bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded bg-primary text-primary-foreground font-semibold text-sm tracking-wide uppercase hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              <Search className="h-4 w-4" />
              {loading ? t("track.searching") : t("track.search")}
            </button>
          </form>

          {error && <p className="text-center text-sm text-destructive mb-8">{error}</p>}

          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{t("track.orderNumber")}</p>
                  <p className="font-display text-lg font-bold">{result.order_number}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-primary/15 text-primary capitalize">{result.status}</span>
              </div>

              <div className="flex items-start mb-6">
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.key} className="flex-1 flex items-start last:flex-none">
                      <div className={`flex w-12 flex-col items-center ${i <= stepIndex ? "text-primary" : "text-muted-foreground"}`}>
                        <Icon className="h-5 w-5" />
                        <span className="text-[9px] mt-1 text-center leading-tight">{t(s.i18n)}</span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`h-[2px] flex-1 mt-2.5 mx-1 ${i < stepIndex ? "bg-primary" : "bg-border"}`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {eta && (
                <div className="rounded border border-primary/25 bg-primary/5 p-3 mb-4 text-sm">
                  <span className="text-muted-foreground text-xs">{t("track.eta")} </span>
                  <span className="font-semibold capitalize">{eta}</span>
                </div>
              )}

              {result.tracking_code && (
                <div className="rounded border border-border/60 p-4 mb-4 text-sm">
                  <p className="text-muted-foreground text-xs mb-1">{result.carrier || t("track.carrier")}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{result.tracking_code}</p>
                    <button
                      type="button"
                      onClick={copyTracking}
                      className="flex items-center gap-1 rounded border border-border/60 px-2 py-1 text-[11px] hover:border-primary/50 transition-colors"
                    >
                      {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
                      {copied ? t("track.copied") : t("track.copy")}
                    </button>
                    {result.tracking_url && (
                      <a
                        href={result.tracking_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 rounded bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {t("track.follow")}
                      </a>
                    )}
                  </div>
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
                <span className="font-semibold">{t("track.total")}</span>
                <span className="font-display font-bold text-gradient-gold">€{result.total}</span>
              </div>
              <div className="flex items-center justify-between mt-3 text-[11px] text-muted-foreground">
                <span>{t("track.lastUpdate")} {new Date(result.updated_at).toLocaleString(locale)}</span>
                <button
                  type="button"
                  onClick={() => {
                    const q = lastQuery.current;
                    if (q) void fetchOrder(q.order, q.email, true);
                  }}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                  {refreshedAt ? `${t("track.refreshed")} ${refreshedAt.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}` : t("track.refresh")}
                </button>
              </div>

            </motion.div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default TrackTrace;
