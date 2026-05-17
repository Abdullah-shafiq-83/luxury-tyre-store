import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { PromoFeatures } from "@/components/PromoFeatures";
import { StatsSection } from "@/components/StatsSection";
import { LatestProducts } from "@/components/LatestProducts";
import { ReviewsCarousel } from "@/components/ReviewsCarousel";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/lib/products";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TyreLux — Premium Tyres & Alloy Rims" },
      { name: "description", content: "Shop premium performance tyres and bespoke alloy rims. Fast delivery, free fitting." },
    ],
  }),
  component: Index,
});

function Index() {
  const { products } = useProducts();
  const featured = products.filter((p) => p.isBestSeller).slice(0, 6);
  const display = featured.length > 0 ? featured : products.slice(0, 6);
  return (
    <Layout>
      <Hero />

      {/* New animated promo block */}
      <PromoFeatures />

      {/* Best Sellers */}
      <section className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="flex items-end justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-xs uppercase tracking-[0.3em] text-primary-glow mb-2">Featured</div>
            <h2 className="font-serif text-3xl md:text-5xl font-bold">
              Best <span className="text-gradient">Sellers</span>
            </h2>
          </motion.div>
          <Button asChild variant="ghost" className="hidden md:inline-flex text-foreground hover:text-primary-glow">
            <Link to="/shop">View all →</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {display.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
          {products.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-12">No products yet — add some from the admin dashboard.</p>
          )}
        </div>
      </section>

      {/* Stats */}
      <StatsSection />

      {/* New Arrivals carousel */}
      <LatestProducts />

      {/* Reviews */}
      <ReviewsCarousel />

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { cat: "tyres" as const, title: "Performance Tyres", desc: "Engineered for grip, comfort and longevity." },
            { cat: "rims" as const, title: "Bespoke Alloy Rims", desc: "Forged designs that transform any vehicle." },
          ].map((c) => (
            <Link
              key={c.cat}
              to="/shop"
              search={{ category: c.cat }}
              className="group relative overflow-hidden rounded-2xl glass p-8 md:p-12 min-h-[260px] flex flex-col justify-between hover:border-primary-glow/40 hover:shadow-glow transition-all"
            >
              <div className="relative z-10">
                <h3 className="font-serif text-2xl md:text-3xl font-bold mb-2 text-foreground">{c.title}</h3>
                <p className="text-muted-foreground max-w-xs">{c.desc}</p>
              </div>
              <span className="relative z-10 text-primary-glow font-medium text-sm group-hover:translate-x-2 transition-transform inline-flex items-center gap-1">
                Shop {c.cat} →
              </span>
              <div className="absolute -right-10 -bottom-10 w-56 h-56 rounded-full bg-primary/20 blur-3xl group-hover:scale-125 transition-transform duration-700" />
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
