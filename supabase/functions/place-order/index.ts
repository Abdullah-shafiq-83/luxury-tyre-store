// Trusted server-side order placement.
// Re-fetches product prices from the database so the client cannot tamper
// with `unit_price` or `total` via localStorage.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Item = { product_id: string; quantity: number };
type Body = {
  items: Item[];
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    address: string;
    city: string;
    postal_code: string;
  };
  payment_method?: string;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function bad(msg: string, status = 400) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return bad("Method not allowed", 405);

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid JSON");
  }

  const c = body?.customer;
  if (
    !c ||
    typeof c.first_name !== "string" || c.first_name.trim().length === 0 || c.first_name.length > 80 ||
    typeof c.last_name !== "string" || c.last_name.trim().length === 0 || c.last_name.length > 80 ||
    typeof c.email !== "string" || !EMAIL_RE.test(c.email) || c.email.length > 255 ||
    typeof c.address !== "string" || c.address.trim().length < 3 || c.address.length > 255 ||
    typeof c.city !== "string" || c.city.trim().length === 0 || c.city.length > 120 ||
    typeof c.postal_code !== "string" || c.postal_code.trim().length === 0 || c.postal_code.length > 20
  ) {
    return bad("Invalid customer details");
  }

  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 100) {
    return bad("Invalid items");
  }
  for (const it of body.items) {
    if (
      !it ||
      typeof it.product_id !== "string" || !UUID_RE.test(it.product_id) ||
      typeof it.quantity !== "number" || !Number.isInteger(it.quantity) ||
      it.quantity < 1 || it.quantity > 99
    ) {
      return bad("Invalid item");
    }
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Optional auth: if a bearer token is present, attribute the order.
  let userId: string | null = null;
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const { data } = await supabase.auth.getUser(token);
    userId = data.user?.id ?? null;
  }

  const ids = [...new Set(body.items.map((i) => i.product_id))];
  const { data: products, error: pErr } = await supabase
    .from("products")
    .select("id, title, price, discount_price, main_image_url, stock, is_visible")
    .in("id", ids);
  if (pErr) return bad("Failed to load products", 500);

  const byId = new Map((products ?? []).map((p: any) => [p.id, p]));
  let total = 0;
  const itemRows: any[] = [];
  for (const it of body.items) {
    const p: any = byId.get(it.product_id);
    if (!p || !p.is_visible) return bad(`Product unavailable: ${it.product_id}`);
    if ((p.stock ?? 0) < it.quantity) return bad(`Insufficient stock for ${p.title}`);
    const unit = Number(p.discount_price ?? p.price);
    if (!Number.isFinite(unit) || unit < 0) return bad(`Invalid price for ${p.title}`);
    total += unit * it.quantity;
    itemRows.push({
      product_id: p.id,
      product_title: p.title,
      product_image: p.main_image_url,
      quantity: it.quantity,
      unit_price: unit,
    });
  }

  const { data: order, error: oErr } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      customer_name: `${c.first_name} ${c.last_name}`.trim(),
      customer_email: c.email.trim(),
      first_name: c.first_name.trim(),
      last_name: c.last_name.trim(),
      city: c.city.trim(),
      postal_code: c.postal_code.trim(),
      shipping_address: c.address.trim(),
      payment_method: body.payment_method === "cod" ? "cod" : "card",
      total,
      status: "pending",
    })
    .select("id")
    .single();
  if (oErr || !order) {
    console.error("[place-order] insert order failed", oErr);
    return bad("Failed to create order", 500);
  }

  const { error: iErr } = await supabase
    .from("order_items")
    .insert(itemRows.map((r) => ({ ...r, order_id: order.id })));
  if (iErr) {
    console.error("[place-order] insert items failed", iErr);
    await supabase.from("orders").delete().eq("id", order.id);
    return bad("Failed to create order items", 500);
  }

  return new Response(JSON.stringify({ order_id: order.id, total }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
