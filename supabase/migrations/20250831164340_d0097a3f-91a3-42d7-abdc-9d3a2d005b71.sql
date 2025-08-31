-- Create properties table for rental listings
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'house', 'studio', 'villa')),
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  rental_period TEXT NOT NULL CHECK (rental_period IN ('short-term', 'long-term')),
  city TEXT NOT NULL,
  area TEXT NOT NULL,
  furnished BOOLEAN NOT NULL DEFAULT false,
  amenities TEXT[],
  description TEXT,
  images TEXT[],
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  booking_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled')),
  stripe_session_id TEXT,
  booking_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  check_in_date DATE NOT NULL,
  check_out_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Properties are viewable by everyone (public listings)
CREATE POLICY "Properties are viewable by everyone" 
ON public.properties 
FOR SELECT 
USING (true);

-- Bookings are viewable by the customer who made them
CREATE POLICY "Customers can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (true);

-- Allow inserting new bookings
CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

-- Allow updating booking status
CREATE POLICY "Allow booking updates" 
ON public.bookings 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample Cyprus rental properties
INSERT INTO public.properties (title, property_type, bedrooms, bathrooms, price, rental_period, city, area, furnished, amenities, description, images, available) VALUES
('Modern 2BR Apartment - €800 - Paphos', 'apartment', 2, 1, 800.00, 'long-term', 'Paphos', 'Kato Paphos', true, ARRAY['WiFi', 'Air Conditioning', 'Parking', 'Balcony'], 'Beautiful modern apartment near the sea with all amenities', ARRAY['/placeholder.svg'], true),
('Luxury Villa 4BR - €150/night - Limassol', 'villa', 4, 3, 150.00, 'short-term', 'Limassol', 'Agios Tychonas', true, ARRAY['Swimming Pool', 'WiFi', 'Sea View', 'Garden', 'Parking'], 'Stunning villa with private pool and sea views', ARRAY['/placeholder.svg'], true),
('Cozy Studio - €450 - Nicosia', 'studio', 0, 1, 450.00, 'long-term', 'Nicosia', 'City Center', true, ARRAY['WiFi', 'Air Conditioning', 'Kitchen'], 'Perfect studio in the heart of Nicosia', ARRAY['/placeholder.svg'], true),
('Traditional House 3BR - €1200 - Larnaca', 'house', 3, 2, 1200.00, 'long-term', 'Larnaca', 'Mackenzie', false, ARRAY['Garden', 'Parking', 'Near Airport'], 'Traditional Cypriot house with garden', ARRAY['/placeholder.svg'], true),
('Beachfront Apartment 1BR - €80/night - Paralimni', 'apartment', 1, 1, 80.00, 'short-term', 'Paralimni', 'Protaras', true, ARRAY['Sea View', 'WiFi', 'Beach Access', 'Balcony'], 'Right on the beach with stunning views', ARRAY['/placeholder.svg'], true),
('Family Villa 5BR - €2000 - Paphos', 'villa', 5, 4, 2000.00, 'long-term', 'Paphos', 'Coral Bay', true, ARRAY['Swimming Pool', 'Garden', 'BBQ Area', 'Parking', 'Sea View'], 'Large family villa with pool in prestigious area', ARRAY['/placeholder.svg'], true),
('Modern Studio - €60/night - Nicosia', 'studio', 0, 1, 60.00, 'short-term', 'Nicosia', 'Strovolos', true, ARRAY['WiFi', 'Kitchen', 'Air Conditioning'], 'Modern studio perfect for business travelers', ARRAY['/placeholder.svg'], true),
('Seafront House 2BR - €900 - Limassol', 'house', 2, 2, 900.00, 'long-term', 'Limassol', 'Tourist Area', true, ARRAY['Sea View', 'WiFi', 'Balcony', 'Near Marina'], 'Beautiful house steps from the sea', ARRAY['/placeholder.svg'], true);