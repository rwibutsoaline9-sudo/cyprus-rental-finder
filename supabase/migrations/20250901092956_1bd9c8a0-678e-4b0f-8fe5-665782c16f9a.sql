-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update property images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete property images" ON storage.objects;
DROP POLICY IF EXISTS "Property images are publicly accessible" ON storage.objects;

-- Create a security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = (auth.jwt() ->> 'email'::text)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create proper storage policies for property images
CREATE POLICY "Property images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'property-images');

CREATE POLICY "Admins can manage property images" 
ON storage.objects 
FOR ALL
USING (bucket_id = 'property-images' AND public.is_admin())
WITH CHECK (bucket_id = 'property-images' AND public.is_admin());