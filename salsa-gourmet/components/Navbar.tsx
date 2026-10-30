"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useApp } from "@/lib/store";

const LINKS = [
  { href: "#manifesto", label: "Historia" },
  { href: "#flavors", label: "Sabores" },
  { href: "#ingredients", label: "Origen" },
  { href: "#products", label: "Tienda" },
];

export default function Navbar() {
  const { loaded, lenis, cartCount, setCartOpen, bump } = useApp();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [wiggle, setWiggle] = useState(0);

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > prev && v > 300);
    setSolid(v > 60);
  });

  useEffect(() => {
    if (bump) setWiggle((w) => w + 1);
  }, [bump]);

  const go = (href: string) => lenis?.scrollTo(href, { duration: 1.6 });

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: loaded && !hidden ? 0 : -100 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={`mx-3 mt-3 flex items-center justify-between rounded-full px-5 py-3 transition-colors duration-500 md:mx-6 md:px-7 ${
          solid ? "bg-ink/70 backdrop-blur-xl ring-1 ring-crema/10" : "bg-transparent"
        }`}
      >
        <button onClick={() => go("#hero")} className="flex items-center gap-2" aria-label="Inicio">
          <Flame />
          <span className="font-display text-xl uppercase tracking-wide text-crema">Fuego Negro</span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="group relative overflow-hidden px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-crema/80"
            >
              <span className="block transition-transform duration-500 ease-expo group-hover:-translate-y-full">{l.label}</span>
              <span className="absolute inset-x-4 top-full block text-fuego transition-transform duration-500 ease-expo group-hover:-translate-y-full">
                {l.label}
              </span>
            </button>
          ))}
        </nav>

        <motion.button
          key={wiggle}
          onClick={() => setCartOpen(true)}
          animate={wiggle ? { rotate: [0, -12, 10, -6, 0], scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          className="relative flex items-center gap-2 rounded-full bg-fuego px-4 py-2 font-sans text-xs font-bold uppercase tracking-[0.18em] text-ink"
          data-cursor="Carrito"
        >
          Carrito
          <span className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-ink text-[11px] text-crema">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={cartCount}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {cartCount}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.button>
      </div>
    </motion.header>
  );
}

function Flame() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-fuego" fill="currentColor" aria-hidden>
      <path d="M12 2c.6 3.2-1.4 4.9-2.8 6.6C7.7 10.4 6.5 12 6.5 14.6 6.5 18.2 9 21 12 21s5.5-2.8 5.5-6.4c0-2.3-1-3.8-2-5 .1 1.6-.5 2.8-1.6 3.4.4-3.6-.6-7.6-1.9-11z" />
    </svg>
  );
}
