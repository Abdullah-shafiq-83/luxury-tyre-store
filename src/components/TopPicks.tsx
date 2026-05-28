import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useShop } from "@/store/cart";
import { toast } from "sonner";
import type { Product } from "@/lib/products";

const featuredProducts: Product[] = [
  {
    id: "michelin-ps5",
    name: "Pilot Sport 5",
    brand: "Michelin",
    category: "tyres",
    price: 270,
    size: "225/40 ZR18",
    image: "https://images.unsplash.com/photo-1600705663738-963d8d64190c?auto=format&fit=crop&w=700&q=80",
    description: "Ultra-high performance tyre.",
    specs: {},
    isBestSeller: true,
    stock: 20,
  },
  {
    id: "continental-pc7",
    name: "PremiumContact 7",
    brand: "Continental",
    category: "tyres",
    price: 210,
    size: "225/45 R17",
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=700&q=80",
    description: "Extreme confidence at all speeds.",
    specs: {},
    stock: 30,
  },
  {
    id: "bridgestone-s007a",
    name: "Potenza S007A",
    brand: "Bridgestone",
    category: "tyres",
    price: 260,
    size: "245/40 ZR18",
    image: "https://images.unsplash.com/photo-1580274455006-258169cd56a7?auto=format&fit=crop&w=700&q=80",
    description: "Race-inspired grip and precision.",
    specs: {},
    stock: 18,
  },
  {
    id: "pirelli-pzero-pz4",
    name: "P Zero (PZ4)",
    brand: "Pirelli",
    category: "tyres",
    price: 280,
    size: "255/35 ZR19",
    image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=700&q=80",
    description: "Street-legal track tyre for dry performance.",
    specs: {},
    isNewArrival: true,
    stock: 12,
  },
  {
    id: "goodyear-ef1",
    name: "Eagle F1 SuperSport",
    brand: "Goodyear",
    category: "tyres",
    price: 310,
    size: "255/35 R20",
    image: "https://images.unsplash.com/photo-1601614945415-0d3ee77a2886?auto=format&fit=crop&w=700&q=80",
    description: "Superior handling on dry roads.",
    specs: {},
    stock: 14,
  },
  {
    id: "yokohama-an09",
    name: "Advan Neova AD09",
    brand: "Yokohama",
    category: "tyres",
    price: 340,
    size: "265/35 R18",
    image: "https://images.unsplash.com/photo-1533038676263-0d33bdfc54da?auto=format&fit=crop&w=700&q=80",
    description: "Next-gen extreme performance summer tyre.",
    specs: {},
    stock: 8,
  },
];

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
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
            style={{ transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.08)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-70" />
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
          <span className="font-sans text-lg font-bold text-white">
            ${product.price.toFixed(2)}
          </span>
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
  const [idx, setIdx] = useState(0);
  const maxIdx = featuredProducts.length - VISIBLE;
  const canPrev = idx > 0;
  const canNext = idx < maxIdx;

  const visible = featuredProducts.slice(idx, idx + VISIBLE);

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
