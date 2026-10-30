"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const COPY =
  "No hacemos salsas. Domamos el fuego. Chiles madurados al sol, ahumados setenta y dos horas sobre leña de nogal y fermentados sin prisa hasta que el picante deja de ser dolor y se vuelve sabor.";
const HIGHLIGHT = new Set(["fuego.", "ahumados", "fermentados", "sabor."]);

const STATS = [
  { value: 72, suffix: "h", label: "de ahumado lento" },
  { value: 14, suffix: "", label: "variedades de chile" },
  { value: 0, suffix: "", label: "conservantes añadidos" },
  { value: 600, suffix: "", label: "frascos por lote" },
];

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // word-by-word ink-in, scrubbed to scroll
      gsap.fromTo(
        ".m-word",
        { opacity: 0.12, filter: "blur(4px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.08,
          ease: "none",
          scrollTrigger: { trigger: ".m-copy", start: "top 80%", end: "bottom 45%", scrub: 0.6 },
        },
      );

      gsap.utils.toArray<HTMLElement>(".m-stat-num").forEach((el) => {
        const target = Number(el.dataset.value);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
          onUpdate: () => (el.textContent = Math.round(obj.v).toString()),
        });
      });

      gsap.from(".m-stat", {
        y: 60,
        opacity: 0,
        stagger: 0.12,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".m-stats", start: "top 85%" },
      });

      gsap.from(".m-line", { scaleX: 0, transformOrigin: "left", duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".m-line", start: "top 90%" } });
    },
    { scope: root },
  );

  return (
    <section id="manifesto" ref={root} className="relative px-5 py-32 md:px-10 md:py-48">
      <div className="relative z-10 max-w-[60rem] md:pr-[26vw]">
        <p className="mb-10 flex items-center gap-4 font-sans text-xs font-semibold uppercase tracking-[0.35em] text-fuego">
          <span className="h-px w-10 bg-fuego" /> Capítulo 01 — Manifiesto
        </p>
        <p className="m-copy font-display text-[clamp(2.4rem,5.6vw,5.6rem)] uppercase leading-[0.95] text-crema">
          {COPY.split(" ").map((w, i) => (
            <span key={i} className={`m-word inline-block pr-[0.25em] ${HIGHLIGHT.has(w) ? "font-serif normal-case italic text-fuego" : ""}`}>
              {w}
            </span>
          ))}
        </p>
      </div>

      <div className="m-line relative z-10 mt-24 h-px w-full bg-crema/15" />

      <div className="m-stats relative z-10 mt-12 grid grid-cols-2 gap-y-12 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="m-stat group">
            <p className="font-display text-7xl leading-none text-crema transition-colors duration-500 group-hover:text-fuego md:text-8xl">
              <span className="m-stat-num" data-value={s.value}>0</span>
              <span className="text-fuego">{s.suffix}</span>
            </p>
            <p className="mt-3 font-sans text-xs uppercase tracking-[0.25em] text-crema/50">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
