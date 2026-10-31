"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { characters } from "@/lib/data";

/** Horizontal, pinned "cast" reel — the trailer's billing block brought to life. */
export default function Characters() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card) => {
          gsap.fromTo(
            card.querySelector("[data-initial]"),
            { xPercent: 30 },
            {
              xPercent: -30,
              ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="personajes" ref={root} className="relative overflow-hidden bg-tinta md:h-[100svh]">
      <div ref={track} className="flex h-full flex-col gap-6 px-6 py-24 md:w-max md:flex-row md:items-center md:gap-8 md:px-16 md:py-0">
        <div className="flex shrink-0 flex-col justify-center md:w-[38vw]">
          <p className="font-display text-[11px] uppercase tracking-[0.55em] text-oro">Reparto</p>
          <h2 className="mt-4 font-display text-[clamp(3rem,6.2vw,6.5rem)] font-black uppercase leading-[0.9] text-gold">
            La
            <br />
            tripulación
          </h2>
          <p className="mt-6 max-w-md font-serif text-2xl italic text-pergamino/75">
            Piratas, caballeros, un grumete y un loro. Nadie es quien parece.
          </p>
        </div>

        {characters.map((c, i) => (
          <article
            key={c.name}
            data-card
            data-cursor="hover"
            className="group relative flex shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-oro/20 bg-gradient-to-b from-marea to-abismo p-8 transition-colors duration-700 hover:border-oro/60 md:h-[70vh] md:w-[min(28rem,32vw)]"
          >
            <span
              data-initial
              aria-hidden
              className="text-stroke-gold pointer-events-none absolute -right-6 top-6 font-display text-[16rem] font-black leading-none opacity-60 transition-opacity duration-700 group-hover:opacity-100"
            >
              {c.name[0]}
            </span>
            <div className="relative flex items-center justify-between font-display text-[10px] uppercase tracking-[0.4em] text-pergamino/50">
              <span>0{i + 1}</span>
              <span className="text-oro">{c.role}</span>
            </div>
            <div className="relative mt-24 md:mt-0">
              <h3 className="font-display text-4xl font-bold uppercase leading-none text-pergamino transition-colors duration-500 group-hover:text-dorado md:text-5xl">
                {c.name}
              </h3>
              <p className="mt-5 font-serif text-2xl italic leading-snug text-dorado/90">{c.quote}</p>
              <p className="mt-5 text-sm leading-relaxed text-pergamino/65">{c.text}</p>
            </div>
            <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-cobre via-dorado to-cobre transition-transform duration-700 ease-expo group-hover:scale-x-100" />
          </article>
        ))}
        <div className="hidden w-[8vw] shrink-0 md:block" />
      </div>
    </section>
  );
}
