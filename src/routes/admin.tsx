import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth, signOut } from "@/hooks/use-auth";
import { LayoutDashboard, Package, Tags, ShoppingBag, Star, LogOut, Loader2, ShieldCheck, Store, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — TyreLux" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const nav: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
];

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/admin/login" });
    else if (!isAdmin) navigate({ to: "/" });
  }, [loading, user, isAdmin, navigate]);

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false); }, [path]);

  if (path === "/admin/login") return <Outlet />;

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const sidebar = (
    <>
      <div className="p-6 border-b border-border/60 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/40 grid place-items-center shadow-lg shadow-primary/30 group-hover:scale-105 transition">
            <ShieldCheck className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-serif text-lg font-bold leading-tight">TyreLux</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Admin Console</div>
          </div>
        </Link>
        <button
          className="lg:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map((n) => {
          const active = n.exact ? path === n.to : path.startsWith(n.to);
          const Icon = n.icon;
          return (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition relative overflow-hidden group",
                active
                  ? "bg-gradient-to-r from-primary/25 to-primary/5 text-foreground shadow-inner"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/60",
              )}
            >
              {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />}
              <Icon className="w-4 h-4" />
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border/60 space-y-1">
        <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-card/60 transition">
          <Store className="w-4 h-4" /> View store
        </Link>
        <button
          onClick={async () => { await signOut(); navigate({ to: "/admin/login" }); }}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
        <div className="px-3 pt-2 text-[10px] text-muted-foreground truncate">{user.email}</div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-border/60 bg-card/40 backdrop-blur-xl flex-col">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 max-w-[85vw] bg-card border-r border-border/60 flex flex-col animate-in slide-in-from-left">
            {sidebar}
          </aside>
        </div>
      )}

      <main className="flex-1 min-w-0 overflow-auto">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 border-b border-border/60 bg-background/80 backdrop-blur-xl">
          <button
            className="p-2 -ml-2 text-foreground"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="font-serif font-bold">Admin</div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
