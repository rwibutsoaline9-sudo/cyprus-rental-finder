-- Update properties with correct asset imports for images
UPDATE properties 
SET images = ARRAY[
  'https://cofrsijlcbilxsupbjxn.supabase.co/storage/v1/object/public/property-images/apartments/modern-apartment-cyprus.jpg',
  'https://cofrsijlcbilxsupbjxn.supabase.co/storage/v1/object/public/property-images/apartments/luxury-apartment-cyprus.jpg'
]
WHERE property_type = 'apartment';

UPDATE properties 
SET images = ARRAY[
  'https://cofrsijlcbilxsupbjxn.supabase.co/storage/v1/object/public/property-images/houses/traditional-house-cyprus.jpg',
  'https://cofrsijlcbilxsupbjxn.supabase.co/storage/v1/object/public/property-images/houses/family-house-cyprus.jpg'
]
WHERE property_type = 'house';

UPDATE properties 
SET images = ARRAY[
  'https://cofrsijlcbilxsupbjxn.supabase.co/storage/v1/object/public/property-images/studios/modern-studio-cyprus.jpg'
]
WHERE property_type = 'studio';

UPDATE properties 
SET images = ARRAY[
  'https://cofrsijlcbilxsupbjxn.supabase.co/storage/v1/object/public/property-images/villas/luxury-villa-cyprus.jpg'
]
WHERE property_type = 'villa';