-- Allow public read access to visitor_analytics so the admin dashboard (running with anon key) can display data
-- Note: This is a minimal fix; for production, consider authenticating admins and tightening policies.
CREATE POLICY IF NOT EXISTS "Everyone can view visitor analytics"
ON public.visitor_analytics
FOR SELECT
USING (true);