"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { ingredients, type Ingredient } from "@/lib/data";

export default function Ingredients() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".ing-reveal", {
        yPercent: 110,
        stagger: 0.08,
        duration: 1.3,
        ease: "expo.out",
        scrollTrigger: { trigger: ".ing-title", start: "top 85%" },
      });
      gsap.utils.toArray<HTMLElement>(".ing-card").forEach((card) => {
        const fromLeft = card.dataset.side === "left";
        gsap.from(card, {
          x: fromLeft ? -120 : 120,
          rotate: fromLeft ? -6 : 6,
          opacity: 0,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: card, start: "top 88%" },
        });
      });
    },
    { scope: root },
  );

  const left = ingredients.filter((_, i) => i % 2 === 0);
  const right = ingredients.filter((_, i) => i % 2 === 1);

  return (
    <section id="ingredients" ref={root} className="relative overflow-x-clip px-5 py-32 md:px-10 md:py-40">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(40%_40%_at_50%_55%,rgba(255,138,31,0.18),transparent_70%)]" />

      <div className="relative z-10 mb-20 text-center">
        <p className="mb-6 font-sans text-xs font-semibold uppercase tracking-[0.35em] text-fuego">Capítulo 03 — Origen</p>
        <h2 className="ing-title font-display text-giant uppercase text-crema">
          <span className="block overflow-hidden">
            <span className="ing-reveal inline-block">Ingredientes</span>
          </span>
          <span className="block overflow-hidden pb-[0.1em]">
            <span className="ing-reveal inline-block font-serif normal-case italic text-fuego">sin atajos</span>
          </span>
        </h2>
      </div>

      <div className="ing-grid relative z-10 grid gap-6 md:grid-cols-[1fr_minmax(0,30vw)_1fr] md:gap-8">
        <div className="space-y-6 md:space-y-10">
          {left.map((ing, i) => (
            <Card key={ing.name} ing={ing} index={i * 2} side="left" />
          ))}
        </div>
        <div className="hidden md:block" />
        <div className="space-y-6 md:mt-24 md:space-y-10">
          {right.map((ing, i) => (
            <Card key={ing.name} ing={ing} index={i * 2 + 1} side="right" />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ ing, index, side }: { ing: Ingredient; index: number; side: "left" | "right" }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-12, 12]), { stiffness: 200, damping: 20 });
  const glowX = useTransform(mx, (v) => `${v * 100}%`);
  const glowY = useTransform(my, (v) => `${v * 100}%`);
  const background = useMotionTemplate`radial-gradient(320px circle at ${glowX} ${glowY}, ${ing.color}40, transparent 60%)`;

  return (
    <div className="ing-card [perspective:1000px]" data-side={side}>
      <motion.article
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        whileHover="hover"
        initial="rest"
        className="group relative overflow-hidden rounded-3xl border border-crema/10 bg-coal/80 p-7 backdrop-blur-md"
        data-cursor="Origen"
      >
        <motion.div aria-hidden className="absolute inset-0" style={{ background }} />
        <div className="relative flex items-start justify-between" style={{ transform: "translateZ(40px)" }}>
          <span className="font-sans text-xs font-bold tracking-[0.2em] text-crema/40">0{index + 1}</span>
          <motion.span
            className="h-12 w-12 rounded-full"
            style={{ background: `radial-gradient(circle at 30% 30%, ${ing.color}, #000 120%)`, boxShadow: `0 0 40px ${ing.color}66` }}
            variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: 1.25, rotate: 90 } }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          />
        </div>
        <div className="relative mt-10" style={{ transform: "translateZ(30px)" }}>
          <p className="font-display text-6xl leading-none" style={{ color: ing.color === "#4a2a17" ? "#c9824a" : ing.color }}>
            {ing.metric}
          </p>
          <p className="mt-1 font-sans text-[11px] uppercase tracking-[0.25em] text-crema/50">{ing.metricLabel}</p>
          <h3 className="mt-6 font-display text-3xl uppercase text-crema">{ing.name}</h3>
          <p className="font-serif text-lg italic text-crema/60">{ing.origin}</p>
          <motion.p
            className="overflow-hidden font-sans text-sm leading-relaxed text-crema/70"
            variants={{ rest: { height: 0, opacity: 0, marginTop: 0 }, hover: { height: "auto", opacity: 1, marginTop: 12 } }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {ing.description}
          </motion.p>
        </div>
      </motion.article>
    </div>
  );
}
