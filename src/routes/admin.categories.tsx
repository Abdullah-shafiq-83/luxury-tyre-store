import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useRealtimeTable } from "@/lib/realtime";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/categories")({ component: Cats });

function Cats() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState(""); const [slug, setSlug] = useState(""); const [img, setImg] = useState("");
  const [loading, setLoading] = useState(true);
  async function load() { setLoading(true); const { data } = await supabase.from("categories").select("*").order("sort_order"); setItems(data ?? []); setLoading(false); }
  useEffect(() => { load(); }, []);
  // Real-time: reflect any category additions or deletions immediately.
  useRealtimeTable("categories", load);
  async function add(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("categories").insert({ name, slug: slug || name.toLowerCase().replace(/\s+/g, "-"), image_url: img || null, sort_order: items.length });
    if (error) return toast.error(error.message);
    setName(""); setSlug(""); setImg(""); toast.success("Added"); load();
  }
  async function del(id: string) { if (!confirm("Delete?")) return; const { error } = await supabase.from("categories").delete().eq("id", id); if (error) return toast.error(error.message); load(); }
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-serif font-bold">Categories</h1>
      <Card className="p-5 bg-card/60 backdrop-blur-xl border-border/60">
        <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input placeholder="Slug (auto)" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <Input placeholder="Image URL (optional)" value={img} onChange={(e) => setImg(e.target.value)} />
          <Button type="submit" className="bg-gradient-to-r from-primary to-primary/80"><Plus className="w-4 h-4" /> Add</Button>
        </form>
      </Card>
      {loading ? <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /> : (
        <div className="grid gap-2">
          {items.map((c) => (
            <Card key={c.id} className="p-4 flex items-center justify-between bg-card/60 backdrop-blur-xl border-border/60">
              <div className="flex items-center gap-3">
                {c.image_url && <img src={c.image_url} className="w-10 h-10 rounded object-cover" alt="" />}
                <div><div className="font-semibold">{c.name}</div><div className="text-xs text-muted-foreground">{c.slug}</div></div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => del(c.id)} className="hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
