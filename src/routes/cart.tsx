import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, ShoppingBag } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useShop } from "@/store/cart";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — TyreLux" }] }),
  component: CartPage,
});

function CartPage() {
  const { cart, updateQty, removeFromCart } = useShop();
  const subtotal = cart.reduce((s, c) => s + c.product.price * c.qty, 0);
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-2xl">
            <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-6">Your cart is empty.</p>
            <Button asChild className="bg-gradient-primary text-primary-foreground hover-lift">
              <Link to="/shop">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-8">
            <div className="space-y-3">
              {cart.map(({ product, qty }) => (
                <div
                  key={product.id}
                  className="glass-card hover-lift rounded-xl p-3 sm:p-4 flex gap-3 sm:gap-4"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-black/40 flex items-center justify-center shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-primary tracking-widest uppercase">{product.brand}</div>
                    <Link
                      to="/product/$id"
                      params={{ id: product.id }}
                      className="font-serif font-bold text-lg hover:text-primary line-clamp-2 break-words text-glow"
                    >
                      {product.name}
                    </Link>
                    <div className="text-sm mt-1">${product.price}</div>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <div className="flex items-center border border-input rounded-md">
                        <button className="w-8 h-8 hover:bg-muted" onClick={() => updateQty(product.id, qty - 1)}>−</button>
                        <span className="w-8 text-center text-sm">{qty}</span>
                        <button className="w-8 h-8 hover:bg-muted" onClick={() => updateQty(product.id, qty + 1)}>+</button>
                      </div>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-muted-foreground hover:text-destructive p-2"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="font-bold shrink-0 text-sm sm:text-base">${(product.price * qty).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-xl p-6 h-fit sticky top-20">
              <h3 className="font-serif font-bold text-lg mb-4 text-glow">Order Summary</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-primary font-medium">Free</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-border pt-4 mb-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button asChild size="lg" className="w-full bg-gradient-primary text-primary-foreground shadow-elegant hover-lift">
                <Link to="/checkout">Checkout</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
