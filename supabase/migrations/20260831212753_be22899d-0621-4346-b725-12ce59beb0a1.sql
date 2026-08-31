-- has_role wordt gebruikt binnen RLS-policies en moet uitvoerbaar blijven voor ingelogde gebruikers
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;