import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { DollarSign, Package, ShoppingBag, TrendingUp, Star, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const [stats, setStats] = useState<{ orders: number; revenue: number; products: number; reviews: number } | null>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [top, setTop] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [{ count: orders }, { data: revData }, { count: products }, { count: reviews }, { data: recentOrders }, { data: topProducts }] = await Promise.all([
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("total"),
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("reviews").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("id,customer_name,total,status,created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("products").select("id,title,price,is_best_seller,main_image_url").eq("is_best_seller", true).limit(5),
      ]);
      const revenue = (revData ?? []).reduce((s, r: any) => s + Number(r.total || 0), 0);
      setStats({ orders: orders ?? 0, revenue, products: products ?? 0, reviews: reviews ?? 0 });
      setRecent(recentOrders ?? []);
      setTop(topProducts ?? []);
    })();
  }, []);

  if (!stats) return <div className="grid place-items-center h-96"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  const cards = [
    { label: "Total Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign },
    { label: "Total Orders", value: stats.orders, icon: ShoppingBag },
    { label: "Products", value: stats.products, icon: Package },
    { label: "Reviews", value: stats.reviews, icon: Star },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of store performance.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-5 bg-card/60 backdrop-blur-xl border-border/60 hover:border-primary/50 transition group">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
                <div className="text-2xl font-bold mt-2">{c.value}</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 grid place-items-center text-primary group-hover:bg-primary/20 transition">
                <c.icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-6 bg-card/60 backdrop-blur-xl border-border/60">
          <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-4 h-4 text-primary" /><h2 className="font-semibold">Recent Orders</h2></div>
          {recent.length === 0 ? <p className="text-sm text-muted-foreground">No orders yet.</p> : (
            <div className="space-y-2">
              {recent.map((o) => (
                <div key={o.id} className="flex items-center justify-between text-sm py-2 border-b border-border/40 last:border-0">
                  <div><div className="font-medium">{o.customer_name}</div><div className="text-xs text-muted-foreground">{o.status}</div></div>
                  <div className="font-semibold">${Number(o.total).toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="p-6 bg-card/60 backdrop-blur-xl border-border/60">
          <div className="flex items-center gap-2 mb-4"><Star className="w-4 h-4 text-primary" /><h2 className="font-semibold">Best Sellers</h2></div>
          {top.length === 0 ? <p className="text-sm text-muted-foreground">No best sellers marked yet.</p> : (
            <div className="space-y-2">
              {top.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm py-2 border-b border-border/40 last:border-0">
                  <span className="font-medium">{p.title}</span>
                  <span className="font-semibold">${Number(p.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
