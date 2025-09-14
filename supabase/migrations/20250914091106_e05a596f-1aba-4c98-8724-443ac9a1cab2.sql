-- Open read access for visitor analytics so the admin UI (anon) can read rows
CREATE POLICY "Everyone can view visitor analytics"
ON public.visitor_analytics
FOR SELECT
USING (true);