"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { flavors, products, type Product } from "@/lib/data";
import { formatPrice, useApp } from "@/lib/store";
import JarIllustration from "../ui/JarIllustration";

export default function Products() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const distance = () => Math.max(track.current!.scrollWidth - window.innerWidth, 0);
      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      // cards lean into the motion direction
      gsap.utils.toArray<HTMLElement>(".p-card").forEach((card) => {
        gsap.from(card, {
          rotate: 6,
          y: 80,
          ease: "none",
          scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "left 55%", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="products" ref={root} className="relative h-[100svh] overflow-hidden bg-fuego text-ink">
      <div aria-hidden className="absolute inset-0 opacity-25 [background-image:radial-gradient(#0a0806_1.2px,transparent_1.3px)] [background-size:10px_10px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />

      <div ref={track} className="relative z-10 flex h-full w-max items-center gap-6 pl-5 pr-[10vw] md:gap-10 md:pl-10">
        <div className="flex w-[85vw] shrink-0 flex-col justify-center md:w-[42vw]">
          <p className="mb-6 flex items-center gap-4 font-sans text-xs font-bold uppercase tracking-[0.35em]">
            <span className="h-px w-10 bg-ink" /> Capítulo 04 — Tienda
          </p>
          <h2 className="font-display text-giant uppercase">
            La
            <br />
            Despensa
          </h2>
          <p className="mt-6 max-w-sm font-serif text-2xl italic leading-snug">
            Lotes pequeños, numerados a mano. Cuando se acaban, se acaban.
          </p>
          <p className="mt-10 flex items-center gap-3 font-sans text-xs font-bold uppercase tracking-[0.3em]">
            Desliza
            <motion.span animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>
              →
            </motion.span>
          </p>
        </div>

        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addToCart } = useApp();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const f = flavors[product.flavorIndex];

  const add = () => {
    if (state !== "idle") return;
    setState("loading");
    setTimeout(() => {
      addToCart(product.id);
      setState("done");
      setTimeout(() => setState("idle"), 1600);
    }, 550);
  };

  return (
    <motion.article
      className="p-card group relative flex h-[72svh] max-h-[640px] w-[78vw] shrink-0 flex-col overflow-hidden rounded-[2rem] bg-ink p-6 text-crema sm:w-[360px]"
      whileHover="hover"
      initial="rest"
      animate="rest"
      data-cursor="Ver"
    >
      <motion.div
        aria-hidden
        className="absolute inset-0"
        variants={{ rest: { opacity: 0.35 }, hover: { opacity: 1 } }}
        style={{ background: `radial-gradient(70% 50% at 50% 38%, ${f.accent}66, transparent 70%)` }}
      />

      <div className="relative flex items-start justify-between">
        <span className="font-display text-2xl text-crema/30">0{index + 1}</span>
        {product.tag && (
          <span className="rounded-full px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-ink" style={{ background: f.accent }}>
            {product.tag}
          </span>
        )}
      </div>

      <motion.div
        className="relative flex flex-1 items-center justify-center"
        variants={{ rest: { y: 0, rotate: 0, scale: 1 }, hover: { y: -16, rotate: -5, scale: 1.06 } }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {product.id === "p-trilogia" ? (
          <div className="flex items-end -space-x-10">
            {[0, 2, 3].map((fi, k) => (
              <JarIllustration
                key={fi}
                sauce={flavors[fi].sauce}
                accent={flavors[fi].accent}
                name={flavors[fi].short}
                className={k === 1 ? "relative z-10 h-48" : "h-40"}
              />
            ))}
          </div>
        ) : (
          <JarIllustration sauce={f.sauce} accent={f.accent} name={product.name} className="h-56 drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]" />
        )}
      </motion.div>

      <div className="relative">
        <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-crema/50">
          {product.subtitle} · {product.size}
        </p>
        <h3 className="mt-2 font-display text-4xl uppercase leading-none">{product.name}</h3>
        <div className="mt-5 flex items-center justify-between">
          <span className="font-display text-3xl" style={{ color: f.accent }}>
            {formatPrice(product.price)}
          </span>
          <motion.button
            onClick={add}
            whileTap={{ scale: 0.9 }}
            layout
            className="relative flex h-12 items-center justify-center overflow-hidden rounded-full px-5 font-sans text-xs font-bold uppercase tracking-[0.18em] text-ink"
            style={{ background: state === "done" ? "#f5ebdc" : f.accent }}
            aria-label={`Añadir ${product.name} al carrito`}
            data-cursor="Añadir"
          >
            <AnimatePresence mode="wait" initial={false}>
              {state === "idle" && (
                <motion.span key="idle" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                  + Añadir
                </motion.span>
              )}
              {state === "loading" && (
                <motion.span
                  key="loading"
                  className="block h-4 w-4 rounded-full border-2 border-ink border-t-transparent"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 360 }}
                  exit={{ opacity: 0 }}
                  transition={{ rotate: { repeat: Infinity, duration: 0.6, ease: "linear" } }}
                />
              )}
              {state === "done" && (
                <motion.span key="done" className="flex items-center gap-2" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ opacity: 0 }}>
                  <motion.svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={3}>
                    <motion.path d="M4 12l5 5L20 6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
                  </motion.svg>
                  Añadido
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
