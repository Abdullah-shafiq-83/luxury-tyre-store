import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TyreHeroCanvas } from "@/components/TyreHeroCanvas";

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  size: 2 + Math.random() * 4,
  duration: 12 + Math.random() * 18,
  delay: Math.random() * 12,
}));

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background min-h-[75vh] md:min-h-[88vh] flex items-center">
      <TyreHeroCanvas />

      {/* Balanced cinematic tint */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,rgba(8,5,10,0.34)_34%,rgba(8,5,10,0.015)_48%,transparent_56%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_55%,rgba(165,29,45,0.06),transparent_66%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_74%_44%,rgba(210,36,58,0.001),transparent_68%)]" />
      <div className="absolute bottom-[12%] right-0 hidden h-px w-[60%] bg-gradient-to-r from-transparent via-primary-glow/6 to-transparent md:block" />

      {/* Soft glow accents */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[460px] h-[460px] rounded-full bg-primary/15 blur-[110px] animate-pulse-glow" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[380px] h-[380px] rounded-full bg-primary-glow/[0.02] blur-[110px] animate-pulse-glow" style={{ animationDelay: "2s" }} />

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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-32 grid md:grid-cols-2 gap-10 sm:gap-12 items-center w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-full sm:w-[85%] md:w-[48%] bg-[linear-gradient(90deg,rgba(10,8,15,0.96),rgba(10,8,15,0.16)_52%,transparent_100%)]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative z-10 max-w-xl sm:max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-maroon text-foreground text-xs font-medium mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary-glow" />
            Free fitting · Premium delivery
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 text-foreground"
          >
            Drive with{" "}
            <span className="text-gradient">Confidence</span>
            <br />
            Premium Tyres &<br />
            Alloy Rims
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-base md:text-lg text-muted-foreground mb-8 max-w-md"
          >
            Hand-picked performance tyres and bespoke forged rims from the world's
            finest manufacturers — delivered to your driveway.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap gap-3"
          >
            <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 shadow-elegant text-primary-foreground border border-primary-glow/40 hover:scale-[1.03] transition-transform">
              <Link to="/shop" search={{ category: "tyres" }}>
                Shop Now <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="glass border-foreground/20 text-foreground hover:bg-foreground/5 hover:scale-[1.03] transition-transform">
              <Link to="/shop" search={{ category: "rims" }}>Explore Rims</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="grid grid-cols-3 gap-6 mt-12 max-w-md"
          >
            {[
              { n: "50+", l: "Brands" },
              { n: "10k+", l: "Happy Drivers" },
              { n: "24h", l: "Delivery" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-serif text-2xl md:text-3xl font-bold text-primary-glow">{s.n}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="hidden md:block" />
      </div>
    </section>
  );
}
