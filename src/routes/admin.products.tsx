import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useRealtimeTable } from "@/lib/realtime";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Copy, Upload, X, Loader2, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/admin/products")({ component: ProductsAdmin });

type Product = any;

function ProductsAdmin() {
  const [items, setItems] = useState<Product[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  async function load() {
    setLoading(true);
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("sort_order"),
    ]);
    setItems(p ?? []); setCats(c ?? []); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  // Real-time: any INSERT/UPDATE/DELETE on products or categories instantly
  // re-fetches the list so the admin always sees the current state.
  useRealtimeTable("products", load);
  useRealtimeTable("categories", load);

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  }

  async function duplicate(p: Product) {
    const { id, created_at, updated_at, ...rest } = p;
    const { error } = await supabase.from("products").insert({ ...rest, title: `${p.title} (copy)` });
    if (error) return toast.error(error.message);
    toast.success("Duplicated"); load();
  }

  async function toggleVisible(p: Product) {
    const { error } = await supabase.from("products").update({ is_visible: !p.is_visible }).eq("id", p.id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">{items.length} products</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)} className="bg-gradient-to-r from-primary to-primary/80">
              <Plus className="w-4 h-4" /> Add product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit product" : "New product"}</DialogTitle></DialogHeader>
            <ProductForm product={editing} categories={cats} onDone={() => { setOpen(false); load(); }} />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? <div className="grid place-items-center h-64"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> : (
        <div className="grid gap-3">
          {items.map((p) => (
            <Card key={p.id} className="p-4 flex items-center gap-4 bg-card/60 backdrop-blur-xl border-border/60 hover:border-primary/40 transition">
              <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden shrink-0">
                {p.main_image_url && <img src={p.main_image_url} className="w-full h-full object-cover" alt="" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold truncate">{p.title}</span>
                  {p.is_featured && <Badge variant="secondary">Featured</Badge>}
                  {p.is_best_seller && <Badge>Best</Badge>}
                  {p.is_new_arrival && <Badge variant="outline">New</Badge>}
                  {!p.is_visible && <Badge variant="destructive">Hidden</Badge>}
                  {p.stock === 0 && <Badge variant="destructive">Out of stock</Badge>}
                </div>
                <div className="text-xs text-muted-foreground mt-1">${Number(p.price).toFixed(2)} · stock {p.stock} · {p.sku || "—"}</div>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => toggleVisible(p)} title={p.is_visible ? "Hide" : "Show"}>
                  {p.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <Button size="icon" variant="ghost" onClick={() => duplicate(p)} title="Duplicate"><Copy className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => { setEditing(p); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => remove(p.id)} className="hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </Card>
          ))}
          {items.length === 0 && <p className="text-center text-muted-foreground py-12">No products yet. Add your first one.</p>}
        </div>
      )}
    </div>
  );
}

function ProductForm({ product, categories, onDone }: { product: any; categories: any[]; onDone: () => void }) {
  const [form, setForm] = useState<any>(product ?? {
    title: "", description: "", short_description: "", price: 0, discount_price: null,
    category_id: null, stock: 0, sku: "", brand: "", size: "", tags: [], variants: [],
    is_featured: false, is_best_seller: false, is_new_arrival: false, is_visible: true, main_image_url: "",
  });
  const [tagsStr, setTagsStr] = useState((product?.tags ?? []).join(", "));
  const [variantsStr, setVariantsStr] = useState(JSON.stringify(product?.variants ?? [], null, 2));
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [extraImages, setExtraImages] = useState<string[]>([]);

  // Load existing extra images from product_images table when editing
  useEffect(() => {
    if (!product?.id) return;
    supabase
      .from("product_images")
      .select("url, sort_order")
      .eq("product_id", product.id)
      .order("sort_order")
      .then(({ data }) => {
        if (data && data.length > 0) setExtraImages(data.map((r: any) => r.url as string));
      });
  }, [product?.id]);

  async function uploadFiles(files: FileList | null) {
    if (!files) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${crypto.randomUUID()}-${safe}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
      if (error) { toast.error(error.message); continue; }
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    if (urls.length) {
      setForm((f: any) => ({ ...f, main_image_url: f.main_image_url || urls[0] }));
      setExtraImages((prev) => [...prev, ...urls]);
      toast.success(`${urls.length} image${urls.length > 1 ? "s" : ""} uploaded`);
    }
    setUploading(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const tags = tagsStr.split(",").map((s: string) => s.trim()).filter(Boolean);
      let variants: any = [];
      try { variants = JSON.parse(variantsStr || "[]"); } catch { toast.error("Variants must be valid JSON"); setBusy(false); return; }
      const payload = { ...form, tags, variants, price: Number(form.price), discount_price: form.discount_price ? Number(form.discount_price) : null, stock: Number(form.stock || 0) };
      let id = product?.id;
      if (id) {
        const { error } = await supabase.from("products").update(payload).eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("products").insert(payload).select("id").single();
        if (error) throw error;
        id = data.id;
      }
      // Replace all extra images: delete existing rows then re-insert current set
      if (id) {
        await supabase.from("product_images").delete().eq("product_id", id);
        if (extraImages.length) {
          await supabase.from("product_images").insert(
            extraImages.map((url, i) => ({ product_id: id, url, sort_order: i }))
          );
        }
      }
      toast.success("Saved");
      onDone();
    } catch (err: any) { toast.error(err.message); } finally { setBusy(false); }
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2"><Label>Title</Label><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="sm:col-span-2"><Label>Short description</Label><Input value={form.short_description ?? ""} onChange={(e) => setForm({ ...form, short_description: e.target.value })} /></div>
        <div className="sm:col-span-2"><Label>Description</Label><Textarea rows={4} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div><Label>Price</Label><Input type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
        <div><Label>Discount price</Label><Input type="number" step="0.01" value={form.discount_price ?? ""} onChange={(e) => setForm({ ...form, discount_price: e.target.value || null })} /></div>
        <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
        <div><Label>SKU</Label><Input value={form.sku ?? ""} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></div>
        <div><Label>Brand</Label><Input value={form.brand ?? ""} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Michelin, BBS…" /></div>
        <div><Label>Size</Label><Input value={form.size ?? ""} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder='19", 245/40R19…' /></div>
        <div className="sm:col-span-2"><Label>Category</Label>
          <Select value={form.category_id ?? "none"} onValueChange={(v) => setForm({ ...form, category_id: v === "none" ? null : v })}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2"><Label>Tags (comma-separated)</Label><Input value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} /></div>
        <div className="sm:col-span-2"><Label>Variants (JSON array, e.g. [{`{"size":"19\""},{"color":"black"}`}])</Label><Textarea rows={3} value={variantsStr} onChange={(e) => setVariantsStr(e.target.value)} className="font-mono text-xs" /></div>
        <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            ["is_featured", "Featured"], ["is_best_seller", "Best seller"],
            ["is_new_arrival", "New arrival"], ["is_visible", "Visible"],
          ].map(([k, l]) => (
            <label key={k} className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-card/40">
              <span className="text-sm">{l}</span>
              <Switch checked={!!form[k as string]} onCheckedChange={(v) => setForm({ ...form, [k as string]: v })} />
            </label>
          ))}
        </div>
        <div className="sm:col-span-2 space-y-2">
          <Label>Images</Label>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-lg py-6 cursor-pointer hover:border-primary/60 hover:bg-card/40 transition">
            <Upload className="w-6 h-6 text-muted-foreground mb-2" />
            <span className="text-xs text-muted-foreground">{uploading ? "Uploading…" : "Drag & drop or click to upload"}</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => uploadFiles(e.target.files)} />
          </label>
          {form.main_image_url && (
            <div className="flex items-center gap-2">
              <img src={form.main_image_url} className="w-20 h-20 object-cover rounded-md border border-border" alt="main" />
              <Button type="button" variant="ghost" size="sm" onClick={() => setForm({ ...form, main_image_url: "" })}><X className="w-4 h-4" /></Button>
              <span className="text-xs text-muted-foreground">Main image</span>
            </div>
          )}
          {extraImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {extraImages.map((u, i) => (
                <div key={u} className="relative">
                  <img src={u} className="w-16 h-16 object-cover rounded-md border border-border" alt={`extra ${i + 1}`} />
                  <button type="button" onClick={() => setExtraImages((p) => p.filter((x) => x !== u))} className="absolute -top-1 -right-1 bg-background border border-border rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <Input placeholder="Or paste main image URL" value={form.main_image_url ?? ""} onChange={(e) => setForm({ ...form, main_image_url: e.target.value })} />
        </div>
      </div>
      <Button type="submit" disabled={busy} className="w-full bg-gradient-to-r from-primary to-primary/80">
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save product"}
      </Button>
    </form>
  );
}
