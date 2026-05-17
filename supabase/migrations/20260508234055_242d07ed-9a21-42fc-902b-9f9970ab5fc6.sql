
CREATE POLICY "service_role can manage buckets" ON storage.buckets FOR ALL TO service_role USING (true) WITH CHECK (true);
