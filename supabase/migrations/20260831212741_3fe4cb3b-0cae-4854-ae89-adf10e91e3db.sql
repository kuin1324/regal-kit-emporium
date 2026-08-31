-- Reviews: verberg order_number voor publiek (kolom-niveau grants)
REVOKE SELECT ON public.reviews FROM anon, authenticated;
GRANT SELECT (id, name, rating, body, created_at, updated_at) ON public.reviews TO anon, authenticated;
GRANT SELECT ON public.reviews TO service_role;

-- SECURITY DEFINER functies niet meer rechtstreeks aanroepbaar vanaf de client
REVOKE EXECUTE ON FUNCTION public.submit_review(text, text, text, integer, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_review(text, text, text, integer, text) TO service_role;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

REVOKE EXECUTE ON FUNCTION public.increment_preorder(text, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.track_order(text, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;