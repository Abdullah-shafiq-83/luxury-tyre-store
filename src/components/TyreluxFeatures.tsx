import { ShieldCheck, Zap, Gem, Users } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    title: "Unmatched Safety",
    description: "Tested for superior grip, braking & control.",
  },
  {
    icon: <Zap className="w-7 h-7" />,
    title: "High Performance",
    description: "Optimized for dry, wet and all-road conditions.",
  },
  {
    icon: <Gem className="w-7 h-7" />,
    title: "Premium Brands",
    description: "Handpicked from the world's most trusted manufacturers.",
  },
  {
    icon: <Users className="w-7 h-7" />,
    title: "Expert Guidance",
    description: "We help you find the perfect tyre for your vehicle.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0 },
};

export function TyreluxFeatures() {
  return (
    <section className="py-28 bg-[#030303] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(165,29,45,0.07),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c1121f] mb-5">
            Why TyreLux
          </p>
          <h2 className="font-serif text-4xl md:text-[3.25rem] font-bold text-white leading-tight">
            Every Drive.{" "}
            <span
              className="text-[#c1121f]"
              style={{ textShadow: "0 0 28px rgba(193,18,31,0.55)" }}
            >
              Elevated.
            </span>
          </h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={item}
              className="group relative rounded-xl p-8 overflow-hidden cursor-default"
              style={{
                background: "rgba(255,255,255,0.022)",
                backdropFilter: "blur(18px)",
                border: "1px solid rgba(255,48,64,0.12)",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.45), 0 0 0 0 rgba(193,18,31,0)",
                transition:
                  "transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease, border-color 0.35s ease",
              }}
              whileHover={{
                y: -8,
                boxShadow:
                  "0 16px 40px rgba(0,0,0,0.55), 0 0 30px rgba(193,18,31,0.1)",
                borderColor: "rgba(193,18,31,0.28)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[rgba(193,18,31,0.07)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10">
                {/* Icon circle */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-[#c1121f] mb-4 group-hover:shadow-[0_0_22px_rgba(193,18,31,0.4)] transition-shadow duration-300"
                  style={{
                    background: "rgba(193,18,31,0.09)",
                    border: "1px solid rgba(193,18,31,0.28)",
                  }}
                >
                  {f.icon}
                </div>

                {/* Red accent bar */}
                <div
                  className="h-0.5 bg-[#c1121f] mb-5 transition-all duration-300 group-hover:w-16"
                  style={{ width: "2.5rem" }}
                />

                <h3 className="font-serif text-[1.05rem] font-bold text-white mb-3 leading-snug">
                  {f.title}
                </h3>
                <p className="text-[0.82rem] text-gray-500 leading-relaxed">
                  {f.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
