import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TyreHeroCanvas } from "@/components/TyreHeroCanvas";

export function Hero() {
  // useMemo prevents hydration mismatch from Math.random() on re-renders
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 12 + Math.random() * 18,
        delay: Math.random() * 12,
      })),
    [],
  );

  return (
    <section className="relative overflow-hidden bg-background min-h-[80vh] md:min-h-[90vh] flex items-center">
      {/* ── 3-D tyre canvas ─────────────────────────────────────────── */}
      <TyreHeroCanvas />

      {/*
        Gradient overlay — covers 0 → 55 % with a dark wash so white text is
        legible, then fades to transparent by 62 % so the tyre (now centred
        at ~70 % of the viewport) blends cleanly without a visible dark gap.
      */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,var(--background)_20%,rgba(8,5,10,0.88)_38%,rgba(8,5,10,0.30)_52%,rgba(8,5,10,0.04)_62%,transparent_70%)]" />

      {/* Subtle centre-left glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_55%,rgba(165,29,45,0.07),transparent_60%)]" />

      {/* Hairline rule at the tyre baseline */}
      <div className="absolute bottom-[12%] right-0 hidden h-px w-[55%] bg-gradient-to-r from-transparent via-primary-glow/8 to-transparent md:block" />

      {/* Background glow blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[460px] h-[460px] rounded-full bg-primary/14 blur-[110px] animate-pulse-glow" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[340px] h-[340px] rounded-full bg-primary-glow/[0.025] blur-[100px] animate-pulse-glow" style={{ animationDelay: "2s" }} />

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full bg-primary-glow/60 animate-particle"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              boxShadow: "0 0 8px rgba(210,36,58,0.8)",
            }}
          />
        ))}
      </div>

      {/*
        Two-column layout:
          • Left  (55 %): hero copy — wide enough to avoid the narrow-column look
          • Right (45 %): invisible spacer — the 3-D tyre fills this area via the canvas
        The overlay above handles readability over the gradient seam.
      */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-16 sm:py-20 md:py-28">
        {/* Readability scrim — sits only behind the text column */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-[58%] md:w-[52%] rounded-r-3xl bg-[linear-gradient(90deg,rgba(8,5,10,0.82)_0%,rgba(8,5,10,0.40)_60%,transparent_100%)] opacity-90"
        />

        <div className="relative z-10 max-w-lg md:max-w-xl lg:max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-maroon text-foreground text-xs font-medium mb-7"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary-glow" />
            Free fitting · Premium delivery
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-serif text-[clamp(2.4rem,5.5vw,4.5rem)] font-bold leading-[1.06] mb-6 text-foreground tracking-tight"
          >
            Drive with{" "}
            <span className="text-gradient">Confidence</span>
            <br />
            Premium Tyres &<br />
            Alloy Rims
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.8 }}
            className="text-base md:text-lg text-muted-foreground mb-9 max-w-md leading-relaxed"
          >
            Hand-picked performance tyres and bespoke forged rims from the world's
            finest manufacturers — delivered to your driveway.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.54, duration: 0.8 }}
            className="flex flex-wrap gap-3 mb-12"
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-primary hover:opacity-90 shadow-elegant text-primary-foreground border border-primary-glow/40 hover:scale-[1.03] transition-transform"
            >
              <Link to="/shop" search={{ category: "tyres" }}>
                Shop Now <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="glass border-foreground/20 text-foreground hover:bg-foreground/6 hover:scale-[1.03] transition-transform"
            >
              <Link to="/shop" search={{ category: "rims" }}>Explore Rims</Link>
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.82, duration: 0.9 }}
            className="flex items-center divide-x divide-border/50"
          >
            {[
              { n: "50+",  l: "Brands" },
              { n: "10k+", l: "Happy Drivers" },
              { n: "24h",  l: "Delivery" },
            ].map((s) => (
              <div key={s.l} className="flex flex-col px-6 first:pl-0 last:pr-0">
                <span className="font-serif text-2xl md:text-3xl font-bold text-primary-glow leading-none">
                  {s.n}
                </span>
                <span className="text-xs text-muted-foreground mt-1">{s.l}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
