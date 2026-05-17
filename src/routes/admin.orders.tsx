import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, ChevronDown, ChevronRight, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/orders")({ component: Orders });

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

function Orders() {
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<Record<string, any[] | "loading">>({});

  async function load() {
    setLoading(true);
    let qy = supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (filter !== "all") qy = qy.eq("status", filter as any);
    const { data } = await qy;
    setItems((data ?? []).filter((o: any) =>
      !q ||
      o.customer_name?.toLowerCase().includes(q.toLowerCase()) ||
      o.customer_email?.toLowerCase().includes(q.toLowerCase()) ||
      o.id.toLowerCase().includes(q.toLowerCase())
    ));
    setLoading(false);
  }

  useEffect(() => { load(); }, [filter, q]);

  // Realtime updates
  useEffect(() => {
    const ch = supabase
      .channel("orders-admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("orders").update({ status: status as any }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this order? This cannot be undone.")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Order deleted");
    load();
  }

  async function toggle(id: string) {
    if (open[id]) {
      const { [id]: _, ...rest } = open;
      setOpen(rest);
      return;
    }
    setOpen((s) => ({ ...s, [id]: "loading" }));
    const { data } = await supabase.from("order_items").select("*").eq("order_id", id);
    setOpen((s) => ({ ...s, [id]: data ?? [] }));
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-serif font-bold">Orders</h1>
      <div className="flex gap-3 flex-wrap">
        <Input placeholder="Search by name, email, or order id…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
      ) : items.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No orders yet.</p>
      ) : (
        <div className="grid gap-3">
          {items.map((o) => {
            const expanded = open[o.id];
            return (
              <Card key={o.id} className="bg-card/60 backdrop-blur-xl border-border/60 overflow-hidden">
                <div className="p-4 flex flex-wrap items-center gap-4">
                  <Button size="icon" variant="ghost" onClick={() => toggle(o.id)} className="shrink-0">
                    {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </Button>
                  <div className="flex-1 min-w-[200px]">
                    <div className="font-semibold">{o.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{o.customer_email}</div>
                    <div className="text-xs text-muted-foreground/70">#{o.id.slice(0, 8)}</div>
                  </div>
                  <Badge variant="outline">${Number(o.total).toFixed(2)}</Badge>
                  <Select value={o.status} onValueChange={(v) => setStatus(o.id, v)}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <span className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</span>
                  <Button size="icon" variant="ghost" onClick={() => remove(o.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {expanded && (
                  <div className="border-t border-border/60 px-4 py-4 bg-background/40 space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div><span className="text-muted-foreground">Address: </span>{o.shipping_address ?? "—"}</div>
                      <div><span className="text-muted-foreground">City: </span>{o.city ?? "—"}</div>
                      <div><span className="text-muted-foreground">Postal: </span>{o.postal_code ?? "—"}</div>
                      <div><span className="text-muted-foreground">Payment: </span>{o.payment_method ?? "—"}</div>
                    </div>
                    {expanded === "loading" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    ) : (
                      <div className="grid gap-2">
                        {(expanded as any[]).map((it) => (
                          <div key={it.id} className="flex items-center gap-3 p-2 rounded-md bg-card/50">
                            {it.product_image && (
                              <img src={it.product_image} alt={it.product_title} className="w-12 h-12 object-cover rounded" />
                            )}
                            <div className="flex-1">
                              <div className="font-medium text-sm">{it.product_title}</div>
                              <div className="text-xs text-muted-foreground">Qty {it.quantity} · ${Number(it.unit_price).toFixed(2)}</div>
                            </div>
                            <div className="text-sm font-semibold">${(it.quantity * Number(it.unit_price)).toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
