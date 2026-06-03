
-- 1) Storage buckets: drop open policy, restore admin-only management
DROP POLICY IF EXISTS "anyone can manage buckets" ON storage.buckets;
DROP POLICY IF EXISTS "admins manage buckets" ON storage.buckets;
CREATE POLICY "admins manage buckets" ON storage.buckets
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Revoke overly broad grants on storage.buckets
REVOKE ALL ON storage.buckets FROM anon, authenticated;
GRANT SELECT ON storage.buckets TO anon, authenticated;
GRANT ALL ON storage.buckets TO service_role;

-- 2) Remove permissive guest INSERT policies on orders / order_items.
-- Orders are now created via a server function that uses the service role.
DROP POLICY IF EXISTS "Guests can create orders" ON public.orders;
DROP POLICY IF EXISTS "Guests can insert order items" ON public.order_items;

-- Keep authenticated own-order inserts, but also require customer_email
-- matches the authenticated user's profile email to prevent impersonation.
DROP POLICY IF EXISTS "Users create own orders" ON public.orders;
CREATE POLICY "Users create own orders" ON public.orders
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND customer_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
  );

-- 3) Lock down has_role: keep SECURITY DEFINER (required for RLS policies),
-- but revoke direct EXECUTE from public/anon/authenticated. RLS policies
-- still call it because they run as the table owner.
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
