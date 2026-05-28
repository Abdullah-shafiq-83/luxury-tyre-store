import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const reviews = [
  {
    name: "Daniel K.",
    role: "BMW 330i Owner",
    avatar: "https://i.pravatar.cc/120?img=11",
    rating: 5,
    text: "TyreLux helped me find the perfect tyres for my car. The difference in grip and comfort is incredible. Highly recommended!",
  },
  {
    name: "Sophia Lin",
    role: "BMW M4 Driver",
    avatar: "https://i.pravatar.cc/120?img=47",
    rating: 5,
    text: "From browsing to delivery, every touchpoint feels premium. The black-and-red design made buying tyres feel like buying jewellery.",
  },
  {
    name: "Marco Rossi",
    role: "Audi RS6 Owner",
    avatar: "https://i.pravatar.cc/120?img=33",
    rating: 5,
    text: "Worldwide shipping was seamless and customer support is on another level. I'll never shop tyres anywhere else.",
  },
  {
    name: "Aisha Khan",
    role: "Mercedes AMG Driver",
    avatar: "https://i.pravatar.cc/120?img=49",
    rating: 5,
    text: "The Pilot Sport 4S transformed my car — the fitting service was flawless and the team genuinely understands performance driving.",
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < n ? "fill-[#c1121f] text-[#c1121f]" : "text-gray-600"}`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, dim = false }: { review: (typeof reviews)[0]; dim?: boolean }) {
  return (
    <div
      className="rounded-xl p-6 flex flex-col gap-4 select-none transition-all duration-400 h-full"
      style={{
        background: "rgba(255,255,255,0.025)",
        backdropFilter: "blur(16px)",
        border: `1px solid ${dim ? "rgba(255,255,255,0.04)" : "rgba(193,18,31,0.2)"}`,
        boxShadow: dim ? "none" : "0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(193,18,31,0.06)",
        opacity: dim ? 0.45 : 1,
      }}
    >
      <Stars n={review.rating} />
      <p className="text-[0.87rem] text-gray-300 leading-relaxed flex-1">"{review.text}"</p>
      <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
        <img
          src={review.avatar}
          alt={review.name}
          className="w-10 h-10 rounded-full object-cover"
          style={{ border: "2px solid rgba(193,18,31,0.5)" }}
        />
        <div>
          <p className="text-sm font-semibold text-white leading-none mb-0.5">{review.name}</p>
          <p className="text-[0.72rem] text-[#c1121f]">{review.role}</p>
        </div>
      </div>
    </div>
  );
}

export function ReviewsCarousel() {
  const [active, setActive] = useState(0);
  const total = reviews.length;
  const prev = () => setActive((a) => (a - 1 + total) % total);
  const next = () => setActive((a) => (a + 1) % total);

  // Show 3 cards: active, active+1, active+2 (wrapping)
  const visible = [0, 1, 2].map((offset) => reviews[(active + offset) % total]);

  return (
    <section className="py-24 bg-[#030303] relative overflow-hidden border-y border-white/[0.04]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(165,29,45,0.07),transparent_65%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c1121f] mb-4">
              Driven by Real Experiences
            </p>
            <h2 className="font-serif text-3xl md:text-[2.5rem] font-bold text-white leading-tight">
              What Our{" "}
              <span
                className="text-[#c1121f]"
                style={{ textShadow: "0 0 24px rgba(193,18,31,0.45)" }}
              >
                Customers Say
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#"
              className="hidden md:flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mr-2"
            >
              View All Reviews <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-white/50 hover:text-white hover:border-[#c1121f]/50 transition-all"
              style={{ background: "rgba(255,255,255,0.04)" }}
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-white/50 hover:text-white hover:border-[#c1121f]/50 transition-all"
              style={{ background: "rgba(255,255,255,0.04)" }}
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {visible.map((r, i) => (
              <ReviewCard key={r.name + i} review={r} dim={i > 0} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-10">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Review ${i + 1}`}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === active ? "2.5rem" : "0.75rem",
                background: i === active ? "#c1121f" : "rgba(255,255,255,0.2)",
                boxShadow: i === active ? "0 0 10px rgba(193,18,31,0.7)" : "none",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
