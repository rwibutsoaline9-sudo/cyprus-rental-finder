-- Create advertisements table
CREATE TABLE public.advertisements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link_url TEXT NOT NULL,
  ad_size TEXT NOT NULL CHECK (ad_size IN ('banner', 'rectangle', 'sidebar')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage advertisements" 
ON public.advertisements 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM admin_users 
  WHERE email = (auth.jwt() ->> 'email'::text)
));

CREATE POLICY "Everyone can view active advertisements" 
ON public.advertisements 
FOR SELECT 
USING (is_active = true);

-- Create trigger for updated_at
CREATE TRIGGER update_advertisements_updated_at
BEFORE UPDATE ON public.advertisements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample ads
INSERT INTO public.advertisements (title, description, image_url, link_url, ad_size, is_active) VALUES
('Google AdSense Banner', 'Top banner advertisement space', NULL, 'https://www.google.com/adsense', 'banner', true),
('Sidebar Ad Space', 'Right sidebar advertisement', NULL, 'https://example.com', 'sidebar', true),
('Rectangle Ad', 'Medium rectangle advertisement', NULL, 'https://example.com', 'rectangle', true);