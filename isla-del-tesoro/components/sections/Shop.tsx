"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { products } from "@/lib/data";
import { formatPrice, useApp } from "@/lib/store";
import SplitReveal from "@/components/ui/SplitReveal";

function ProductCard({ p, i }: { p: (typeof products)[number]; i: number }) {
  const { addToCart } = useApp();
  const [added, setAdded] = useState(false);
  const featured = i === 0;

  return (
    <motion.article
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-oro/15 bg-tinta transition-colors duration-500 hover:border-oro/50 ${
        featured ? "md:col-span-3 md:flex-row" : ""
      }`}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
    >
      <div className={`relative overflow-hidden ${featured ? "md:w-[45%]" : "aspect-[4/3]"}`}>
        {featured ? (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_50%_40%,rgba(217,176,100,0.3),transparent_65%)] p-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.image}
              alt="Portada de La Isla del Tesoro, edición de colección"
              className="w-full max-w-xs rounded-sm shadow-[20px_30px_60px_rgba(0,0,0,0.7)] transition-transform duration-1000 ease-expo [transform:perspective(1200px)_rotateY(-14deg)] group-hover:[transform:perspective(1200px)_rotateY(0deg)_scale(1.04)]"
            />
          </div>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt="" className="h-full w-full object-cover transition-transform duration-1000 ease-expo group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-tinta to-transparent" />
          </>
        )}
        {p.badge && (
          <span className="absolute left-5 top-5 rounded-full bg-oro px-3 py-1 font-display text-[9px] font-bold uppercase tracking-[0.25em] text-abismo">
            {p.badge}
          </span>
        )}
      </div>
      <div className={`flex flex-1 flex-col p-7 ${featured ? "md:justify-center md:p-12" : ""}`}>
        <p className="font-display text-[10px] uppercase tracking-[0.35em] text-oro">{p.format}</p>
        <h3 className={`mt-3 font-display font-bold uppercase text-pergamino ${featured ? "text-4xl md:text-5xl" : "text-2xl"}`}>{p.name}</h3>
        <p className={`mt-3 text-pergamino/65 ${featured ? "font-serif text-xl italic" : "text-sm"}`}>{p.detail}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {p.specs.map((s) => (
            <li key={s} className="rounded-full border border-pergamino/15 px-3 py-1 text-[11px] text-pergamino/60">
              {s}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between pt-8">
          <span className={`font-display text-gold ${featured ? "text-4xl" : "text-2xl"}`}>{formatPrice(p.price)}</span>
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              addToCart(p.id);
              setAdded(true);
              setTimeout(() => setAdded(false), 1600);
            }}
            className={`rounded-full px-6 py-3 font-display text-[10px] font-bold uppercase tracking-[0.25em] transition-colors duration-300 ${
              added ? "bg-dorado text-abismo" : "border border-oro/50 text-dorado hover:bg-oro hover:text-abismo"
            }`}
          >
            {added ? "Añadido ✓" : "Añadir"}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

export default function Shop() {
  return (
    <section id="ediciones" className="relative px-6 py-32 md:px-16 md:py-44">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="font-display text-[11px] uppercase tracking-[0.55em] text-oro">Ediciones</p>
            <h2 className="mt-4 font-display text-giant font-black uppercase text-gold">
              <SplitReveal text="Elegí tu botín" />
            </h2>
          </div>
          <p className="max-w-sm font-serif text-xl italic text-pergamino/70">
            Envío gratis desde 20 €. Cada pedido incluye un mapa de la isla impreso en papel envejecido.
          </p>
        </div>
        <div className="mt-16 grid auto-rows-auto gap-6 md:grid-cols-3">
          {products.map((p, i) => (
            <ProductCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
