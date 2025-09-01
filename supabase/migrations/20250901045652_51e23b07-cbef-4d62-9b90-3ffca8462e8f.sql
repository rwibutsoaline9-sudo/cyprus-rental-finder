-- Update properties with proper Cyprus property images
UPDATE properties 
SET images = ARRAY['/src/assets/apartment-1.jpg', '/src/assets/apartment-2.jpg']
WHERE property_type = 'apartment';

UPDATE properties 
SET images = ARRAY['/src/assets/house-1.jpg', '/src/assets/house-2.jpg']
WHERE property_type = 'house';

UPDATE properties 
SET images = ARRAY['/src/assets/studio-1.jpg']
WHERE property_type = 'studio';

UPDATE properties 
SET images = ARRAY['/src/assets/villa-1.jpg']
WHERE property_type = 'villa';