"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type Lenis from "lenis";
import { products, type Product } from "./data";

type CartLine = { product: Product; qty: number };

type AppState = {
  loaded: boolean;
  setLoaded: (v: boolean) => void;
  lenis: Lenis | null;
  setLenis: (l: Lenis | null) => void;
  trailerOpen: boolean;
  setTrailerOpen: (v: boolean) => void;
  cart: CartLine[];
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  addToCart: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  /** increments on every add — drives the cart "bump" microinteraction */
  bump: number;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [bump, setBump] = useState(0);

  const addToCart = useCallback((id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setCart((lines) => {
      const existing = lines.find((l) => l.product.id === id);
      if (existing) return lines.map((l) => (l.product.id === id ? { ...l, qty: l.qty + 1 } : l));
      return [...lines, { product, qty: 1 }];
    });
    setBump((b) => b + 1);
  }, []);

  const updateQty = useCallback((id: string, delta: number) => {
    setCart((lines) =>
      lines.map((l) => (l.product.id === id ? { ...l, qty: l.qty + delta } : l)).filter((l) => l.qty > 0),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const value = useMemo<AppState>(() => {
    const cartCount = cart.reduce((n, l) => n + l.qty, 0);
    const cartTotal = cart.reduce((n, l) => n + l.qty * l.product.price, 0);
    return {
      loaded, setLoaded, lenis, setLenis, trailerOpen, setTrailerOpen, cart, cartOpen, setCartOpen,
      addToCart, updateQty, clearCart, cartCount, cartTotal, bump,
    };
  }, [loaded, lenis, trailerOpen, cart, cartOpen, addToCart, updateQty, clearCart, bump]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);
