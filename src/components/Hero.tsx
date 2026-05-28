import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Target, ShieldCheck, Activity, PackageCheck, Users } from "lucide-react";

const benefits = [
  { icon: <ShieldCheck className="w-5 h-5" />, title: "Premium Quality",      desc: "World-class brands" },
  { icon: <Activity    className="w-5 h-5" />, title: "Performance Tested",   desc: "For safety & durability" },
  { icon: <PackageCheck className="w-5 h-5"/>, title: "Fast & Secure",        desc: "Nationwide delivery" },
  { icon: <Users       className="w-5 h-5" />, title: "Expert Support",       desc: "Guidance you can trust" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#030303] min-h-[92vh] flex flex-col pt-20">
      {/* Hero background video */}
      <video
        className="absolute inset-0 z-0 w-full h-full object-cover"
        src="/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{ opacity: 0.88 }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#030303] via-[#030303]/75 to-transparent" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#030303] via-[#030303]/20 to-transparent" />

      {/* Red ambient glow — left */}
      <div className="absolute top-1/3 left-[-8%] w-[500px] h-[500px] bg-[#a51d2d]/18 rounded-full blur-[140px] z-0 pointer-events-none" />
      {/* Red ambient glow — bottom center */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] bg-[#a51d2d]/10 rounded-full blur-[100px] z-0 pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full flex-1 flex flex-col justify-center pb-44">
        <div className="max-w-xl relative mt-8 md:mt-0">

          {/* Eyebrow label */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.6 }}
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c1121f] mb-5"
          >
            Engineered for Performance
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.85 }}
            className="font-serif text-[clamp(3.2rem,5.8vw,5.5rem)] font-bold leading-[1.04] mb-6 text-[#f5f3f0] tracking-tight"
          >
            Drive with <br />
            <span
              className="text-[#c1121f]"
              style={{ textShadow: "0 0 40px rgba(193,18,31,0.6)" }}
            >
              Confidence.
            </span>
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="text-[0.95rem] text-gray-400 mb-10 max-w-[420px] leading-relaxed font-light"
          >
            Premium tyres crafted for those<br />
            who demand excellence.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/shop"
              search={{ category: "tyres" }}
              className="inline-flex items-center gap-2 text-white font-semibold text-sm px-7 py-4 rounded-md transition-all hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg,#6b1220 0%,#a51d2d 100%)",
                border: "1px solid rgba(165,29,45,0.6)",
                boxShadow: "0 0 28px rgba(165,29,45,0.3)",
              }}
            >
              Shop Premium Tyres <ArrowRight className="w-4 h-4 opacity-80" />
            </Link>
            <Link
              to="/shop"
              search={{ category: "rims" }}
              className="inline-flex items-center gap-2 text-white font-semibold text-sm px-7 py-4 rounded-md transition-all hover:bg-white/[0.05]"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <Target className="w-4 h-4 text-white/50" /> Find Your Fit
            </Link>
          </motion.div>
        </div>

        {/* Vertical scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 1 }}
          className="absolute right-5 md:right-8 bottom-36 hidden lg:flex flex-col items-center gap-5 text-white/25 text-[9px] tracking-[0.45em] uppercase"
        >
          <span style={{ writingMode: "vertical-rl" }} className="rotate-180">Scroll</span>
          <span className="w-px h-16 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </div>

      {/* Feature strip */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.8 }}
        className="absolute bottom-0 left-0 right-0 z-20 flex justify-center px-4 pb-0"
      >
        <div
          className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center gap-5 md:gap-2 px-8 md:px-12 py-6"
          style={{
            background: "rgba(8,4,9,0.75)",
            backdropFilter: "blur(20px)",
            borderRadius: "1.5rem 1.5rem 0 0",
            border: "1px solid rgba(255,255,255,0.04)",
            borderBottom: "none",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.4)",
          }}
        >
          {benefits.map((b, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div
                className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white/50 group-hover:text-[#c1121f] transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(193,18,31,0.3)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(255,255,255,0.07)";
                }}
              >
                {b.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-[#f5f3f0] text-sm font-medium leading-tight">{b.title}</span>
                <span className="text-white/35 text-[11px] mt-0.5 tracking-wide">{b.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
