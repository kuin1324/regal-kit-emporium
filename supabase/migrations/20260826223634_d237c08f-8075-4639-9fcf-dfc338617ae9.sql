-- Lock down the public order-lookup function: no route in the app uses it and it is
-- SECURITY DEFINER, so remove anonymous/public execute rights.
REVOKE EXECUTE ON FUNCTION public.track_order(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_order(text, text) TO service_role;

-- Preorder counter stays service-role only.
REVOKE EXECUTE ON FUNCTION public.increment_preorder(text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_preorder(text, integer) TO service_role;

-- Orders: creation happens exclusively inside edge functions with the service role.
-- Make sure the Data API roles cannot read/write orders beyond the owner SELECT policy.
REVOKE ALL ON TABLE public.orders FROM anon;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.orders FROM authenticated;
GRANT SELECT ON TABLE public.orders TO authenticated;
GRANT ALL ON TABLE public.orders TO service_role;