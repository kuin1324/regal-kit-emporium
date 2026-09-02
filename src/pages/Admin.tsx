import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, Loader2, PackageSearch, Pencil, RefreshCw, Save, ShieldAlert, Star, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const OrderCard = ({
  order,
  onSaved,
  onDeleted,
}: {
  order: Order;
  onSaved: (o: Order) => void;
  onDeleted: (id: string) => void;
}) => {
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

  const [deleting, setDeleting] = useState(false);

  const remove = async () => {
    if (!window.confirm(`Delete order ${order.order_number}? This cannot be undone.`)) return;
    setDeleting(true);
    const { error } = await supabase.from("orders").delete().eq("id", order.id);
    setDeleting(false);
    if (error) {
      toast({ title: "Could not delete", description: error.message, variant: "destructive" });
      return;
    }
    onDeleted(order.id);
    toast({ title: "Order deleted", description: order.order_number });
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

      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={remove} disabled={deleting} size="sm" variant="outline" className="text-destructive">
          {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
          Delete
        </Button>
        <Button onClick={save} disabled={!dirty || saving} size="sm">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save
        </Button>
      </div>
    </motion.div>
  );
};

type ReviewRow = {
  id: string;
  name: string;
  rating: number;
  body: string;
  order_number: string | null;
  created_at: string;
};

const ReviewsPanel = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("reviews")
      .select("id, name, rating, body, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    setRows((data ?? []) as unknown as ReviewRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) {
      toast({ title: "Could not delete", description: error.message, variant: "destructive" });
      return;
    }
    setRows((r) => r.filter((x) => x.id !== id));
    toast({ title: "Review deleted" });
  };

  const saveReview = async (row: ReviewRow, patch: { name: string; rating: number; body: string }) => {
    const { data, error } = await supabase
      .from("reviews")
      .update({ name: patch.name.trim(), rating: patch.rating, body: patch.body.trim() })
      .eq("id", row.id)
      .select("id, name, rating, body, created_at")
      .maybeSingle();
    if (error || !data) {
      toast({ title: "Could not save", description: error?.message ?? "Please try again", variant: "destructive" });
      return false;
    }
    setRows((r) => r.map((x) => (x.id === row.id ? (data as unknown as ReviewRow) : x)));
    toast({ title: "Review updated" });
    return true;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (rows.length === 0) {
    return <p className="py-16 text-center text-sm text-muted-foreground">No reviews yet.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={load}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
      {rows.map((r) => (
        <ReviewCard key={r.id} review={r} onSave={saveReview} onDelete={remove} />
      ))}
    </div>
  );
};

const ReviewCard = ({
  review,
  onSave,
  onDelete,
}: {
  review: ReviewRow;
  onSave: (row: ReviewRow, patch: { name: string; rating: number; body: string }) => Promise<boolean>;
  onDelete: (id: string) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({ name: review.name, rating: review.rating, body: review.body });

  useEffect(() => {
    setDraft({ name: review.name, rating: review.rating, body: review.body });
  }, [review]);

  const submit = async () => {
    setSaving(true);
    const ok = await onSave(review, draft);
    setSaving(false);
    if (ok) setEditing(false);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium">{review.name}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(review.created_at).toLocaleString("en-GB")}
            {review.order_number ? ` · order ${review.order_number}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
              />
            ))}
          </span>
          <Button size="sm" variant="ghost" onClick={() => setEditing((v) => !v)} aria-label="Edit review">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(review.id)} aria-label="Delete review">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {editing ? (
        <div className="mt-4 space-y-3 border-t border-border/60 pt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Name</Label>
              <Input value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Rating</Label>
              <Select
                value={String(draft.rating)}
                onValueChange={(v) => setDraft((d) => ({ ...d, rating: Number(v) }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n} ★</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Review text</Label>
            <Textarea
              rows={4}
              value={draft.body}
              onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
            <Button size="sm" onClick={submit} disabled={saving || !draft.name.trim() || draft.body.trim().length < 3}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save
            </Button>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">{review.body}</p>
      )}
    </div>
  );
};

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useIsAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("alle");
  const [tab, setTab] = useState<"orders" | "reviews">("orders");

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

  const exportCsv = () => {
    const header = ["order_number", "email", "status", "subtotal", "shipping", "total", "carrier", "tracking_code", "created_at", "items"];
    const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = [
      header.join(","),
      ...filtered.map((o) =>
        [
          o.order_number,
          o.email,
          o.status,
          o.subtotal,
          o.shipping,
          o.total,
          o.carrier,
          o.tracking_code,
          o.created_at,
          (Array.isArray(o.items) ? o.items : [])
            .map((i) => `${i.quantity ?? 1}x ${i.name ?? ""}${i.size ? ` (${i.size})` : ""}`)
            .join(" | "),
        ]
          .map(escape)
          .join(","),
      ),
    ];
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `hofs-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
        <Breadcrumbs />
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Admin</p>
            <h1 className="font-display text-4xl font-bold tracking-tight">Orders</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportCsv} disabled={filtered.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="mb-6 inline-flex rounded-full border border-border p-1">
          {(["orders", "reviews"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                tab === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        {tab === "reviews" ? (
          <ReviewsPanel />
        ) : (
        <>

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
                onDeleted={(id) => setOrders((prev) => prev.filter((p) => p.id !== id))}
              />
            ))}
          </div>
        )}
        </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
