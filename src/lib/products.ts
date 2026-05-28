import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Unified storefront product shape (mapped from DB row)
export type Product = {
  id: string;
  name: string;
  brand: string;
  category: "tyres" | "rims" | string;
  price: number;
  size: string;
  image: string;
  description: string;
  specs: Record<string, string>;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  stock?: number;
};

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'><rect width='100%' height='100%' fill='%23222'/><text x='50%' y='50%' fill='%23888' font-family='sans-serif' font-size='28' text-anchor='middle' dominant-baseline='middle'>No image</text></svg>";

export function mapProduct(row: any, categoryName?: string): Product {
  const variants = Array.isArray(row.variants) ? row.variants : [];
  const specs: Record<string, string> = {};
  for (const v of variants) {
    if (v && typeof v === "object") {
      for (const [k, val] of Object.entries(v)) {
        if (val != null) specs[k] = String(val);
      }
    }
  }
  return {
    id: row.id,
    name: row.title,
    brand: row.brand || (row.tags?.[0] ?? "TyreLux"),
    category: categoryName || (row.tags?.includes("rims") ? "rims" : "tyres"),
    price: Number(row.discount_price ?? row.price ?? 0),
    size: row.size || (row.tags?.[1] ?? ""),
    image: row.main_image_url || FALLBACK_IMAGE,
    description: row.description || row.short_description || "",
    specs,
    isBestSeller: !!row.is_best_seller,
    isNewArrival: !!row.is_new_arrival,
    stock: row.stock ?? 0,
  };
}

import { demoProducts } from "./demo-data";

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name, slug)")
      .eq("is_visible", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    const dbProducts = (data ?? []).map((r: any) => mapProduct(r, r.categories?.slug));
    return dbProducts.length > 0 ? dbProducts : demoProducts;
  } catch (err) {
    console.error("Supabase fetch failed, falling back to demo products", err);
    return demoProducts;
  }
}

export async function fetchProduct(id: string): Promise<Product | null> {
  const demoProd = demoProducts.find(p => p.id === id);
  if (demoProd) return demoProd;

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name, slug)")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return mapProduct(data, (data as any).categories?.slug);
  } catch (err) {
    return null;
  }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    fetchProducts()
      .then((p) => alive && setProducts(p))
      .catch(() => alive && setProducts([]))
      .finally(() => alive && setLoading(false));
    const ch = supabase
      .channel(`products-public-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        fetchProducts().then((p) => alive && setProducts(p)).catch(() => {});
      })
      .subscribe();
    return () => {
      alive = false;
      supabase.removeChannel(ch);
    };
  }, []);
  return { products, loading };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchProduct(id)
      .then((p) => alive && setProduct(p))
      .finally(() => alive && setLoading(false));

    // Re-fetch this specific product whenever it changes in the database
    // so the storefront detail page stays in sync with admin edits instantly.
    const ch = supabase
      .channel(`product-${id}-${Math.random().toString(36).slice(2, 8)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products", filter: `id=eq.${id}` },
        () => {
          fetchProduct(id)
            .then((p) => alive && setProduct(p))
            .catch(() => {});
        },
      )
      .subscribe();

    return () => {
      alive = false;
      supabase.removeChannel(ch);
    };
  }, [id]);
  return { product, loading };
}
