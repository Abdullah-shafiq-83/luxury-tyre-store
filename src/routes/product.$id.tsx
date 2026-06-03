import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, ArrowLeft, Check, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ZoomImage } from "@/components/ZoomImage";
import { fetchProduct, useProduct } from "@/lib/products";
import { useShop } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ params }) => ({ product: await fetchProduct(params.id) }),
  head: ({ params, loaderData }) => {
    const p = loaderData?.product;
    const url = `https://luxury-tyre-store.lovable.app/product/${params.id}`;
    if (!p) {
      return {
        meta: [
          { title: "Product — TyreLux" },
          { name: "description", content: "Premium tyres and alloy rims at TyreLux." },
          { property: "og:url", content: url },
        ],
        links: [{ rel: "canonical", href: url }],
      };
    }
    const title = `${p.name} — ${p.brand} | TyreLux`;
    const desc = (p.description || `Shop the ${p.name} from ${p.brand} at TyreLux. Free fitting and 5-year warranty.`).slice(0, 155);
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { property: "og:image", content: p.image },
        { property: "twitter:image", content: p.image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name,
            description: p.description || undefined,
            image: p.image,
            brand: { "@type": "Brand", name: p.brand },
            offers: {
              "@type": "Offer",
              priceCurrency: "USD",
              price: p.price,
              availability:
                (p.stock ?? 0) > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              url,
            },
          }),
        },
      ],
    };
  },
  component: ProductPage,
});


function ProductPage() {
  const { id } = Route.useParams();
  const { product, loading } = useProduct(id);
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const [qty, setQty] = useState(1);
  const [activeIdx, setActiveIdx] = useState(0);

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
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const activeImage = images[activeIdx] ?? product.image;
  const hasMultiple = images.length > 1;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </Link>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* ── Image Gallery Column ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative flex flex-col gap-4"
          >
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full mix-blend-screen pointer-events-none" />

            {/* Main image */}
            <div className="relative aspect-square glass-card rounded-2xl overflow-hidden shadow-glow z-10 flex items-center justify-center p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full"
                >
                  <ZoomImage src={activeImage} alt={product.name} zoom={2.5} className="w-full h-full object-contain" />
                </motion.div>
              </AnimatePresence>

              {/* Reflection */}
              <div className="absolute bottom-0 left-10 right-10 h-1/4 bg-gradient-to-t from-black/50 to-transparent blur-md pointer-events-none" />

              {/* Prev / Next arrows — shown only when multiple images */}
              {hasMultiple && (
                <>
                  <button
                    onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
                    disabled={activeIdx === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-20"
                    style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => setActiveIdx((i) => Math.min(images.length - 1, i + 1))}
                    disabled={activeIdx === images.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-20"
                    style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>

                  {/* Dot indicator */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveIdx(i)}
                        className="transition-all rounded-full"
                        style={{
                          width: i === activeIdx ? 20 : 6,
                          height: 6,
                          background: i === activeIdx ? "#c1121f" : "rgba(255,255,255,0.35)",
                        }}
                        aria-label={`Image ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail strip — only when multiple images */}
            {hasMultiple && (
              <div className="flex gap-3 overflow-x-auto pb-1 z-10">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-200"
                    style={{
                      border: i === activeIdx
                        ? "2px solid #c1121f"
                        : "2px solid rgba(255,255,255,0.1)",
                      boxShadow: i === activeIdx ? "0 0 14px rgba(193,18,31,0.45)" : "none",
                      opacity: i === activeIdx ? 1 : 0.55,
                    }}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img
                      src={src}
                      alt={`${product.name} view ${i + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Info Column ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
              {product.brand} · {product.category}
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4">{product.name}</h1>

            {/* Price block */}
            {product.originalPrice ? (() => {
              const pct = Math.round((1 - product.price / product.originalPrice) * 100);
              const saving = (product.originalPrice - product.price).toFixed(2);
              return (
                <div className="mb-6">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
                    style={{
                      background: "rgba(193,18,31,0.15)",
                      border: "1px solid rgba(193,18,31,0.4)",
                      color: "#c1121f",
                      boxShadow: "0 0 12px rgba(193,18,31,0.2)",
                    }}
                  >
                    🔥 {pct}% OFF — Limited Offer
                  </span>
                  <div className="flex items-baseline gap-4 flex-wrap">
                    <span className="font-serif text-4xl font-bold text-white" style={{ textShadow: "0 0 20px rgba(193,18,31,0.4)" }}>
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-xl font-medium text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-[#c1121f]">You save ${saving}</p>
                </div>
              );
            })() : (
              <div className="text-3xl font-bold mb-6">${product.price.toFixed(2)}</div>
            )}

            <p className="text-muted-foreground mb-8 leading-relaxed">{product.description}</p>

            {Object.keys(product.specs).length > 0 && (
              <div className="bg-muted/40 rounded-xl p-5 mb-8">
                <h2 className="font-serif font-bold mb-3">Specifications</h2>
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
