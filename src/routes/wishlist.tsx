import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useShop } from "@/store/cart";
import { useProducts } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — TyreLux" }] }),
  component: Wishlist,
});

function Wishlist() {
  const wishlist = useShop((s) => s.wishlist);
  const { products } = useProducts();
  const items = products.filter((p) => wishlist.includes(p.id));

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8">Wishlist</h1>
        {items.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-2xl">
            <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-6">No favourites yet.</p>
            <Button asChild className="bg-gradient-primary text-primary-foreground">
              <Link to="/shop">Browse products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
