import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — TyreLux" },
      { name: "description", content: "TyreLux is a premium tyre and alloy rim retailer founded by drivers, for drivers." },
      { property: "og:title", content: "About TyreLux" },
      { property: "og:description", content: "Premium tyre and alloy rim retailer founded by drivers, for drivers." },
      { property: "og:image", content: heroBg },
    ],
  }),
  component: About,
});

function About() {
  return (
    <Layout>
      <section className="relative h-[50vh] min-h-[360px] overflow-hidden">
        <img src={heroBg} alt="Luxury car at sunset" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12 w-full">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-serif text-4xl md:text-6xl font-bold text-foreground"
            >
              Built for drivers<br />who demand more.
            </motion.h1>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 md:px-8 py-16 md:py-24 prose prose-lg">
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          TyreLux was founded in 2018 by a small team of motorsport engineers and design
          enthusiasts who believed that buying tyres and rims should feel as exciting as
          the drive itself.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Today, we partner directly with the world's most respected manufacturers —
          Michelin, Continental, BBS, OZ Racing, Enkei — to bring you a curated catalogue
          of authentic, performance-tested products. Every item ships with free fitting
          and an industry-leading 5-year warranty.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          From daily commuters to weekend track-day warriors, our promise is simple:
          premium quality, expert advice, and the confidence to drive harder.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-20 grid md:grid-cols-3 gap-6">
        {[
          { n: "10,000+", l: "Drivers served" },
          { n: "50+", l: "Premium brands" },
          { n: "99%", l: "5-star reviews" },
        ].map((s, i) => (
          <motion.div
            key={s.l}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-xl p-8 text-center shadow-soft"
          >
            <div className="font-serif text-4xl font-bold text-gradient mb-2">{s.n}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider">{s.l}</div>
          </motion.div>
        ))}
      </section>
    </Layout>
  );
}
