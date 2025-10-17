-- Add placement field to advertisements table
ALTER TABLE advertisements 
ADD COLUMN placement text NOT NULL DEFAULT 'all';

-- Add a comment to describe the placement column
COMMENT ON COLUMN advertisements.placement IS 'Specifies where the ad should be displayed: all, home, properties, villas, apartments, studios, houses';