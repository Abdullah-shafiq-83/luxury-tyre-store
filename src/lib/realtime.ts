import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

type SupabaseTable =
  | "products"
  | "categories"
  | "orders"
  | "order_items"
  | "reviews"
  | "profiles"
  | "user_roles"
  | "product_images";

/**
 * Subscribes to all Postgres changes (INSERT / UPDATE / DELETE) on the
 * given table and calls `onchange` whenever any row is modified.
 *
 * Uses an internal callback ref so the Supabase channel is created only
 * once per table and torn down cleanly on unmount — the latest version of
 * `onchange` is always invoked without re-subscribing on every render.
 *
 * @example
 * function MyComponent() {
 *   const [items, setItems] = useState([]);
 *   async function load() { ... }
 *   useEffect(() => { load(); }, []);
 *   useRealtimeTable("products", load);   // <-- instant sync
 * }
 */
export function useRealtimeTable(table: SupabaseTable, onchange: () => void): void {
  // Always keep the ref pointing at the freshest callback so the channel
  // subscription never holds a stale closure, and we never need to
  // re-subscribe just because the function reference changed.
  const cbRef = useRef<() => void>(onchange);
  cbRef.current = onchange;

  useEffect(() => {
    const channelId = `rt-${table}-${Math.random().toString(36).slice(2, 9)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => cbRef.current(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // Only re-subscribe when the watched table changes; callback drift is
    // handled by the ref above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);
}
