"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { useApp } from "@/lib/store";
import GoldButton from "@/components/ui/GoldButton";

export default function FinalCta() {
  const { setTrailerOpen, lenis } = useApp();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-final-video]",
        { clipPath: "inset(18% 22% 18% 22% round 24px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "top top", scrub: true },
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-[100svh] min-h-[640px] overflow-hidden">
      <div data-final-video className="absolute inset-0">
        <video className="flicker h-full w-full object-cover" src="/media/delfines.mp4" poster="/media/delfines.jpg" autoPlay muted loop playsInline preload="metadata" />
        <div className="absolute inset-0 bg-gradient-to-t from-abismo via-abismo/50 to-abismo/30" />
      </div>
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.p
          className="font-display text-[11px] uppercase tracking-[0.6em] text-pergamino/70"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >
          Próximamente en tu mesa de luz
        </motion.p>
        <motion.h2
          className="glow-gold mt-6 font-display text-giant font-black uppercase text-gold"
          initial={{ opacity: 0, letterSpacing: "0.3em", filter: "blur(14px)" }}
          whileInView={{ opacity: 1, letterSpacing: "0em", filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        >
          El tesoro
          <br />
          te espera
        </motion.h2>
        <p className="mt-8 max-w-xl font-serif text-2xl italic text-pergamino/85">
          Léelo antes de que otro encuentre el mapa.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <GoldButton onClick={() => lenis?.scrollTo("#ediciones", { duration: 1.6 })}>Comprar el libro</GoldButton>
          <GoldButton variant="ghost" onClick={() => setTrailerOpen(true)}>
            Ver el tráiler otra vez
          </GoldButton>
        </div>
      </div>
    </section>
  );
}
