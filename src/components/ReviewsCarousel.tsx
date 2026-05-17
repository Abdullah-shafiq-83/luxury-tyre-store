import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "James Carter",
    role: "Porsche 911 Owner",
    avatar: "https://i.pravatar.cc/120?img=12",
    rating: 5,
    text: "The fitting service was flawless and the Pilot Sport 4S transformed my 911. Genuinely the best tyre shopping experience I've had.",
  },
  {
    name: "Sophia Lin",
    role: "BMW M4 Driver",
    avatar: "https://i.pravatar.cc/120?img=47",
    rating: 5,
    text: "Forged BBS rims arrived in 24 hours, perfectly packaged. The team understands cars — and they understand luxury.",
  },
  {
    name: "Marco Rossi",
    role: "Audi RS6 Owner",
    avatar: "https://i.pravatar.cc/120?img=33",
    rating: 5,
    text: "From browsing to delivery, every touchpoint feels premium. The maroon-on-black website made buying tyres feel like buying jewellery.",
  },
  {
    name: "Aisha Khan",
    role: "Mercedes AMG Driver",
    avatar: "https://i.pravatar.cc/120?img=49",
    rating: 5,
    text: "Worldwide shipping was seamless and customer support is on another level. I'll never shop tyres anywhere else.",
  },
];

export function ReviewsCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % reviews.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(165,29,45,0.18),transparent_60%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/15 blur-[140px] animate-pulse-glow" />

      <div className="relative max-w-4xl mx-auto px-4 md:px-8 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-primary-glow mb-3">Testimonials</div>
        <h2 className="font-serif text-3xl md:text-5xl font-bold mb-12">
          Loved by <span className="text-gradient">Drivers</span>
        </h2>

        <div className="relative h-[340px] md:h-[300px]">
          <AnimatePresence mode="wait">
            {reviews.map((r, i) =>
              i === active ? (
                <motion.div
                  key={r.name}
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-0 glass rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center"
                >
                  <Quote className="w-10 h-10 text-primary-glow mb-4 opacity-80" />
                  <p className="font-serif text-lg md:text-2xl leading-relaxed text-foreground mb-6 max-w-2xl">
                    "{r.text}"
                  </p>
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: r.rating }).map((_, k) => (
                      <Star key={k} className="w-4 h-4 fill-primary-glow text-primary-glow" />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <img src={r.avatar} alt={r.name} className="w-11 h-11 rounded-full border-2 border-primary-glow/40" />
                    <div className="text-left">
                      <div className="font-semibold text-foreground">{r.name}</div>
                      <div className="text-xs text-muted-foreground">{r.role}</div>
                    </div>
                  </div>
                </motion.div>
              ) : null,
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to review ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === active ? "w-8 bg-primary-glow" : "w-2 bg-foreground/20"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
