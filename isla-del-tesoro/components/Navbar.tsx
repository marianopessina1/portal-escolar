"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";

const links = [
  { href: "#historia", label: "Historia" },
  { href: "#personajes", label: "Personajes" },
  { href: "#portada", label: "Portada" },
  { href: "#por-que", label: "Por qué leerlo" },
  { href: "#ediciones", label: "Ediciones" },
];

export default function Navbar() {
  const { loaded, lenis, cartCount, bump, setCartOpen, setTrailerOpen } = useApp();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);

  // reveal the cart whenever something is added, even mid-scroll
  useEffect(() => {
    if (bump) setHidden(false);
  }, [bump]);

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > prev && v > 400);
    setSolid(v > 80);
  });

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    lenis?.scrollTo(href, { duration: 1.8 });
  };

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: loaded && !hidden ? 0 : -100 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: loaded && !solid ? 0.9 : 0 }}
    >
      <nav
        className={`mx-auto flex items-center justify-between gap-6 px-5 py-4 transition-all duration-500 md:px-10 ${
          solid ? "bg-abismo/70 backdrop-blur-xl" : ""
        }`}
      >
        <a href="#top" onClick={go("#top")} className="flex items-center gap-3" data-cursor="hover">
          <svg viewBox="0 0 40 40" className="h-8 w-8 text-oro" aria-hidden>
            <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M12 12 L28 28 M28 12 L12 28" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          <span className="font-display text-sm font-bold uppercase tracking-[0.3em] text-dorado">
            La Isla <span className="hidden sm:inline">del Tesoro</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={go(l.href)}
                className="group relative font-display text-[11px] uppercase tracking-[0.25em] text-pergamino/70 transition-colors hover:text-dorado"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-oro transition-transform duration-500 ease-expo group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setTrailerOpen(true)}
            className="hidden items-center gap-2 rounded-full border border-oro/40 px-4 py-2 font-display text-[10px] uppercase tracking-[0.25em] text-dorado transition-colors hover:bg-oro/10 sm:flex"
          >
            <span className="h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-current" />
            Tráiler
          </button>
          <motion.button
            key={bump}
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Abrir carrito (${cartCount})`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-oro text-abismo"
            animate={bump ? { scale: [1, 1.25, 1], rotate: [0, -12, 0] } : undefined}
            transition={{ duration: 0.5 }}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M4 9h16l-1.5 11h-13z" />
              <path d="M4 9V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
              <path d="M10 13h4" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-sangre px-1 text-[10px] font-bold text-pergamino">
                {cartCount}
              </span>
            )}
          </motion.button>
        </div>
      </nav>
    </motion.header>
  );
}
