"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { chapters } from "@/lib/data";

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const f = Math.floor((s % 1) * 24);
  return `00:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
};

/** Pinned, scroll-scrubbed "trailer": five acts that wipe in like cinema cuts. */
export default function TrailerScroll() {
  const root = useRef<HTMLElement>(null);
  const time = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const layers = gsap.utils.toArray<HTMLElement>("[data-act]");
      const texts = gsap.utils.toArray<HTMLElement>("[data-act-text]");
      const dots = gsap.utils.toArray<HTMLElement>("[data-act-dot]");

      gsap.set(layers.slice(1), { clipPath: "inset(50% 0% 50% 0%)" });
      gsap.set(texts.slice(1), { autoAlpha: 0 });
      gsap.set(dots[0], { scaleX: 1 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${window.innerHeight * chapters.length * 1.1}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (time.current) time.current.textContent = fmt(self.progress * 128);
          },
        },
      });

      layers.forEach((layer, i) => {
        const vid = layer.querySelector("video");
        tl.fromTo(vid, { scale: 1.18 }, { scale: 1, duration: 1 }, i);
        tl.fromTo(texts[i].querySelector("[data-big]"), { letterSpacing: "0.3em" }, { letterSpacing: "0.04em", duration: 1 }, i);
        tl.to(dots[i], { scaleX: 1, duration: 0.25 }, i);
        if (i === 0) return;
        tl.to(layer, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.35, ease: "power3.inOut" }, i - 0.05);
        tl.to(texts[i - 1], { autoAlpha: 0, y: -60, filter: "blur(10px)", duration: 0.2 }, i - 0.15);
        tl.fromTo(texts[i], { autoAlpha: 0, y: 60, filter: "blur(10px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.3 }, i + 0.05);
      });
      tl.to({}, { duration: 0.3 });
    },
    { scope: root },
  );

  return (
    <section id="historia" ref={root} className="relative h-[100svh] overflow-hidden bg-black">
      {chapters.map((c, i) => (
        <div key={c.title} data-act className="absolute inset-0" style={{ zIndex: i }}>
          <video
            className="flicker h-full w-full object-cover"
            src={c.video}
            poster={c.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/50" />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end px-6 pb-[16vh] md:px-16">
        <div className="relative min-h-[45vh]">
          {chapters.map((c) => (
            <div key={c.title} data-act-text className="absolute inset-x-0 bottom-0">
              <p className="mb-4 font-display text-[11px] uppercase tracking-[0.55em] text-oro">{c.act}</p>
              <h2 data-big className="glow-gold font-display text-giant font-black uppercase text-gold">
                {c.title}
              </h2>
              <p className="mt-6 max-w-2xl font-serif text-2xl italic leading-snug text-pergamino/90 md:text-4xl">{c.line}</p>
            </div>
          ))}
        </div>
      </div>

      {/* film HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 pt-24 font-display text-[10px] uppercase tracking-[0.35em] text-pergamino/60 md:px-16">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-sangre" /> REC · Tráiler
        </span>
        <span ref={time} className="tabular-nums">00:00:00:00</span>
      </div>
      <div className="pointer-events-none absolute inset-x-6 bottom-[9vh] z-30 flex gap-2 md:inset-x-16">
        {chapters.map((c) => (
          <span key={c.title} className="relative h-px flex-1 bg-pergamino/20">
            <span data-act-dot className="absolute inset-0 origin-left scale-x-0 bg-oro" />
          </span>
        ))}
      </div>
    </section>
  );
}
