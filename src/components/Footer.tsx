import { Link } from "@tanstack/react-router";
import { Phone, MessageCircle, Package, ShieldCheck, Share2, Camera, Play } from "lucide-react";

const shopLinks = [
  { label: "All Tyres",    to: "/shop" as const },
  { label: "By Vehicle",   to: "/shop" as const },
  { label: "By Size",      to: "/shop" as const },
  { label: "Tyre Guide",   to: "/about" as const },
  { label: "New Arrivals", to: "/shop" as const },
  { label: "Best Sellers", to: "/shop" as const },
];

const careLinks = [
  "Shipping & Delivery",
  "Returns & Refunds",
  "Track Order",
  "Warranty",
  "FAQs",
  "Contact Us",
];

const companyLinks = [
  { label: "About Us",      to: "/about" as const },
  { label: "Our Story",     to: "/about" as const },
  { label: "Careers",       to: "/about" as const },
  { label: "Blog",          to: "/about" as const },
  { label: "Privacy Policy",to: "/about" as const },
];

const socials = [
  { icon: Share2,  label: "Facebook" },
  { icon: Camera,  label: "Instagram" },
  { icon: Play,    label: "YouTube" },
];

function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-6">
      {children}
    </h4>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#030303] border-t border-white/[0.04] pt-20 pb-8 relative overflow-hidden">
      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-px bg-gradient-to-r from-transparent via-[#c1121f]/40 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-24 bg-[#c1121f]/10 blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* 5-column grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-16">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-5 group w-fit">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform duration-700"
                style={{ background: "linear-gradient(135deg,#7b1020,#c1121f)" }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#030303]" />
              </div>
              <span
                className="font-serif text-xl font-bold text-white tracking-tight"
                style={{ textShadow: "0 0 20px rgba(193,18,31,0.3)" }}
              >
                TyreLux
              </span>
            </Link>

            <p className="text-[0.8rem] text-gray-500 mb-7 leading-relaxed">
              Premium tyres for drivers who demand performance, safety and style.
            </p>

            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "rgba(193,18,31,0.2)";
                    el.style.borderColor = "rgba(193,18,31,0.4)";
                    el.style.boxShadow = "0 0 14px rgba(193,18,31,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "rgba(255,255,255,0.04)";
                    el.style.borderColor = "rgba(255,255,255,0.07)";
                    el.style.boxShadow = "none";
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <ColHeading>Shop</ColHeading>
            <ul className="space-y-3">
              {shopLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-[0.8rem] text-gray-500 hover:text-[#c1121f] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <ColHeading>Customer Care</ColHeading>
            <ul className="space-y-3">
              {careLinks.map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-[0.8rem] text-gray-500 hover:text-[#c1121f] transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <ColHeading>Company</ColHeading>
            <ul className="space-y-3">
              {companyLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-[0.8rem] text-gray-500 hover:text-[#c1121f] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <ColHeading>Support</ColHeading>
            <ul className="space-y-3">
              {[
                { icon: MessageCircle, label: "Live Chat" },
                { icon: Package,       label: "Track Order" },
                { icon: ShieldCheck,   label: "Warranty" },
              ].map(({ icon: Icon, label }) => (
                <li key={label}>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-[0.8rem] text-gray-500 hover:text-[#c1121f] transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#c1121f]" /> {label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="tel:+19989875543"
                  className="flex items-center gap-2 text-[0.8rem] text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#c1121f]" /> (+1) 998-987-5543
                </a>
                <p className="text-[0.72rem] text-gray-600 mt-1 ml-5">
                  Mon – Fri 8AM – 6PM (EST)
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-7 flex flex-col md:flex-row items-center justify-between gap-5 text-[0.78rem] text-gray-600">
          <p>© {new Date().getFullYear()} TyreLux. All rights reserved.</p>

          <div
            className="flex items-center gap-3 px-4 py-2 rounded-full"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {["VISA", "MC", "PayPal", "AMEX"].map((p) => (
              <span key={p} className="text-[0.68rem] font-bold text-gray-500 tracking-wider">
                {p}
              </span>
            ))}
          </div>

          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
