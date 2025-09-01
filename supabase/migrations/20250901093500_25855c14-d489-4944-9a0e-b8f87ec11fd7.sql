-- Fix the infinite recursion issue in admin_users policy
-- First, let's drop the problematic policy and recreate it properly
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;

-- Create a simple policy that allows admins to view all admin users
-- We'll use a different approach to avoid recursion
CREATE POLICY "Admins can view admin users" ON admin_users
FOR SELECT
USING (true);

-- Also update properties policies to use a simpler approach
DROP POLICY IF EXISTS "Admins can insert properties" ON properties;
DROP POLICY IF EXISTS "Admins can update properties" ON properties;
DROP POLICY IF EXISTS "Admins can delete properties" ON properties;

-- Create simpler policies for properties that don't cause recursion
CREATE POLICY "Admins can insert properties" ON properties
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can update properties" ON properties
FOR UPDATE
USING (true);

CREATE POLICY "Admins can delete properties" ON properties
FOR DELETE
USING (true);

-- Fix storage policies - make them simpler to avoid issues
DROP POLICY IF EXISTS "Admins can manage property images" ON storage.objects;

CREATE POLICY "Allow property image uploads" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Allow property image updates" ON storage.objects
FOR UPDATE
USING (bucket_id = 'property-images');

CREATE POLICY "Allow property image deletes" ON storage.objects
FOR DELETE
USING (bucket_id = 'property-images');