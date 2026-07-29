REVOKE EXECUTE ON FUNCTION public.increment_preorder(text, integer) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.increment_preorder(text, integer) TO service_role;