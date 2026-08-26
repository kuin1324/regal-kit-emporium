INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users
WHERE email IN ('quinnkuipers2012@gmail.com','quinnkuipers1@outlook.com')
ON CONFLICT (user_id, role) DO NOTHING;