-- Update properties with correct public image paths
UPDATE properties 
SET images = ARRAY['/apartments/modern-apartment-cyprus.jpg', '/apartments/luxury-apartment-cyprus.jpg']
WHERE property_type = 'apartment';

UPDATE properties 
SET images = ARRAY['/houses/traditional-house-cyprus.jpg', '/houses/family-house-cyprus.jpg']
WHERE property_type = 'house';

UPDATE properties 
SET images = ARRAY['/studios/modern-studio-cyprus.jpg']
WHERE property_type = 'studio';

UPDATE properties 
SET images = ARRAY['/villas/luxury-villa-cyprus.jpg']
WHERE property_type = 'villa';