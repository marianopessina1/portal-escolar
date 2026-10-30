"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { useApp } from "@/lib/store";
import RevealText from "../ui/RevealText";
import FireButton from "../ui/FireButton";

export default function Hero() {
  const { loaded, lenis } = useApp();
  const root = useRef<HTMLElement>(null);

  // giant words drift apart as you leave the hero
  useGSAP(
    () => {
      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(".hero-back", { xPercent: -18, ease: "none", scrollTrigger: st });
      gsap.to(".hero-front", { xPercent: 14, ease: "none", scrollTrigger: st });
      gsap.to(".hero-meta", { y: -80, opacity: 0, ease: "none", scrollTrigger: { ...st, end: "40% top" } });
    },
    { scope: root },
  );

  return (
    <section id="hero" ref={root} className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-5 pb-8 pt-28 md:px-10">
      {/* textured backdrop */}
      <div aria-hidden className="absolute inset-0 -z-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,rgba(255,91,20,0.28),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(245,235,220,1)_1px,transparent_1px),linear-gradient(90deg,rgba(245,235,220,1)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(70%_60%_at_50%_50%,black,transparent)]" />
      </div>

      {/* BEHIND the jar */}
      <h1 className="hero-back pointer-events-none relative z-0 -ml-[2vw] select-none font-display text-[31vw] uppercase leading-[0.82] text-fuego md:text-mega">
        <RevealText text="Fuego" play={loaded} delay={0.35} stagger={0.06} />
      </h1>

      {/* IN FRONT of the jar */}
      <div className="hero-front pointer-events-none relative z-10 -mr-[2vw] select-none self-end text-right font-display text-[31vw] uppercase leading-[0.82] text-stroke md:text-mega">
        <RevealText text="Negro" play={loaded} delay={0.55} stagger={0.06} />
      </div>

      <div className="hero-meta relative z-10 mt-6 grid gap-6 md:grid-cols-3 md:items-end">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xs font-sans text-sm leading-relaxed text-crema/70"
        >
          Salsas de autor ahumadas sobre leña, fermentadas sin prisa y embotelladas a mano.
          <span className="mt-2 block font-serif text-lg italic text-crema">Pequeños lotes. Fuego enorme.</span>
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ delay: 1.4 }}
          onClick={() => lenis?.scrollTo("#manifesto", { duration: 1.8 })}
          className="mx-auto hidden flex-col items-center gap-3 font-sans text-[10px] uppercase tracking-[0.4em] text-crema/50 md:flex"
          data-cursor="Baja"
        >
          Desliza
          <span className="relative h-14 w-px overflow-hidden bg-crema/15">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-fuego"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            />
          </span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.25, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto flex flex-wrap items-center gap-3 md:justify-end"
        >
          <FireButton onClick={() => lenis?.scrollTo("#products", { duration: 2 })}>Comprar ahora</FireButton>
          <FireButton variant="ghost" onClick={() => lenis?.scrollTo("#flavors", { duration: 2 })}>
            Sabores
          </FireButton>
        </motion.div>
      </div>
    </section>
  );
}
