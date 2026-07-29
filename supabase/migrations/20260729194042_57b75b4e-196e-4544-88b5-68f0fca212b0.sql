GRANT SELECT ON public.preorder_counts TO anon, authenticated;
GRANT ALL ON public.preorder_counts TO service_role;
ALTER TABLE public.preorder_counts REPLICA IDENTITY FULL;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.preorder_counts;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;