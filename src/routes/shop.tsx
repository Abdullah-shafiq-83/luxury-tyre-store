import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

type Search = { category?: "tyres" | "rims" | "all"; brand?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    category: (s.category as Search["category"]) ?? "all",
    brand: (s.brand as string) ?? undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop Tyres & Rims — TyreLux" },
      { name: "description", content: "Browse our full collection of performance tyres and luxury alloy rims." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { category } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { products, loading } = useProducts();
  const [maxPrice, setMaxPrice] = useState(2000);
  const [brand, setBrand] = useState<string>("all");

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand).filter(Boolean))),
    [products]
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category && category !== "all" && p.category !== category) return false;
      if (brand !== "all" && p.brand !== brand) return false;
      if (p.price > maxPrice) return false;
      return true;
    });
  }, [products, category, brand, maxPrice]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <div className="mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2">Shop</h1>
          <p className="text-muted-foreground">Premium tyres & alloy rims, curated for you.</p>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Filters */}
          <aside className="glass-card rounded-xl p-5 h-fit sticky top-20 z-10 relative overflow-hidden">
            <h3 className="font-serif font-bold mb-4 text-glow">Filter</h3>

            <div className="mb-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Category</div>
              <div className="flex flex-wrap gap-2">
                {(["all", "tyres", "rims"] as const).map((c) => (
                  <Button
                    key={c}
                    size="sm"
                    variant={category === c ? "default" : "outline"}
                    onClick={() => navigate({ search: { category: c } })}
                    className={category === c ? "bg-primary text-primary-foreground shadow-glow" : "glass hover:bg-primary/20"}
                  >
                    {c[0].toUpperCase() + c.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Brand</div>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-background/50 glass border border-input rounded-md px-3 py-2 text-sm"
              >
                <option value="all" className="bg-background">All brands</option>
                {brands.map((b) => (
                  <option key={b} value={b} className="bg-background">{b}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs uppercase tracking-wider text-muted-foreground mb-3">
                <span>Max price</span>
                <span className="text-foreground font-semibold">${maxPrice}</span>
              </div>
              <Slider
                min={100}
                max={3000}
                step={50}
                value={[maxPrice]}
                onValueChange={(v) => setMaxPrice(v[0])}
              />
            </div>
          </aside>

          {/* Grid */}
          <div>
            <div className="text-sm text-muted-foreground mb-4">{filtered.length} products</div>
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">No products match your filters.</div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} zoomable />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
