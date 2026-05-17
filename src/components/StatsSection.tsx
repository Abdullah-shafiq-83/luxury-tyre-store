import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { Users, Sparkles, Globe2, ShieldCheck } from "lucide-react";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.floor(v).toLocaleString() + suffix);

  useEffect(() => {
    if (inView) {
      const controls = animate(mv, to, { duration: 2, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, to, mv]);

  useEffect(() => {
    return rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = v;
    });
  }, [rounded]);

  return <span ref={ref}>0{suffix}</span>;
}

const stats = [
  { icon: Users, value: 12000, suffix: "+", label: "Trusted by Customers" },
  { icon: Sparkles, value: 50, suffix: "+", label: "Premium Brands" },
  { icon: Globe2, value: 80, suffix: "+", label: "Worldwide Shipping" },
  { icon: ShieldCheck, value: 100, suffix: "%", label: "Secure Payments" },
];

export function StatsSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-glow/40 to-transparent" />
      <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-glow/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <div className="text-xs uppercase tracking-[0.3em] text-primary-glow mb-3">By the numbers</div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold">
            A Reputation <span className="text-gradient">Earned</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative rounded-2xl p-6 md:p-8 text-center glass group hover:border-primary-glow/40 transition-colors"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 border border-primary-glow/30 flex items-center justify-center mb-4 shadow-glow group-hover:scale-110 transition-transform">
                <s.icon className="w-6 h-6 text-primary-glow" />
              </div>
              <div className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-1">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
