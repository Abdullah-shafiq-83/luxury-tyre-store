import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setEmail("");
  }

  return (
    <section className="py-16 bg-[#030303] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(165,29,45,0.1),transparent_55%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-2xl px-8 md:px-14 py-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.025)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(193,18,31,0.18)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(193,18,31,0.07)",
          }}
        >
          {/* Glow orbs */}
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-[#c1121f]/12 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-[#c1121f]/10 rounded-full blur-[80px] pointer-events-none" />

          {/* Left: icon + copy */}
          <div className="relative z-10 flex items-center gap-5 md:flex-shrink-0">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(193,18,31,0.15)",
                border: "1px solid rgba(193,18,31,0.35)",
                boxShadow: "0 0 20px rgba(193,18,31,0.25)",
              }}
            >
              <Mail className="w-6 h-6 text-[#c1121f]" />
            </div>
            <div>
              <h3 className="font-serif text-xl md:text-2xl font-bold text-white leading-snug">
                Stay Ahead with TyreLux
              </h3>
              <p className="text-[0.8rem] text-gray-500 mt-1 max-w-xs">
                Exclusive offers, new arrivals &amp; tyre tips delivered to your inbox.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block flex-shrink-0 h-16 w-px bg-white/[0.07]" />

          {/* Right: form */}
          <form
            onSubmit={handleSubmit}
            className="relative z-10 flex flex-col sm:flex-row gap-3 w-full md:flex-1"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 bg-black/40 backdrop-blur-sm border border-white/10 text-white text-sm px-5 py-3.5 rounded-xl focus:outline-none focus:border-[#c1121f]/50 focus:ring-1 focus:ring-[#c1121f]/50 placeholder:text-gray-600 transition-all"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 text-white font-semibold text-sm px-7 py-3.5 rounded-xl whitespace-nowrap transition-all hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: sent
                  ? "rgba(34,197,94,0.7)"
                  : "linear-gradient(135deg,#7b1020 0%,#c1121f 100%)",
                boxShadow: "0 0 24px rgba(193,18,31,0.3)",
              }}
            >
              {sent ? "Subscribed!" : (
                <>
                  Subscribe <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
