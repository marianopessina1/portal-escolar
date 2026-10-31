"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formatPrice, useApp } from "@/lib/store";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, cartTotal, cartCount, clearCart } = useApp();
  const [done, setDone] = useState(false);

  const close = () => {
    setCartOpen(false);
    setTimeout(() => setDone(false), 600);
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-[130] flex w-full max-w-md flex-col border-l border-oro/20 bg-tinta"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Carrito"
            data-lenis-prevent
          >
            <header className="flex items-center justify-between border-b border-oro/15 px-7 py-6">
              <div>
                <p className="font-display text-[10px] uppercase tracking-[0.35em] text-oro">Tu cofre</p>
                <h2 className="font-display text-2xl text-pergamino">{cartCount} {cartCount === 1 ? "ejemplar" : "ejemplares"}</h2>
              </div>
              <button type="button" onClick={close} className="h-10 w-10 rounded-full border border-oro/30 text-dorado hover:bg-oro/10" aria-label="Cerrar carrito">
                ✕
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-7 py-6">
              {done ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex h-full flex-col items-center justify-center text-center">
                  <span className="text-6xl">🏴‍☠️</span>
                  <h3 className="mt-6 font-display text-3xl text-gold">¡Rumbo a tu casa!</h3>
                  <p className="mt-3 font-serif text-xl italic text-pergamino/70">
                    Pedido simulado — esto es un proyecto escolar, no se cobró nada.
                  </p>
                </motion.div>
              ) : cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-serif text-2xl italic text-pergamino/60">Tu cofre está vacío.</p>
                  <p className="mt-2 text-sm text-pergamino/40">Ni un doblón a la vista.</p>
                </div>
              ) : (
                <ul className="space-y-5">
                  <AnimatePresence initial={false}>
                    {cart.map(({ product, qty }) => (
                      <motion.li
                        key={product.id}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40, height: 0 }}
                        className="flex gap-4 rounded-xl border border-oro/10 bg-marea/40 p-3"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={product.image} alt="" className="h-24 w-[4.4rem] rounded object-cover" />
                        <div className="flex flex-1 flex-col">
                          <p className="font-display text-sm text-pergamino">{product.name}</p>
                          <p className="text-xs text-pergamino/50">{product.format}</p>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-3 rounded-full border border-oro/25 px-2 py-1">
                              <button type="button" onClick={() => updateQty(product.id, -1)} className="h-6 w-6 text-dorado" aria-label="Quitar uno">−</button>
                              <span className="w-4 text-center text-sm tabular-nums">{qty}</span>
                              <button type="button" onClick={() => updateQty(product.id, 1)} className="h-6 w-6 text-dorado" aria-label="Agregar uno">+</button>
                            </div>
                            <span className="font-display text-sm text-dorado">{formatPrice(product.price * qty)}</span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {!done && cart.length > 0 && (
              <footer className="border-t border-oro/15 px-7 py-6">
                <div className="mb-1 flex justify-between text-sm text-pergamino/60">
                  <span>Envío</span>
                  <span>{cartTotal >= 20 ? "Gratis" : formatPrice(3.5)}</span>
                </div>
                <div className="mb-5 flex items-end justify-between">
                  <span className="font-display text-xs uppercase tracking-[0.3em] text-pergamino/60">Total</span>
                  <span className="font-display text-3xl text-gold">{formatPrice(cartTotal + (cartTotal >= 20 ? 0 : 3.5))}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    clearCart();
                    setDone(true);
                  }}
                  className="w-full rounded-full bg-gradient-to-b from-dorado via-oro to-cobre py-4 font-display text-xs font-bold uppercase tracking-[0.3em] text-abismo transition-transform hover:scale-[1.02]"
                >
                  Zarpar al pago
                </button>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
