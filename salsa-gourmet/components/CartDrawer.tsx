"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { flavors } from "@/lib/data";
import { formatPrice, useApp } from "@/lib/store";
import JarIllustration from "./ui/JarIllustration";

const FREE_SHIPPING = 45;

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, cartTotal, lenis } = useApp();
  const progress = Math.min(cartTotal / FREE_SHIPPING, 1);

  useEffect(() => {
    if (!lenis) return;
    if (cartOpen) lenis.stop();
    else lenis.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cartOpen, lenis, setCartOpen]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-ink/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-label="Carrito"
            className="fixed bottom-0 right-0 top-0 z-[71] flex w-full max-w-md flex-col bg-coal text-crema"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent
          >
            <div className="flex items-center justify-between border-b border-crema/10 p-6">
              <h2 className="font-display text-4xl uppercase">Tu carrito</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-crema/20 transition hover:rotate-90 hover:border-fuego hover:text-fuego"
                aria-label="Cerrar carrito"
              >
                ✕
              </button>
            </div>

            <div className="border-b border-crema/10 px-6 py-4">
              <p className="mb-2 font-sans text-xs uppercase tracking-[0.2em] text-crema/60">
                {progress >= 1
                  ? "¡Envío gratis desbloqueado! 🔥"
                  : `Te faltan ${formatPrice(FREE_SHIPPING - cartTotal)} para el envío gratis`}
              </p>
              <div className="h-1.5 overflow-hidden rounded-full bg-crema/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-brasa to-fuego"
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <span className="font-display text-6xl uppercase text-crema/10">Vacío</span>
                  <p className="font-serif text-xl italic text-crema/60">Tu despensa pide fuego.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence initial={false}>
                    {cart.map(({ product, qty }) => {
                      const f = flavors[product.flavorIndex];
                      return (
                        <motion.li
                          key={product.id}
                          layout
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -40, height: 0, marginTop: 0 }}
                          className="flex items-center gap-4 rounded-2xl bg-smoke/60 p-3"
                        >
                          <div className="flex h-20 w-16 items-center justify-center rounded-xl bg-ink">
                            <JarIllustration sauce={f.sauce} accent={f.accent} name={product.name} className="h-16" />
                          </div>
                          <div className="flex-1">
                            <p className="font-display text-xl uppercase leading-none">{product.name}</p>
                            <p className="mt-1 font-sans text-xs text-crema/50">{product.size}</p>
                            <p className="mt-2 font-sans text-sm font-bold text-fuego">{formatPrice(product.price * qty)}</p>
                          </div>
                          <div className="flex items-center gap-2 rounded-full border border-crema/15 px-2 py-1">
                            <QtyButton onClick={() => updateQty(product.id, -1)} label="Quitar uno">−</QtyButton>
                            <span className="w-5 text-center font-sans text-sm tabular-nums">{qty}</span>
                            <QtyButton onClick={() => updateQty(product.id, 1)} label="Añadir uno">+</QtyButton>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            <div className="border-t border-crema/10 p-6">
              <div className="mb-4 flex items-baseline justify-between">
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-crema/60">Total</span>
                <motion.span key={cartTotal} initial={{ scale: 1.2, color: "#ff5b14" }} animate={{ scale: 1, color: "#f5ebdc" }} className="font-display text-4xl">
                  {formatPrice(cartTotal)}
                </motion.span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                disabled={cart.length === 0}
                className="w-full rounded-full bg-fuego py-4 font-sans text-sm font-bold uppercase tracking-[0.2em] text-ink disabled:opacity-30"
              >
                Finalizar compra
              </motion.button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function QtyButton({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={onClick}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded-full text-lg transition hover:bg-fuego hover:text-ink"
    >
      {children}
    </motion.button>
  );
}
