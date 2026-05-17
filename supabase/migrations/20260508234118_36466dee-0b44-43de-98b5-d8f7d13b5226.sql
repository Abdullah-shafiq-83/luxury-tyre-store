
DROP POLICY IF EXISTS "service_role can manage buckets" ON storage.buckets;
CREATE POLICY "anyone can manage buckets" ON storage.buckets FOR ALL USING (true) WITH CHECK (true);
