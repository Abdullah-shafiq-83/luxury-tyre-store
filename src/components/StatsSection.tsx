import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { Users, Package, Truck, Clock } from "lucide-react";

function Counter({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => prefix + Math.floor(v).toLocaleString() + suffix);

  useEffect(() => {
    if (inView) {
      const controls = animate(mv, to, { duration: 2.2, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, to, mv]);

  useEffect(() => {
    return rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = v;
    });
  }, [rounded]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

const stats = [
  { icon: Users, value: 1062, suffix: "+", label: "Happy Customers" },
  { icon: Package, value: 50, suffix: "K+", label: "Premium Tyres Sold" },
  { icon: Truck, value: 24, suffix: "H", label: "Fast Delivery" },
  { icon: Clock, value: 7, suffix: "+", label: "Years of Excellence" },
];

export function StatsSection() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0 bg-[#030303]" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1400&q=60')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#030303] via-[#030303]/60 to-[#030303]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(165,29,45,0.1),transparent_65%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-gray-400 mb-5">
            Why Choose TyreLux
          </p>
          <h2 className="font-serif text-4xl md:text-[3rem] font-bold text-white leading-tight">
            Built on Quality.{" "}
            <span
              className="text-[#c1121f]"
              style={{ textShadow: "0 0 28px rgba(193,18,31,0.55)" }}
            >
              Driven by Trust.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}
              className="group text-center p-8 rounded-xl relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.025)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                transition: "transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
              }}
              whileHover={{
                y: -8,
                boxShadow: "0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(193,18,31,0.15)",
                borderColor: "rgba(193,18,31,0.25)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

              <div
                className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-5 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-shadow"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <s.icon className="w-7 h-7 text-white/80" />
              </div>

              <div className="font-serif text-4xl md:text-5xl font-bold text-white mb-2" style={{ textShadow: "0 0 20px rgba(255,255,255,0.25)" }}>
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <p className="text-[0.75rem] font-medium uppercase tracking-wider text-gray-400">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
