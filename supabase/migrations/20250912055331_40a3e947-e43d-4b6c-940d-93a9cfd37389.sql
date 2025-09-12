-- Add 40 new properties from different Cyprus cities
INSERT INTO public.properties (
  title, property_type, bedrooms, bathrooms, price, rental_period, 
  city, area, furnished, amenities, description, images, available
) VALUES 
-- Limassol Properties (12 properties)
('Modern Waterfront Apartment', 'apartment', 2, 2, 1800, 'long-term', 'Limassol', 'Marina', true, ARRAY['WiFi', 'Air Conditioning', 'Balcony', 'Sea View', 'Gym'], 'Beautiful 2-bedroom apartment with stunning sea views in Limassol Marina. Fully furnished with modern amenities.', ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'], true),

('Luxury Villa with Pool', 'villa', 4, 3, 4500, 'short-term', 'Limassol', 'Agios Athanasios', true, ARRAY['Private Pool', 'WiFi', 'Air Conditioning', 'Garden', 'BBQ Area', 'Parking'], 'Stunning 4-bedroom luxury villa with private pool and garden. Perfect for families seeking comfort and privacy.', ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], true),

('City Center Studio', 'studio', 0, 1, 900, 'long-term', 'Limassol', 'City Center', true, ARRAY['WiFi', 'Air Conditioning', 'Kitchen', 'Washing Machine'], 'Cozy studio apartment in the heart of Limassol. Walking distance to shops, restaurants, and beaches.', ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'], true),

('Executive Penthouse', 'apartment', 3, 2, 2800, 'short-term', 'Limassol', 'Tourist Area', true, ARRAY['WiFi', 'Air Conditioning', 'Balcony', 'Sea View', 'Jacuzzi', 'Roof Terrace'], 'Luxurious penthouse with panoramic sea views and rooftop terrace. Premium location near the beach.', ARRAY['https://images.unsplash.com/photo-1605276373954-0c4a0dac5cc0?w=800', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'], true),

('Family House Near Beach', 'house', 3, 2, 2200, 'long-term', 'Limassol', 'Potamos Germasogeia', true, ARRAY['WiFi', 'Air Conditioning', 'Garden', 'Parking', 'BBQ Area'], 'Spacious family house just 5 minutes walk from the beach. Perfect for long-term stays with children.', ARRAY['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800', 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800'], true),

('Modern 1-Bed Apartment', 'apartment', 1, 1, 1200, 'long-term', 'Limassol', 'Neapolis', false, ARRAY['WiFi', 'Air Conditioning', 'Balcony', 'Elevator'], 'Unfurnished 1-bedroom apartment in residential area. Great for professionals starting fresh in Cyprus.', ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'], true),

('Seafront Luxury Villa', 'villa', 5, 4, 6000, 'short-term', 'Limassol', 'Amathus', true, ARRAY['Private Pool', 'WiFi', 'Air Conditioning', 'Sea View', 'Garden', 'BBQ Area', 'Parking', 'Maid Service'], 'Exclusive seafront villa with direct beach access. Ultimate luxury for discerning guests.', ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], true),

('Cozy 2-Bed House', 'house', 2, 1, 1600, 'long-term', 'Limassol', 'Yermasoyia', true, ARRAY['WiFi', 'Air Conditioning', 'Garden', 'Parking'], 'Charming 2-bedroom house in quiet residential area. Perfect for couples or small families.', ARRAY['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'], true),

('Marina Apartment', 'apartment', 2, 2, 2000, 'short-term', 'Limassol', 'Marina', true, ARRAY['WiFi', 'Air Conditioning', 'Balcony', 'Sea View', 'Concierge'], 'Elegant apartment in prestigious Limassol Marina with yacht views and luxury amenities.', ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'], true),

('Budget Studio Near University', 'studio', 0, 1, 700, 'long-term', 'Limassol', 'Katholiki', true, ARRAY['WiFi', 'Kitchen', 'Washing Machine'], 'Affordable studio perfect for students. Close to Cyprus University of Technology.', ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'], true),

('Hillside Villa with Views', 'villa', 3, 2, 3500, 'short-term', 'Limassol', 'Agios Tychonas', true, ARRAY['Private Pool', 'WiFi', 'Air Conditioning', 'Mountain View', 'Garden', 'BBQ Area'], 'Beautiful villa on the hills with panoramic views of the city and sea. Tranquil setting.', ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], true),

('Central Business Apartment', 'apartment', 1, 1, 1400, 'long-term', 'Limassol', 'City Center', true, ARRAY['WiFi', 'Air Conditioning', 'Elevator', 'Parking'], 'Professional apartment in business district. Ideal for executives and business travelers.', ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'], true),

-- Paphos Properties (10 properties)
('Historic Old Town House', 'house', 3, 2, 1800, 'long-term', 'Paphos', 'Old Town', true, ARRAY['WiFi', 'Air Conditioning', 'Garden', 'Historical Features'], 'Charming traditional house in UNESCO World Heritage Old Town. Rich in history and character.', ARRAY['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800', 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800'], true),

('Beachfront Apartment', 'apartment', 2, 2, 2200, 'short-term', 'Paphos', 'Coral Bay', true, ARRAY['WiFi', 'Air Conditioning', 'Balcony', 'Sea View', 'Beach Access'], 'Stunning beachfront apartment with direct access to Coral Bay beach. Wake up to ocean views.', ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'], true),

('Golf Course Villa', 'villa', 4, 3, 4000, 'short-term', 'Paphos', 'Secret Valley', true, ARRAY['Private Pool', 'WiFi', 'Air Conditioning', 'Golf Course View', 'Garden', 'BBQ Area'], 'Luxury villa overlooking championship golf course. Paradise for golf enthusiasts.', ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], true),

('Harbor View Studio', 'studio', 0, 1, 800, 'long-term', 'Paphos', 'Harbor Area', true, ARRAY['WiFi', 'Air Conditioning', 'Sea View', 'Kitchen'], 'Romantic studio overlooking Paphos harbor and medieval castle. Perfect for couples.', ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'], true),

('Modern Family Villa', 'villa', 3, 2, 3200, 'short-term', 'Paphos', 'Kato Paphos', true, ARRAY['Private Pool', 'WiFi', 'Air Conditioning', 'Garden', 'BBQ Area', 'Parking'], 'Contemporary villa in tourist area. Walking distance to archaeological sites and beaches.', ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], true),

('Countryside House', 'house', 2, 1, 1200, 'long-term', 'Paphos', 'Peyia', true, ARRAY['WiFi', 'Air Conditioning', 'Garden', 'Mountain View', 'Parking'], 'Peaceful house in traditional village. Escape the crowds while staying close to attractions.', ARRAY['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'], true),

('Luxury Penthouse', 'apartment', 3, 2, 2800, 'short-term', 'Paphos', 'Universal Area', true, ARRAY['WiFi', 'Air Conditioning', 'Balcony', 'Sea View', 'Roof Terrace', 'Jacuzzi'], 'Spectacular penthouse with 360-degree views. Ultimate luxury accommodation in Paphos.', ARRAY['https://images.unsplash.com/photo-1605276373954-0c4a0dac5cc0?w=800', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'], true),

('Budget-Friendly Apartment', 'apartment', 1, 1, 900, 'long-term', 'Paphos', 'Moutallos', false, ARRAY['WiFi', 'Air Conditioning', 'Kitchen'], 'Affordable unfurnished apartment perfect for budget-conscious long-term residents.', ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'], true),

('Sea Caves Villa', 'villa', 4, 3, 5000, 'short-term', 'Paphos', 'Sea Caves', true, ARRAY['Private Pool', 'WiFi', 'Air Conditioning', 'Sea View', 'Garden', 'BBQ Area', 'Cliff Location'], 'Dramatic clifftop villa near famous Sea Caves. Breathtaking sunset views every evening.', ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], true),

('Town Center House', 'house', 2, 2, 1500, 'long-term', 'Paphos', 'Town Center', true, ARRAY['WiFi', 'Air Conditioning', 'Balcony', 'Parking'], 'Convenient town center house. Walking distance to shops, restaurants, and cultural sites.', ARRAY['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800', 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800'], true),

-- Nicosia Properties (8 properties)
('Executive Business Apartment', 'apartment', 2, 2, 1600, 'long-term', 'Nicosia', 'City Center', true, ARRAY['WiFi', 'Air Conditioning', 'Elevator', 'Parking', 'Business Center'], 'Modern apartment in capital''s business district. Perfect for professionals and diplomats.', ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'], true),

('Historic House in Old Town', 'house', 3, 2, 1800, 'long-term', 'Nicosia', 'Old City', true, ARRAY['WiFi', 'Air Conditioning', 'Historical Features', 'Courtyard'], 'Beautifully restored traditional house within the medieval walls. Rich cultural heritage.', ARRAY['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800', 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800'], true),

('Modern Studio Near University', 'studio', 0, 1, 700, 'long-term', 'Nicosia', 'University Area', true, ARRAY['WiFi', 'Air Conditioning', 'Kitchen', 'Study Area'], 'Contemporary studio ideal for students and young professionals. Close to University of Cyprus.', ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'], true),

('Luxury Villa Suburb', 'villa', 4, 3, 3500, 'short-term', 'Nicosia', 'Strovolos', true, ARRAY['Private Pool', 'WiFi', 'Air Conditioning', 'Garden', 'BBQ Area', 'Parking'], 'Elegant villa in prestigious suburb. Quiet residential area with easy city access.', ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], true),

('Government Quarter Apartment', 'apartment', 1, 1, 1200, 'long-term', 'Nicosia', 'Government Quarter', true, ARRAY['WiFi', 'Air Conditioning', 'Security', 'Parking'], 'Secure apartment near government buildings and embassies. Ideal for diplomatic staff.', ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'], true),

('Family House with Garden', 'house', 3, 2, 2000, 'long-term', 'Nicosia', 'Lakatamia', true, ARRAY['WiFi', 'Air Conditioning', 'Garden', 'Parking', 'Playground'], 'Spacious family house with large garden. Perfect for families with children.', ARRAY['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800', 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800'], true),

('Cultural District Loft', 'apartment', 2, 1, 1500, 'short-term', 'Nicosia', 'Cultural District', true, ARRAY['WiFi', 'Air Conditioning', 'Loft Style', 'Art Gallery'], 'Artistic loft in cultural quarter. Surrounded by galleries, theaters, and cafes.', ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'], true),

('Diplomatic Villa', 'villa', 5, 4, 4500, 'short-term', 'Nicosia', 'Diplomatic Area', true, ARRAY['Private Pool', 'WiFi', 'Air Conditioning', 'Garden', 'Security', 'Staff Quarters'], 'Prestigious villa in diplomatic quarter. High security and luxury amenities.', ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], true),

-- Larnaca Properties (6 properties)
('Airport Hotel Apartment', 'apartment', 1, 1, 1000, 'short-term', 'Larnaca', 'Near Airport', true, ARRAY['WiFi', 'Air Conditioning', 'Airport Shuttle', 'Kitchen'], 'Convenient apartment near Larnaca Airport. Perfect for business travelers and transit guests.', ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'], true),

('Beachfront House', 'house', 2, 2, 1800, 'long-term', 'Larnaca', 'Finikoudes', true, ARRAY['WiFi', 'Air Conditioning', 'Beach Access', 'Sea View'], 'Charming house right on Finikoudes Beach. Wake up to Mediterranean sunrise every day.', ARRAY['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800', 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800'], true),

('Salt Lake Villa', 'villa', 3, 2, 2800, 'short-term', 'Larnaca', 'Salt Lake Area', true, ARRAY['Private Pool', 'WiFi', 'Air Conditioning', 'Lake View', 'Garden'], 'Unique villa overlooking famous Salt Lake. Watch flamingos during migration season.', ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], true),

('Marina Studio', 'studio', 0, 1, 750, 'long-term', 'Larnaca', 'Marina', true, ARRAY['WiFi', 'Air Conditioning', 'Marina View', 'Kitchen'], 'Cozy studio overlooking Larnaca Marina. Perfect for singles or couples seeking sea lifestyle.', ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'], true),

('Traditional Village House', 'house', 2, 1, 1200, 'long-term', 'Larnaca', 'Pervolia', true, ARRAY['WiFi', 'Air Conditioning', 'Garden', 'Traditional Features'], 'Authentic Cypriot house in traditional village. Experience local culture and community.', ARRAY['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'], true),

('Luxury Seafront Apartment', 'apartment', 3, 2, 2500, 'short-term', 'Larnaca', 'Mackenzie Beach', true, ARRAY['WiFi', 'Air Conditioning', 'Balcony', 'Sea View', 'Beach Club'], 'Premium apartment on famous Mackenzie Beach. Direct beach access and vibrant nightlife.', ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'], true),

-- Ayia Napa Properties (4 properties)
('Party Central Apartment', 'apartment', 2, 1, 1500, 'short-term', 'Ayia Napa', 'Square Area', true, ARRAY['WiFi', 'Air Conditioning', 'Balcony', 'Nightlife Access'], 'Vibrant apartment in heart of nightlife district. Perfect for party-goers and young travelers.', ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'], true),

('Nissi Beach Villa', 'villa', 3, 2, 3500, 'short-term', 'Ayia Napa', 'Nissi Beach', true, ARRAY['Private Pool', 'WiFi', 'Air Conditioning', 'Beach Access', 'Garden'], 'Exclusive villa steps from world-famous Nissi Beach. Crystal clear waters at your doorstep.', ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], true),

('Cape Greco House', 'house', 2, 2, 2000, 'short-term', 'Ayia Napa', 'Cape Greco', true, ARRAY['WiFi', 'Air Conditioning', 'Sea View', 'Nature Reserve'], 'Peaceful house near Cape Greco National Park. Perfect for nature lovers and hikers.', ARRAY['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800', 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800'], true),

('Budget Beach Studio', 'studio', 0, 1, 600, 'short-term', 'Ayia Napa', 'Makronissos', true, ARRAY['WiFi', 'Air Conditioning', 'Beach Access', 'Kitchen'], 'Affordable studio near beautiful Makronissos Beach. Great value for beach lovers.', ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'], true)