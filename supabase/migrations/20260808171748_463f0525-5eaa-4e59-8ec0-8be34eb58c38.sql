-- Bestellingen alleen nog server-side (service role) aanmaken.
DROP POLICY IF EXISTS "Anyone can create an order" ON public.orders;
REVOKE INSERT ON public.orders FROM anon, authenticated;
GRANT ALL ON public.orders TO service_role;

-- Pre-order teller alleen server-side ophogen.
REVOKE EXECUTE ON FUNCTION public.increment_preorder(text, integer) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.increment_preorder(text, integer) TO service_role;