import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Check, X, Star, Trash2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/reviews")({ component: Reviews });

function Reviews() {
  const [items, setItems] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  async function load() { setLoading(true); const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false }); setItems(data ?? []); setLoading(false); }
  useEffect(() => { load(); }, []);
  async function update(id: string, patch: any) { const { error } = await supabase.from("reviews").update(patch).eq("id", id); if (error) return toast.error(error.message); load(); }
  async function del(id: string) { if (!confirm("Delete review?")) return; const { error } = await supabase.from("reviews").delete().eq("id", id); if (error) return toast.error(error.message); load(); }
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-serif font-bold">Reviews</h1>
      {loading ? <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /> : items.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No reviews yet.</p>
      ) : (
        <div className="grid gap-3">
          {items.map((r) => (
            <Card key={r.id} className="p-4 bg-card/60 backdrop-blur-xl border-border/60">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2"><span className="font-semibold">{r.author_name}</span>
                    <span className="text-primary">{"★".repeat(r.rating)}<span className="text-muted-foreground">{"★".repeat(5 - r.rating)}</span></span>
                    {r.is_approved ? <Badge variant="secondary">Approved</Badge> : <Badge variant="outline">Pending</Badge>}
                    {r.is_featured && <Badge>Featured</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{r.comment}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => update(r.id, { is_approved: !r.is_approved })} title="Toggle approve">{r.is_approved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}</Button>
                  <Button size="icon" variant="ghost" onClick={() => update(r.id, { is_featured: !r.is_featured })} title="Toggle feature"><Star className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => del(r.id)} className="hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
