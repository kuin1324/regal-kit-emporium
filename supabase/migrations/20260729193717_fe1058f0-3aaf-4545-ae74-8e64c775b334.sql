CREATE TABLE public.preorder_counts (
  product_key text PRIMARY KEY,
  ordered integer NOT NULL DEFAULT 0,
  goal integer NOT NULL DEFAULT 7,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.preorder_counts TO anon;
GRANT SELECT ON public.preorder_counts TO authenticated;
GRANT ALL ON public.preorder_counts TO service_role;

ALTER TABLE public.preorder_counts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Preorder progress is public" ON public.preorder_counts
FOR SELECT TO anon, authenticated USING (true);

CREATE OR REPLACE FUNCTION public.increment_preorder(_product_key text, _qty integer)
RETURNS public.preorder_counts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE r public.preorder_counts;
BEGIN
  IF _qty IS NULL OR _qty <= 0 OR _qty > 50 THEN
    RAISE EXCEPTION 'invalid quantity';
  END IF;
  INSERT INTO public.preorder_counts (product_key, ordered)
  VALUES (_product_key, _qty)
  ON CONFLICT (product_key)
  DO UPDATE SET ordered = public.preorder_counts.ordered + _qty, updated_at = now()
  RETURNING * INTO r;
  RETURN r;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_preorder(text, integer) TO anon, authenticated;