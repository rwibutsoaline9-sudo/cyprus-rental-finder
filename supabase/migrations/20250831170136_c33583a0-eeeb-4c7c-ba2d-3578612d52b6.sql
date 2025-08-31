-- Create visitor analytics table
CREATE TABLE public.visitor_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET,
  user_agent TEXT,
  page_url TEXT NOT NULL,
  referrer TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create property views table
CREATE TABLE public.property_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create property ratings table
CREATE TABLE public.property_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  reviewer_name TEXT,
  reviewer_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.visitor_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS policies for visitor analytics (admin only)
CREATE POLICY "Admins can view all visitor analytics" 
ON public.visitor_analytics 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Anyone can insert visitor analytics" 
ON public.visitor_analytics 
FOR INSERT 
WITH CHECK (true);

-- RLS policies for property views (admin only read, anyone can insert)
CREATE POLICY "Admins can view all property views" 
ON public.property_views 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Anyone can insert property views" 
ON public.property_views 
FOR INSERT 
WITH CHECK (true);

-- RLS policies for property ratings (public read, anyone can insert)
CREATE POLICY "Everyone can view property ratings" 
ON public.property_ratings 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert property ratings" 
ON public.property_ratings 
FOR INSERT 
WITH CHECK (true);

-- RLS policies for admin users (admin only)
CREATE POLICY "Admins can view admin users" 
ON public.admin_users 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt() ->> 'email'));

-- Update properties table to allow admin modifications
CREATE POLICY "Admins can insert properties" 
ON public.properties 
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Admins can update properties" 
ON public.properties 
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Admins can delete properties" 
ON public.properties 
FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt() ->> 'email'));

-- Add indexes for performance
CREATE INDEX idx_visitor_analytics_created_at ON public.visitor_analytics(created_at);
CREATE INDEX idx_property_views_property_id ON public.property_views(property_id);
CREATE INDEX idx_property_views_created_at ON public.property_views(created_at);
CREATE INDEX idx_property_ratings_property_id ON public.property_ratings(property_id);

-- Add triggers for updated_at
CREATE TRIGGER update_property_ratings_updated_at
BEFORE UPDATE ON public.property_ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();