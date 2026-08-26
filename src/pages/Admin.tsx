import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, PackageSearch, RefreshCw, Save, ShieldAlert } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useAuth } from "@/context/AuthContext";

const STATUSES = ["ontvangen", "betaald", "verzonden", "geleverd", "geannuleerd"] as const;

type OrderItem = {
  name?: string;
  sku?: string | null;
  size?: string | null;
  customName?: string | null;
  customNumber?: string | null;
  quantity?: number;
  price?: number;
};

type Order = {
  id: string;
  order_number: string;
  email: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  carrier: string | null;
  tracking_code: string | null;
  tracking_url: string | null;
  created_at: string;
};

const money = (n: number) => `€${Number(n || 0).toFixed(2)}`;

const statusStyle = (status: string) => {
  switch (status) {
    case "betaald":
      return "bg-primary/15 text-primary border-primary/30";
    case "verzonden":
      return "bg-blue-500/15 text-blue-500 border-blue-500/30";
    case "geleverd":
      return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
    case "geannuleerd":
      return "bg-destructive/15 text-destructive border-destructive/30";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const OrderCard = ({ order, onSaved }: { order: Order; onSaved: (o: Order) => void }) => {
  const { toast } = useToast();
  const [draft, setDraft] = useState({
    status: order.status,
    carrier: order.carrier ?? "",
    tracking_code: order.tracking_code ?? "",
    tracking_url: order.tracking_url ?? "",
  });
  const [saving, setSaving] = useState(false);

  const dirty =
    draft.status !== order.status ||
    draft.carrier !== (order.carrier ?? "") ||
    draft.tracking_code !== (order.tracking_code ?? "") ||
    draft.tracking_url !== (order.tracking_url ?? "");

  const save = async () => {
    setSaving(true);
    const { data, error } = await supabase
      .from("orders")
      .update({
        status: draft.status,
        carrier: draft.carrier || null,
        tracking_code: draft.tracking_code || null,
        tracking_url: draft.tracking_url || null,
      })
      .eq("id", order.id)
      .select()
      .maybeSingle();
    setSaving(false);
    if (error || !data) {
      toast({ title: "Could not save", description: error?.message ?? "Please try again", variant: "destructive" });
      return;
    }
    onSaved(data as unknown as Order);
    toast({ title: "Order updated", description: order.order_number });
  };

  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-5 shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-bold tracking-tight text-primary">{order.order_number}</p>
          <p className="text-sm text-muted-foreground">{order.email}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(order.created_at).toLocaleString("en-GB")}
          </p>
        </div>
        <div className="text-right">
          <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium capitalize ${statusStyle(order.status)}`}>
            {order.status}
          </span>
          <p className="mt-2 font-semibold">{money(order.total)}</p>
          <p className="text-xs text-muted-foreground">
            {money(order.subtotal)} + {money(order.shipping)} shipping
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-2 border-t border-border/60 pt-4">
        {items.map((item, i) => (
          <li key={i} className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
            <span className="font-medium">
              {item.quantity ?? 1}× {item.name ?? "Unknown shirt"}
            </span>
            <span className="text-muted-foreground">
              {[
                item.size ? `Size ${item.size}` : null,
                item.customName ? `Name: ${item.customName}` : null,
                item.customNumber ? `No: ${item.customNumber}` : null,
                item.sku ?? null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </li>
        ))}
        {items.length === 0 && <li className="text-sm text-muted-foreground">No items</li>}
      </ul>

      <div className="mt-4 grid gap-3 border-t border-border/60 pt-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Status</Label>
          <Select value={draft.status} onValueChange={(v) => setDraft((d) => ({ ...d, status: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Carrier</Label>
          <Input
            value={draft.carrier}
            placeholder="PostNL, DHL…"
            onChange={(e) => setDraft((d) => ({ ...d, carrier: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Tracking code</Label>
          <Input
            value={draft.tracking_code}
            onChange={(e) => setDraft((d) => ({ ...d, tracking_code: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Tracking link</Label>
          <Input
            value={draft.tracking_url}
            placeholder="https://…"
            onChange={(e) => setDraft((d) => ({ ...d, tracking_url: e.target.value }))}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button onClick={save} disabled={!dirty || saving} size="sm">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save
        </Button>
      </div>
    </motion.div>
  );
};

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useIsAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("alle");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    setOrders((data ?? []) as unknown as Order[]);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) load();
    else if (!roleLoading) setLoading(false);
  }, [isAdmin, roleLoading]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== "alle" && o.status !== statusFilter) return false;
      if (!q) return true;
      return (
        o.order_number.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        (Array.isArray(o.items) &&
          o.items.some((i) => (i.name ?? "").toLowerCase().includes(q)))
      );
    });
  }, [orders, query, statusFilter]);

  const revenue = useMemo(
    () => filtered.filter((o) => o.status !== "geannuleerd").reduce((s, o) => s + Number(o.total || 0), 0),
    [filtered],
  );

  if (authLoading || roleLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto flex flex-col items-center px-6 pt-40 pb-24 text-center">
          <ShieldAlert className="mb-4 h-10 w-10 text-primary" />
          <h1 className="font-display text-3xl font-bold">No access</h1>
          <p className="mt-2 max-w-md text-muted-foreground">
            This page is for administrators only. Sign in with an admin account to view orders.
          </p>
          {!user && (
            <Button asChild className="mt-6">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pt-28 pb-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Admin</p>
            <h1 className="font-display text-4xl font-bold tracking-tight">Orders</h1>
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Orders", value: String(filtered.length) },
            { label: "Revenue", value: money(revenue) },
            { label: "Open", value: String(filtered.filter((o) => o.status === "ontvangen").length) },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className="mt-1 font-display text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Search by order number, email or shirt…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="sm:max-w-sm"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="sm:w-52"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">All statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center text-muted-foreground">
            <PackageSearch className="mb-3 h-8 w-8" />
            No orders found.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((o) => (
              <OrderCard
                key={o.id}
                order={o}
                onSaved={(updated) => setOrders((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
