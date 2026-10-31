"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { bookState } from "@/lib/bookState";
import { formatPrice, useApp } from "@/lib/store";
import { products } from "@/lib/data";
import GoldButton from "@/components/ui/GoldButton";

const BookScene = dynamic(() => import("@/components/scene/BookScene"), { ssr: false });
const edition = products[0];

/** The climax: the actual cover spins out of the dark in 3D, then the pitch appears beside it. */
export default function CoverReveal() {
  const root = useRef<HTMLElement>(null);
  const { addToCart } = useApp();
  const [added, setAdded] = useState(false);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            bookState.progress = self.progress;
          },
        },
      });
      tl.fromTo("[data-cover-bg]", { scale: 1.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3 }, 0)
        .to("[data-cover-bg]", { opacity: 0.12, duration: 0.25 }, 0.45)
        .fromTo("[data-cover-kicker]", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.15 }, 0.1)
        .to("[data-cover-kicker]", { autoAlpha: 0, y: -30, duration: 0.1 }, 0.5)
        .fromTo("[data-cover-copy] > *", { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.04 }, 0.68);
    },
    { scope: root },
  );

  return (
    <section id="portada" ref={root} className="relative h-[380vh] bg-abismo">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(45%_55%_at_50%_50%,rgba(217,176,100,0.22),transparent_70%)]" />
        <div data-cover-bg className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
          <span className="text-stroke-gold whitespace-nowrap font-display text-mega font-black uppercase">Portada</span>
        </div>

        <div className="absolute inset-0">
          <BookScene />
        </div>

        <p
          data-cover-kicker
          className="absolute inset-x-0 bottom-[14vh] text-center font-serif text-2xl italic text-pergamino/80 md:text-3xl"
        >
          Y al final del viaje… el tesoro tiene forma de libro.
        </p>

        <div
          data-cover-copy
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-abismo via-abismo/90 to-transparent px-6 pb-10 pt-24 md:inset-y-0 md:left-auto md:right-0 md:flex md:w-[46%] md:flex-col md:justify-center md:bg-none md:px-12 md:pb-0 md:pt-0"
        >
          <p className="font-display text-[11px] uppercase tracking-[0.55em] text-oro">La portada · {edition.name}</p>
          <h2 className="mt-4 font-display text-4xl font-black uppercase leading-[0.95] text-gold md:text-7xl">
            La Isla
            <br />
            del Tesoro
          </h2>
          <p className="mt-5 max-w-md font-serif text-xl italic text-pergamino/80 md:text-2xl">{edition.detail}</p>
          <ul className="mt-6 hidden flex-wrap gap-2 md:flex">
            {edition.specs.map((s) => (
              <li key={s} className="rounded-full border border-oro/30 px-4 py-1.5 font-display text-[10px] uppercase tracking-[0.25em] text-dorado">
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center gap-6">
            <span className="font-display text-3xl text-pergamino md:text-4xl">{formatPrice(edition.price)}</span>
            <GoldButton
              onClick={() => {
                addToCart(edition.id);
                setAdded(true);
                setTimeout(() => setAdded(false), 1800);
              }}
            >
              {added ? "¡Al cofre! ✓" : "Añadir al cofre"}
            </GoldButton>
          </div>
        </div>
      </div>
    </section>
  );
}
