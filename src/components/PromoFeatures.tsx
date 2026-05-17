import { motion } from "framer-motion";
import { Crown, Gem, Timer, Rocket } from "lucide-react";

const items = [
  { icon: Crown, title: "Premium Quality", desc: "Hand-selected from the world's finest manufacturers." },
  { icon: Gem, title: "Exclusive Collection", desc: "Bespoke forged rims you won't find anywhere else." },
  { icon: Timer, title: "Limited Edition", desc: "Numbered runs, signed by master engineers." },
  { icon: Rocket, title: "Fast Delivery", desc: "24h tracked shipping across the country." },
];

export function PromoFeatures() {
  return (
    <section className="relative max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(165,29,45,0.12),transparent_70%)] pointer-events-none" />

      <div className="relative text-center mb-14">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs uppercase tracking-[0.3em] text-primary-glow mb-3"
        >
          Why TyreLux
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-serif text-3xl md:text-5xl font-bold"
        >
          Crafted for the <span className="text-gradient">Discerning Driver</span>
        </motion.h2>
      </div>

      <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className="group relative rounded-2xl p-6 md:p-8 glass overflow-hidden"
          >
            {/* moving gradient border */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute inset-0 rounded-2xl bg-[conic-gradient(from_0deg,transparent,rgba(210,36,58,0.6),transparent_60%)] animate-tyre-spin" style={{ animationDuration: "6s" }} />
              <div className="absolute inset-[1px] rounded-2xl bg-card" />
            </div>
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center mb-5 shadow-glow group-hover:scale-110 transition-transform">
                <it.icon className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold mb-2 text-foreground">{it.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
