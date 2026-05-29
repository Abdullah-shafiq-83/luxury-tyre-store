import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useShop } from "@/store/cart";
import { toast } from "sonner";
import type { Product } from "@/lib/products";
import { useProducts } from "@/lib/products";

const VISIBLE = 4;

function ProductTile({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const wished = wishlist.includes(product.id);

  return (
    <div
      className="relative group flex-shrink-0 rounded-xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,48,64,0.12)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
        transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease, border-color 0.35s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-8px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(193,18,31,0.12)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(193,18,31,0.3)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.45)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,48,64,0.12)";
      }}
    >
      {/* Wishlist */}
      <button
        onClick={() => {
          toggleWishlist(product.id);
          toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
        }}
        className="absolute top-3 right-3 z-10 p-2 rounded-full transition-colors"
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
        aria-label="Toggle wishlist"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${wished ? "fill-[#c1121f] text-[#c1121f]" : "text-white/70 hover:text-white"}`}
        />
      </button>

      {/* Image */}
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <div className="aspect-square overflow-hidden bg-[#0a0507] relative">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700"
            style={{ transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.08)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-70" />
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
      </Link>

      {/* Info */}
      <div className="p-5 pt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c1121f] mb-1">
          {product.brand}
        </p>
        <Link to="/product/$id" params={{ id: product.id }}>
          <h3 className="font-serif text-base font-bold text-white leading-snug mb-1 hover:text-[#c1121f] transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-[0.75rem] text-gray-500 mb-4">{product.size}</p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-sans text-lg font-bold text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through leading-tight">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={() => {
              addToCart(product);
              toast.success(`${product.name} added to cart`);
            }}
            className="p-2 rounded-lg transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg,#7b1020 0%,#c1121f 100%)",
              boxShadow: "0 0 16px rgba(193,18,31,0.3)",
            }}
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function TopPicks() {
  const { products, loading } = useProducts();
  const [idx, setIdx] = useState(0);

  const maxIdx = Math.max(0, products.length - VISIBLE);
  const canPrev = idx > 0;
  const canNext = idx < maxIdx;

  const visible = products.slice(idx, idx + VISIBLE);

  return (
    <section className="py-24 bg-[#08050a] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(165,29,45,0.04),transparent_55%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c1121f] mb-3">
              Featured Tyres
            </p>
            <h2 className="font-serif text-3xl md:text-[2.5rem] font-bold text-white leading-tight">
              Top Picks for{" "}
              <span
                className="text-[#c1121f]"
                style={{ textShadow: "0 0 24px rgba(193,18,31,0.45)" }}
              >
                Peak Performance
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="hidden md:flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mr-2"
            >
              View All Tyres <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setIdx(Math.max(0, idx - 1))}
              disabled={!canPrev}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-white/50 hover:text-white hover:border-[#c1121f]/50 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
              style={{ background: "rgba(255,255,255,0.04)" }}
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIdx(Math.min(maxIdx, idx + 1))}
              disabled={!canNext}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-white/50 hover:text-white hover:border-[#c1121f]/50 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
              style={{ background: "rgba(255,255,255,0.04)" }}
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#c1121f]" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {visible.map((p) => (
                <ProductTile key={p.id} product={p} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Mobile "View All" */}
        <div className="mt-10 flex justify-center md:hidden">
          <Link
            to="/shop"
            className="flex items-center gap-2 text-sm text-[#c1121f] hover:text-white transition-colors"
          >
            View All Tyres <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
