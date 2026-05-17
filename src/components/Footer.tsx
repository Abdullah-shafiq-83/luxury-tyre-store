import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40 mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-primary" />
            <span className="font-serif text-lg font-bold">TyreLux</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            Premium tyres and bespoke alloy rims for drivers who demand excellence.
          </p>
        </div>
        <div>
          <h4 className="font-sans font-semibold text-sm mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop" search={{ category: "tyres" }} className="hover:text-primary">Tyres</Link></li>
            <li><Link to="/shop" search={{ category: "rims" }} className="hover:text-primary">Rims</Link></li>
            <li><Link to="/wishlist" className="hover:text-primary">Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-sans font-semibold text-sm mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TyreLux. Drive with confidence.
      </div>
    </footer>
  );
}
