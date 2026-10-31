"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { useApp } from "@/lib/store";
import GoldButton from "@/components/ui/GoldButton";

const ease = [0.16, 1, 0.3, 1] as const;

function Letters({ text, delay, className }: { text: string; delay: number; className?: string }) {
  const { loaded } = useApp();
  return (
    <span className={`-mt-[0.18em] block overflow-hidden pt-[0.18em] ${className ?? ""}`} aria-hidden>
      {text.split("").map((c, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: "105%", opacity: 0, filter: "blur(12px)" }}
          animate={loaded ? { y: "0%", opacity: 1, filter: "blur(0px)" } : undefined}
          transition={{ duration: 1.4, ease, delay: delay + i * 0.05 }}
        >
          {c === " " ? " " : c}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  const { loaded, setTrailerOpen, lenis } = useApp();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      tl.to("[data-hero-video]", { scale: 1.25, yPercent: 12, ease: "none" }, 0)
        .to("[data-hero-title]", { yPercent: -40, opacity: 0, letterSpacing: "0.12em", ease: "none" }, 0)
        .to("[data-hero-meta]", { opacity: 0, y: -40, ease: "none" }, 0);
    },
    { scope: root },
  );

  return (
    <section id="top" ref={root} className="relative h-[100svh] min-h-[640px] overflow-hidden">
      <div data-hero-video className="absolute inset-0 origin-top">
        <video
          className="flicker h-full w-full object-cover"
          src="/media/olas.mp4"
          poster="/media/olas.jpg"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-abismo/70 via-abismo/20 to-abismo" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,transparent,rgba(5,8,13,0.75))]" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
        <motion.p
          data-hero-meta
          className="mb-6 font-display text-[10px] uppercase tracking-[0.6em] text-pergamino/70 md:text-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1.2, ease, delay: 0.3 }}
        >
          Robert Louis Stevenson presenta
        </motion.p>

        <h1 data-hero-title className="glow-gold font-display font-black uppercase text-gold" aria-label="La Isla del Tesoro">
          <Letters text="La Isla" delay={0.45} className="text-giant" />
          <Letters text="del Tesoro" delay={0.75} className="text-giant" />
        </h1>

        <motion.p
          data-hero-meta
          className="mt-8 max-w-xl font-serif text-xl italic text-pergamino/85 md:text-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1.2, ease, delay: 1.5 }}
        >
          Un mapa. Un barco. Un traidor. Y un tesoro por el que todos matarían.
        </motion.p>

        <motion.div
          data-hero-meta
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1.2, ease, delay: 1.8 }}
        >
          <GoldButton onClick={() => setTrailerOpen(true)}>
            <span className="h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-current" />
            Ver el tráiler
          </GoldButton>
          <GoldButton variant="ghost" onClick={() => lenis?.scrollTo("#ediciones", { duration: 2.2 })}>
            Conseguir el libro
          </GoldButton>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-[13vh] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : undefined}
        transition={{ delay: 2.4, duration: 1 }}
      >
        <span className="font-display text-[9px] uppercase tracking-[0.5em] text-pergamino/50">Desliza · la función comienza</span>
        <span className="relative h-12 w-px overflow-hidden bg-pergamino/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-oro"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
