"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";

export default function FinalCta() {
  const root = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  useGSAP(
    () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", end: "top top", scrub: 1 } });
      tl.from(".cta-left", { xPercent: -60, opacity: 0 }, 0).from(".cta-right", { xPercent: 60, opacity: 0 }, 0);
    },
    { scope: root },
  );

  return (
    <section id="cta" ref={root} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-32 text-center md:px-10">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,91,20,0.35),transparent_70%)]" />

      <h2 className="pointer-events-none relative z-0 flex w-full justify-between font-display text-[clamp(4rem,16vw,18rem)] uppercase leading-[0.85]">
        <span className="cta-left text-crema">Prende</span>
        <span className="cta-right text-fuego">el</span>
      </h2>
      <p className="pointer-events-none relative z-10 -mt-[2vw] font-display text-[clamp(4rem,16vw,18rem)] uppercase leading-[0.85] text-stroke">
        fuego
      </p>

      <div className="relative z-10 mt-12 w-full max-w-lg">
        <p className="mb-6 font-serif text-xl italic text-crema/75">
          Únete al Club de la Brasa: lotes secretos, recetas y 10% en tu primer pedido.
        </p>
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="ok"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="rounded-full bg-crema px-6 py-5 font-sans text-sm font-bold uppercase tracking-[0.2em] text-ink"
            >
              🔥 Bienvenido al club — revisa tu correo
            </motion.div>
          ) : (
            <motion.form
              key="form"
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes("@")) setSent(true);
              }}
              className="group flex items-center gap-2 rounded-full border border-crema/20 bg-ink/60 p-2 backdrop-blur-md transition-colors focus-within:border-fuego"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="min-w-0 flex-1 bg-transparent px-5 font-sans text-sm text-crema placeholder:text-crema/35 focus:outline-none"
                aria-label="Correo electrónico"
              />
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                className="rounded-full bg-fuego px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.2em] text-ink"
              >
                Unirme
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
