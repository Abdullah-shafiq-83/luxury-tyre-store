import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useShop } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — TyreLux" }] }),
  component: Checkout,
});

const schema = z.object({
  fn: z.string().trim().min(1).max(80),
  ln: z.string().trim().min(1).max(80),
  em: z.string().trim().email().max(255),
  ad: z.string().trim().min(3).max(255),
  ct: z.string().trim().min(1).max(120),
  zp: z.string().trim().min(2).max(20),
});

function Checkout() {
  const { cart, clearCart } = useShop();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const subtotal = cart.reduce((s, c) => s + c.product.price * c.qty, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error("Your cart is empty");
    const form = new FormData(e.target as HTMLFormElement);
    const raw = Object.fromEntries(form.entries());
    const parsed = schema.safeParse(raw);
    if (!parsed.success) return toast.error(parsed.error.issues[0]?.message ?? "Invalid form");
    const v = parsed.data;

    setSubmitting(true);
    try {
      // Server-side order placement — prices and totals are recomputed from
      // the products table to prevent client-side tampering.
      const { data, error } = await supabase.functions.invoke("place-order", {
        body: {
          items: cart.map((c) => ({ product_id: c.product.id, quantity: c.qty })),
          customer: {
            first_name: v.fn,
            last_name: v.ln,
            email: v.em,
            address: v.ad,
            city: v.ct,
            postal_code: v.zp,
          },
          payment_method: "card",
        },
      });
      if (error) throw new Error(error.message ?? "Failed to place order");
      if (!data?.order_id) throw new Error((data as any)?.error ?? "Failed to place order");

      setOrderId(data.order_id);
      setDone(true);
      clearCart();
      toast.success("Order placed!");
    } catch (err: any) {
      toast.error(err?.message ?? "Could not place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 py-32 text-center">
          <CheckCircle2 className="w-16 h-16 mx-auto text-primary mb-4" />
          <h1 className="font-serif text-3xl font-bold mb-2">Order Confirmed</h1>
          <p className="text-muted-foreground mb-2">
            Thank you! A confirmation has been recorded for your order.
          </p>
          {orderId && <p className="text-xs text-muted-foreground mb-8">Order ID: {orderId.slice(0, 8)}</p>}
          <Button onClick={() => navigate({ to: "/" })} className="bg-gradient-primary text-primary-foreground">
            Back to home
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8">Checkout</h1>
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="glass-card rounded-xl p-6 space-y-5">
            <h3 className="font-serif font-bold text-lg text-glow">Shipping Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fn">First name</Label>
                <Input id="fn" name="fn" required maxLength={80} className="mt-1.5 glass focus-visible:shadow-[0_0_15px_rgba(255,0,40,0.5)] focus-visible:border-primary transition-all duration-300" />
              </div>
              <div>
                <Label htmlFor="ln">Last name</Label>
                <Input id="ln" name="ln" required maxLength={80} className="mt-1.5 glass focus-visible:shadow-[0_0_15px_rgba(255,0,40,0.5)] focus-visible:border-primary transition-all duration-300" />
              </div>
            </div>
            <div>
              <Label htmlFor="em">Email</Label>
              <Input id="em" name="em" type="email" required maxLength={255} className="mt-1.5 glass focus-visible:shadow-[0_0_15px_rgba(255,0,40,0.5)] focus-visible:border-primary transition-all duration-300" />
            </div>
            <div>
              <Label htmlFor="ad">Address</Label>
              <Input id="ad" name="ad" required maxLength={255} className="mt-1.5 glass focus-visible:shadow-[0_0_15px_rgba(255,0,40,0.5)] focus-visible:border-primary transition-all duration-300" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ct">City</Label>
                <Input id="ct" name="ct" required maxLength={120} className="mt-1.5 glass focus-visible:shadow-[0_0_15px_rgba(255,0,40,0.5)] focus-visible:border-primary transition-all duration-300" />
              </div>
              <div>
                <Label htmlFor="zp">Postal code</Label>
                <Input id="zp" name="zp" required maxLength={20} className="mt-1.5 glass focus-visible:shadow-[0_0_15px_rgba(255,0,40,0.5)] focus-visible:border-primary transition-all duration-300" />
              </div>
            </div>

            <h3 className="font-serif font-bold text-lg pt-4 text-glow">Payment</h3>
            <div>
              <Label htmlFor="cc">Card number</Label>
              <Input id="cc" placeholder="4242 4242 4242 4242" required className="mt-1.5 glass focus-visible:shadow-[0_0_15px_rgba(255,0,40,0.5)] focus-visible:border-primary transition-all duration-300" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ex">Expiry</Label>
                <Input id="ex" placeholder="MM/YY" required className="mt-1.5 glass focus-visible:shadow-[0_0_15px_rgba(255,0,40,0.5)] focus-visible:border-primary transition-all duration-300" />
              </div>
              <div>
                <Label htmlFor="cv">CVC</Label>
                <Input id="cv" placeholder="123" required className="mt-1.5 glass focus-visible:shadow-[0_0_15px_rgba(255,0,40,0.5)] focus-visible:border-primary transition-all duration-300" />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 h-fit sticky top-20">
            <h3 className="font-serif font-bold mb-4 text-glow">Summary</h3>
            <div className="space-y-2 text-sm mb-4 max-h-60 overflow-auto">
              {cart.map(({ product, qty }) => (
                <div key={product.id} className="flex justify-between">
                  <span className="text-muted-foreground truncate pr-2">{product.name} × {qty}</span>
                  <span>${(product.price * qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-border pt-4 mb-6">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <Button type="submit" size="lg" disabled={cart.length === 0 || submitting} className="w-full bg-gradient-primary text-primary-foreground shadow-elegant hover-lift">
              {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Placing…</> : "Place Order"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
