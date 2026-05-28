import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const selectClass =
  "w-full bg-[rgba(10,5,7,0.85)] backdrop-blur-sm border border-white/10 text-white text-sm rounded-lg px-4 py-3.5 focus:ring-1 focus:ring-[#c1121f] focus:border-[#c1121f] outline-none transition-all appearance-none cursor-pointer hover:border-white/20";

export function VehicleSelector() {
  return (
    <section className="py-24 bg-[#030303] relative overflow-hidden border-y border-white/[0.04]">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,rgba(165,29,45,0.06),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c1121f] mb-5">
              Shop by Vehicle
            </p>
            <h2 className="font-serif text-3xl md:text-[2.8rem] font-bold text-white leading-tight mb-6">
              Find the{" "}
              <span
                className="text-[#c1121f]"
                style={{ textShadow: "0 0 24px rgba(193,18,31,0.45)" }}
              >
                Perfect Tyre
              </span>
              <br />
              for Your Vehicle
            </h2>
            <p className="text-[0.95rem] text-gray-500 leading-relaxed max-w-md">
              Select your vehicle details and we'll show you the perfect match.
            </p>
          </motion.div>

          {/* Right glass card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative rounded-2xl p-8 md:p-10 overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.025)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(193,18,31,0.18)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(193,18,31,0.06)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(193,18,31,0.04)] to-transparent pointer-events-none rounded-2xl" />

            <div className="relative z-10 space-y-4">
              {/* Row 1 — 3 dropdowns */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Vehicle Type
                  </label>
                  <select className={selectClass}>
                    <option value="">Select Type</option>
                    <option>Sedan</option>
                    <option>SUV</option>
                    <option>Sports Car</option>
                    <option>Truck</option>
                    <option>Van</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Make
                  </label>
                  <select className={selectClass}>
                    <option value="">Select Make</option>
                    <option>BMW</option>
                    <option>Mercedes-Benz</option>
                    <option>Audi</option>
                    <option>Porsche</option>
                    <option>Ferrari</option>
                    <option>Lamborghini</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Model
                  </label>
                  <select className={selectClass}>
                    <option value="">Select Model</option>
                  </select>
                </div>
              </div>

              {/* Row 2 — Year */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Year
                  </label>
                  <select className={selectClass}>
                    <option value="">Select Year</option>
                    {Array.from({ length: 26 }, (_, i) => 2025 - i).map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* CTA */}
              <Button
                className="w-full text-white font-semibold text-sm py-4 h-auto rounded-lg flex items-center justify-center gap-2 group transition-all duration-300 border-none mt-2"
                style={{
                  background: "linear-gradient(135deg,#7b1020 0%,#c1121f 100%)",
                  boxShadow: "0 0 30px rgba(193,18,31,0.28)",
                }}
              >
                View Recommended Tyres
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
