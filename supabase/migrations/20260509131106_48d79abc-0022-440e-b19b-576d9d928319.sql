
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS postal_code TEXT,
  ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'card';

ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS product_image TEXT;

-- Allow guest checkout: anyone can insert an order (user_id may be null)
DROP POLICY IF EXISTS "Guests can create orders" ON public.orders;
CREATE POLICY "Guests can create orders"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (
  (user_id IS NULL) OR (auth.uid() = user_id)
);

-- Allow inserting order items for any newly-created order
DROP POLICY IF EXISTS "Guests can insert order items" ON public.order_items;
CREATE POLICY "Guests can insert order items"
ON public.order_items
FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id)
);

-- Trigger to auto-update updated_at on orders
DROP TRIGGER IF EXISTS orders_touch_updated_at ON public.orders;
CREATE TRIGGER orders_touch_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
