import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/** Aantal pre-order shirts dat samen nodig is voor gratis verzending. */
export const PREORDER_GOAL = 50;

interface Props {
  /** Toon de voortgang voor één specifiek product (nameKey), of laat leeg voor het totaal. */
  productKey?: string;
  className?: string;
}

const PreorderProgress = ({ productKey, className = "" }: Props) => {
  const [ordered, setOrdered] = useState<number | null>(null);
  const [goal, setGoal] = useState(PREORDER_GOAL);

  const load = useCallback(async () => {
    const query = supabase.from("preorder_counts").select("product_key, ordered, goal");
    const { data } = productKey ? await query.eq("product_key", productKey) : await query;
    if (!data) return;
    setOrdered(data.reduce((sum, row) => sum + (row.ordered ?? 0), 0));
    if (productKey && data[0]?.goal) setGoal(data[0].goal);
  }, [productKey]);

  useEffect(() => {
    void load();
    // Automatisch bijwerken zodra iemand anders een pre-order plaatst.
    const channel = supabase
      .channel(`preorder-${productKey ?? "all"}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "preorder_counts" }, () => void load())
      .subscribe();
    const timer = window.setInterval(() => void load(), 60_000);
    return () => {
      void supabase.removeChannel(channel);
      window.clearInterval(timer);
    };
  }, [load, productKey]);

  const current = ordered ?? 0;
  const remaining = Math.max(0, goal - current);
  const pct = Math.min(100, Math.round((current / goal) * 100));

  return (
    <div className={`rounded-xl border border-primary/25 bg-primary/5 p-4 ${className}`}>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="flex items-center gap-2 font-medium text-foreground">
          <Truck className="h-4 w-4 text-primary" />
          {remaining === 0 ? "Gratis verzending is behaald! 🎉" : `Nog ${remaining} bestellingen nodig voor gratis verzending`}
        </span>
        <span className="shrink-0 text-xs text-muted-foreground">
          {current} van de {goal}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-gold-light"
        />
      </div>
    </div>
  );
};

export default PreorderProgress;
