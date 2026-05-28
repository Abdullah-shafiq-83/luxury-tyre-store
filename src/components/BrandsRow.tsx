import { motion } from "framer-motion";

const brands = [
  { name: "Michelin",    display: "Michelin" },
  { name: "Continental", display: "Continental" },
  { name: "Bridgestone", display: "Bridgestone" },
  { name: "Pirelli",     display: "PIRELLI" },
  { name: "Goodyear",    display: "Goodyear" },
  { name: "Yokohama",    display: "Yokohama" },
];

export function BrandsRow() {
  return (
    <section className="py-16 bg-[#030303] border-y border-white/[0.04] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.35em] text-gray-500 mb-12">
          Trusted by Drivers.&nbsp;&nbsp;Partnered with the Best.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-6 w-full items-center"
        >
          {brands.map((b) => (
            <motion.div
              key={b.name}
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.25 }}
              className="cursor-pointer select-none flex justify-center"
              style={{ filter: "grayscale(1) brightness(0.45)", transition: "filter 0.3s ease" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.filter = "grayscale(0) brightness(1)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.filter = "grayscale(1) brightness(0.45)")}
            >
              <span className="font-serif text-base md:text-xl lg:text-2xl font-bold tracking-tight text-white whitespace-nowrap">
                {b.display}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
