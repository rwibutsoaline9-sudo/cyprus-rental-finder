-- Add persistent visitor identifier to improve unique visitor accuracy
ALTER TABLE public.visitor_analytics
ADD COLUMN IF NOT EXISTS visitor_id UUID;

-- Helpful index for querying uniques over time windows
CREATE INDEX IF NOT EXISTS idx_visitor_analytics_visitor_id_created_at
  ON public.visitor_analytics (visitor_id, created_at);
