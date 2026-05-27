import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TyreHeroCanvas } from "@/components/TyreHeroCanvas";

export function Hero() {
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
    <section className="relative overflow-hidden bg-background min-h-[82vh] md:min-h-[90vh]">

      {/* ── Full-section background decorations ─────────────────── */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/12 blur-[120px] animate-pulse-glow" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[360px] h-[360px] rounded-full bg-primary/8 blur-[100px] animate-pulse-glow" style={{ animationDelay: "2.2s" }} />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_22%_55%,rgba(165,29,45,0.07),transparent_58%)]" />

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

      {/* ── True two-column grid ─────────────────────────────────── */}
      {/*
        This is the structural fix. Previously TyreHeroCanvas was absolute
        inset-0 over the FULL viewport width, so stopX was placing the tyre
        at ~70-80 % of the whole page — leaving a dark void in the middle and
        clipping the tyre on the right edge on wide screens.

        Now the canvas lives inside the right column and is constrained by it.
        stopX=0.2 means the tyre is slightly right-of-centre within its own
        column, which is always in the right half of the page.  No maths
        needed — if the column is on the right, the tyre is on the right. ✓
      */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-10
                      grid md:grid-cols-2 gap-0
                      min-h-[82vh] md:min-h-[90vh] items-center">

        {/* ── Left column: copy ────────────────────────────────── */}
        <div className="relative z-10 py-20 md:py-28 pr-0 md:pr-6">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-maroon text-foreground text-xs font-medium mb-7"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary-glow" />
            Free fitting · Premium delivery
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.85 }}
            className="font-serif text-[clamp(2.6rem,5vw,4.5rem)] font-bold leading-[1.06] mb-6 text-foreground tracking-tight"
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
            transition={{ delay: 0.35, duration: 0.8 }}
            className="text-base md:text-lg text-muted-foreground mb-9 max-w-sm md:max-w-md leading-relaxed"
          >
            Hand-picked performance tyres and bespoke forged rims from the
            world's finest manufacturers — delivered to your driveway.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.50, duration: 0.8 }}
            className="flex flex-wrap gap-3 mb-12"
          >
            <Button
              asChild size="lg"
              className="bg-gradient-primary hover:opacity-90 shadow-elegant text-primary-foreground border border-primary-glow/40 hover:scale-[1.03] transition-transform"
            >
              <Link to="/shop" search={{ category: "tyres" }}>
                Shop Now <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild size="lg" variant="outline"
              className="glass border-foreground/20 text-foreground hover:bg-foreground/6 hover:scale-[1.03] transition-transform"
            >
              <Link to="/shop" search={{ category: "rims" }}>Explore Rims</Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.78, duration: 0.9 }}
            className="flex items-center divide-x divide-border/60"
          >
            {[
              { n: "50+",  l: "Brands" },
              { n: "10k+", l: "Happy Drivers" },
              { n: "24h",  l: "Delivery" },
            ].map((s) => (
              <div key={s.l} className="flex flex-col px-5 first:pl-0 last:pr-0">
                <span className="font-serif text-2xl md:text-3xl font-bold text-primary-glow leading-none">
                  {s.n}
                </span>
                <span className="text-xs text-muted-foreground mt-1">{s.l}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right column: 3-D tyre (contained!) ──────────────── */}
        {/*
          self-stretch makes this column fill the full grid-row height.
          TyreHeroCanvas is absolute inset-0 so it fills exactly THIS column —
          never the full viewport.  The tyre with stopX=0.2 sits slightly right
          of the column centre, which is visually the right-centre of the page.

          A thin left-edge fade blends the canvas edge with the dark background
          so there's no hard cut between the two columns.
        */}
        <div className="hidden md:block relative self-stretch">
          {/* Left-edge blend strip */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none
                       bg-gradient-to-r from-background via-background/60 to-transparent"
          />
          <TyreHeroCanvas />
        </div>

      </div>
    </section>
  );
}
