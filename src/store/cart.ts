import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/products";

type CartItem = { product: Product; qty: number };

type Store = {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (p: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
};

export const useShop = create<Store>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      addToCart: (product, qty = 1) =>
        set((s) => {
          const existing = s.cart.find((c) => c.product.id === product.id);
          if (existing) {
            return {
              cart: s.cart.map((c) =>
                c.product.id === product.id ? { ...c, qty: c.qty + qty } : c
              ),
            };
          }
          return { cart: [...s.cart, { product, qty }] };
        }),
      removeFromCart: (id) =>
        set((s) => ({ cart: s.cart.filter((c) => c.product.id !== id) })),
      updateQty: (id, qty) =>
        set((s) => ({
          cart: s.cart.map((c) => (c.product.id === id ? { ...c, qty: Math.max(1, qty) } : c)),
        })),
      clearCart: () => set({ cart: [] }),
      toggleWishlist: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id)
            ? s.wishlist.filter((w) => w !== id)
            : [...s.wishlist, id],
        })),
    }),
    { name: "tyrelux-shop" }
  )
);
