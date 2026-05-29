import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/products";
import { useShop } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { ZoomImage } from "@/components/ZoomImage";
import { toast } from "sonner";

export function ProductCard({
  product,
  index = 0,
  zoomable = false,
}: {
  product: Product;
  index?: number;
  zoomable?: boolean;
}) {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const wished = wishlist.includes(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.06 }}
      className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary-glow/50 hover:shadow-glow transition-all duration-500 hover:-translate-y-1.5"
    >
      <button
        onClick={() => {
          toggleWishlist(product.id);
          toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
        }}
        className="absolute top-3 right-3 z-10 p-2 rounded-full glass hover:bg-primary/30 transition-colors"
        aria-label="Toggle wishlist"
      >
        <Heart className={`w-4 h-4 ${wished ? "fill-primary-glow text-primary-glow" : "text-foreground"}`} />
      </button>

      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <div className="aspect-square bg-gradient-warm overflow-hidden relative">
          {zoomable ? (
            <ZoomImage src={product.image} alt={product.name} className="w-full h-full" />
          ) : (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              width={800}
              height={800}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60 pointer-events-none" />
          {!zoomable && (
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors pointer-events-none" />
          )}

          {/* Discount badge on image */}
          {product.originalPrice && (
            <span
              className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md z-10"
              style={{
                background: "linear-gradient(135deg,#7b1020,#c1121f)",
                color: "#fff",
                boxShadow: "0 0 10px rgba(193,18,31,0.5)",
              }}
            >
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </span>
          )}
        </div>

        <div className="p-5">
          <div className="text-xs uppercase tracking-wider text-primary-glow/80 mb-1">
            {product.brand} · {product.size}
          </div>
          <h3 className="font-serif text-lg font-bold mb-2 text-foreground group-hover:text-primary-glow transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-sans text-xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-500 line-through leading-tight">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <Button
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
                toast.success(`${product.name} added to cart`);
              }}
              className="bg-gradient-primary text-primary-foreground hover:shadow-glow hover:scale-105 transition-all"
            >
              <ShoppingCart className="w-3.5 h-3.5 mr-1.5" /> Add
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
