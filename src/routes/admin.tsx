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

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/admin/login" });
    else if (!isAdmin) navigate({ to: "/" });
  }, [loading, user, isAdmin, navigate]);

  if (path === "/admin/login") return <Outlet />;

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="w-64 shrink-0 border-r border-border/60 bg-card/40 backdrop-blur-xl flex flex-col">
        <div className="p-6 border-b border-border/60">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/40 grid place-items-center shadow-lg shadow-primary/30 group-hover:scale-105 transition">
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-serif text-lg font-bold leading-tight">TyreLux</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Admin Console</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
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
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
