import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

export function LatestProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { products } = useProducts();
  const latest = [...products].sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0)).slice(0, 8);

  const scroll = (dir: "l" | "r") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "r" ? 340 : -340, behavior: "smooth" });
  };

  return (
    <section className="relative max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-24">
      <div className="flex items-end justify-between mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-xs uppercase tracking-[0.3em] text-primary-glow mb-2">Just dropped</div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold">
            New <span className="text-gradient">Arrivals</span>
          </h2>
        </motion.div>
        <div className="hidden md:flex gap-2">
          <Button size="icon" variant="outline" onClick={() => scroll("l")} className="glass border-foreground/20 hover:border-primary-glow/40">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="outline" onClick={() => scroll("r")} className="glass border-foreground/20 hover:border-primary-glow/40">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {latest.map((p, i) => (
          <div key={p.id} className="snap-start shrink-0 w-[260px] md:w-[320px]">
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
