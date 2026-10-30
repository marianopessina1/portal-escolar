"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { flavors } from "@/lib/data";
import { jarState } from "@/lib/jarState";
import { useApp } from "@/lib/store";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Flavors() {
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const { lenis } = useApp();

  useGSAP(
    () => {
      trigger.current = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: () => `+=${window.innerHeight * flavors.length * 0.9}`,
        pin: true,
        anticipatePin: 1,
        onToggle: (self) => setInView(self.isActive),
        onUpdate: (self) => {
          const i = Math.min(flavors.length - 1, Math.floor(self.progress * flavors.length));
          // progress bars are written directly to avoid re-rendering every scroll frame
          bars.current.forEach((bar, b) => {
            if (bar) bar.style.transform = `scaleX(${Math.min(Math.max(self.progress * flavors.length - b, 0), 1)})`;
          });
          jarState.flavor = i;
          setActive(i);
        },
        onLeaveBack: () => {
          jarState.flavor = 0;
          setActive(0);
        },
      });
    },
    { scope: root },
  );

  const jump = (i: number) => {
    const st = trigger.current;
    if (!st || !lenis) return;
    lenis.scrollTo(st.start + ((i + 0.5) / flavors.length) * (st.end - st.start), { duration: 1.4 });
  };

  const f = flavors[active];

  return (
    <>
      {/* Pinned elements become their own stacking context, so the decor that must sit
          BEHIND the jar lives in a fixed layer under the canvas instead of inside the section. */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1]"
        initial={false}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* colour wash behind the jar, shifts per flavour */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          animate={{ background: `radial-gradient(45% 60% at 25% 50%, ${f.accent}55, transparent 70%)` }}
          transition={{ duration: 1.2 }}
        />
        <div aria-hidden className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(rgba(245,235,220,1)_1px,transparent_1px)] [background-size:14px_14px]" />

        {/* giant outlined name, behind the jar */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[-2vw] z-0 grid overflow-hidden whitespace-nowrap">
          <AnimatePresence initial={false}>
            <motion.p
              key={f.id}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.8, ease: EASE }}
              className="font-display text-[22vw] uppercase leading-[0.8] text-stroke-soft [grid-area:1/1]"
            >
              {f.short}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>

      <section id="flavors" ref={root} className="relative z-10 h-[100svh] overflow-hidden">
        <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-10 md:ml-auto md:w-1/2 md:justify-center md:px-10 md:pb-0">
          <p className="mb-4 flex items-center gap-4 font-sans text-xs font-semibold uppercase tracking-[0.35em] text-fuego md:mb-6">
            <span className="h-px w-10 bg-fuego" /> Capítulo 02 — Sabores
          </p>

          {/* old and new flavour overlap in one grid cell so the swap is a crossfade, never a gap */}
          <div className="relative grid min-h-[19rem] md:min-h-[26rem]">
            <AnimatePresence initial={false}>
              <motion.div
                key={f.id}
                className="[grid-area:1/1]"
                initial="hidden"
                animate="show"
                exit="exit"
                variants={{ show: { transition: { staggerChildren: 0.07 } }, exit: { transition: { staggerChildren: 0.03 } } }}
              >
                <div className="overflow-hidden">
                  <motion.h2
                    variants={{ hidden: { y: "105%" }, show: { y: 0 }, exit: { y: "-105%" } }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="font-display text-[clamp(3rem,7vw,7.5rem)] uppercase leading-[0.9] text-crema"
                    style={{ textShadow: `0 0 60px ${f.accent}55` }}
                  >
                    {f.name}
                  </motion.h2>
                </div>

                <motion.div
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="mt-6 flex items-center gap-5"
                >
                  <div className="flex gap-1.5" aria-label={`Picor ${f.heat} de 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0, rotate: -40 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3 + i * 0.06, type: "spring", stiffness: 400, damping: 14 }}
                      >
                        <Chili lit={i < f.heat} color={f.accent} />
                      </motion.span>
                    ))}
                  </div>
                  <span className="font-sans text-xs uppercase tracking-[0.25em] text-crema/60">{f.scoville}</span>
                </motion.div>

                <motion.p
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 }, exit: { opacity: 0 } }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="mt-4 max-w-md font-serif text-lg italic leading-snug text-crema/85 md:mt-6 md:text-2xl"
                >
                  {f.description}
                </motion.p>

                <motion.ul
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } }, exit: { opacity: 0 } }}
                  className="mt-6 flex flex-wrap gap-2"
                >
                  {f.notes.map((n) => (
                    <motion.li
                      key={n}
                      variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } }}
                      whileHover={{ y: -3, backgroundColor: f.accent, color: "#0a0806" }}
                      className="rounded-full border border-crema/20 px-4 py-2 font-sans text-xs uppercase tracking-[0.15em] text-crema"
                    >
                      {n}
                    </motion.li>
                  ))}
                </motion.ul>

                <motion.p
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1 }, exit: { opacity: 0 } }}
                  className="mt-6 font-sans text-sm text-crema/55"
                >
                  <span className="font-semibold uppercase tracking-[0.2em] text-crema/80">Marida con · </span>
                  {f.pairing}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* stepper */}
          <div className="mt-6 flex items-center gap-3 md:mt-10">
            {flavors.map((fl, i) => (
              <button
                key={fl.id}
                onClick={() => jump(i)}
                className="group flex flex-col items-start gap-2"
                data-cursor="Probar"
                aria-label={fl.name}
              >
                <span className={`font-sans text-[10px] font-bold tracking-[0.2em] transition-colors ${i === active ? "text-crema" : "text-crema/35 group-hover:text-crema/70"}`}>
                  0{i + 1}
                </span>
                <span className="relative block h-[3px] w-14 overflow-hidden rounded-full bg-crema/15 md:w-20">
                  <span
                    ref={(el) => {
                      bars.current[i] = el;
                    }}
                    className="absolute inset-0 origin-left scale-x-0 rounded-full"
                    style={{ background: fl.accent }}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
      <div id="flavors-end" aria-hidden />
    </>
  );
}

function Chili({ lit, color }: { lit: boolean; color: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <path
        d="M14.5 3.5c.4-.9 1.4-1.4 2.3-1.1l-.5 1.5c1.6.6 2.6 2.2 2.4 4-.5 5.6-6.2 12.3-13.6 13.6-1.3.2-2.1-1.3-1.2-2.2C8 15.8 11.5 11.3 13.2 6.6c.3-1 .8-2 1.3-3.1z"
        fill={lit ? color : "rgba(245,235,220,0.14)"}
      />
      <path d="M16.3 2.9c.9-.8 2-1 2.9-.6" stroke={lit ? "#6b8e23" : "rgba(245,235,220,0.14)"} strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}
