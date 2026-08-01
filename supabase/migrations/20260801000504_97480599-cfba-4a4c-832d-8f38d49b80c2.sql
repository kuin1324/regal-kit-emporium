REVOKE EXECUTE ON FUNCTION public.track_order(text, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.track_order(text, text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.track_order(text, text) TO anon;