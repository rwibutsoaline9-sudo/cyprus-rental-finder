-- Fix the search_path security issue for functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean 
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql 
STABLE AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = (auth.jwt() ->> 'email'::text)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;