import { Link } from "@tanstack/react-router";
import { ShoppingCart, Search, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { useShop } from "@/store/cart";
import { Button } from "@/components/ui/button";

export function Header() {
  const cart = useShop((s) => s.cart);
  const cartCount = cart.reduce((n, c) => n + c.qty, 0);
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/shop",    label: "Shop Tyres" },
    { to: "/shop",    label: "Collections" },
    { to: "/about",   label: "Tyre Guide" },
    { to: "/about",   label: "About Us" },
    { to: "/contact", label: "Contact" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 bg-black/35 backdrop-blur-xl border-b border-white/[0.05] shadow-[0_1px_30px_rgba(255,0,40,0.04)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-elegant group-hover:rotate-180 transition-transform duration-700">
            <div className="w-3 h-3 rounded-full bg-background" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-white text-glow">TyreLux</span>
        </Link>
 
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-muted-foreground hover:text-white transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:h-0.5 after:w-0 after:bg-[#FF3040] hover:after:w-full after:transition-all after:shadow-[0_0_8px_rgba(255,48,64,0.8)]"
              activeProps={{ className: "text-[#FF3040] text-glow" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-muted-foreground hover:text-white transition-colors" aria-label="Search">
            <Search className="w-5 h-5" />
          </button>
          <button className="text-muted-foreground hover:text-white transition-colors" aria-label="User Account">
            <User className="w-5 h-5" />
          </button>
          <Link to="/cart" className="relative text-muted-foreground hover:text-white transition-colors flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border bg-background animate-fade-in">
          <div className="px-4 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-sm font-medium py-2 text-muted-foreground hover:text-white"
                activeProps={{ className: "text-primary" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
