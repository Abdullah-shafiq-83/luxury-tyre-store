import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, ArrowLeft, Check, Loader2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ZoomImage } from "@/components/ZoomImage";
import { useProduct } from "@/lib/products";
import { useShop } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: "Product — TyreLux" },
      { name: "description", content: "Premium tyres and alloy rims at TyreLux." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { product, loading } = useProduct(id);
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const [qty, setQty] = useState(1);

  if (loading) {
    return (
      <Layout>
        <div className="grid place-items-center py-32">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-32 text-center">
          <h1 className="font-serif text-4xl font-bold mb-2">Product not found</h1>
          <Link to="/shop" className="text-primary hover:underline">Back to shop</Link>
        </div>
      </Layout>
    );
  }

  const wished = wishlist.includes(product.id);
  const outOfStock = (product.stock ?? 0) <= 0;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </Link>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="aspect-square bg-gradient-warm rounded-2xl overflow-hidden border border-border shadow-soft"
          >
            <ZoomImage src={product.image} alt={product.name} zoom={2.5} className="w-full h-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
              {product.brand} · {product.category}
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4">{product.name}</h1>
            <div className="text-3xl font-bold mb-6">${product.price}</div>
            <p className="text-muted-foreground mb-8 leading-relaxed">{product.description}</p>

            {Object.keys(product.specs).length > 0 && (
              <div className="bg-muted/40 rounded-xl p-5 mb-8">
                <h3 className="font-serif font-bold mb-3">Specifications</h3>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-muted-foreground text-xs">{k}</dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border border-input rounded-md">
                <button className="w-10 h-10 hover:bg-muted transition-colors" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span className="w-10 text-center font-medium">{qty}</span>
                <button className="w-10 h-10 hover:bg-muted transition-colors" onClick={() => setQty(qty + 1)}>+</button>
              </div>
              <Button
                size="lg"
                disabled={outOfStock}
                className="flex-1 bg-gradient-primary text-primary-foreground shadow-elegant"
                onClick={() => {
                  addToCart(product, qty);
                  toast.success(`${product.name} added to cart`);
                }}
              >
                <ShoppingCart className="w-4 h-4 mr-2" /> {outOfStock ? "Out of stock" : "Add to Cart"}
              </Button>
              <Button size="lg" variant="outline" onClick={() => toggleWishlist(product.id)} aria-label="Wishlist">
                <Heart className={`w-4 h-4 ${wished ? "fill-primary text-primary" : ""}`} />
              </Button>
            </div>

            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Free fitting included", "24h delivery", "5-year warranty"].map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" /> {b}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
