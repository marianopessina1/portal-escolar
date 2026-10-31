"use client";

import { motion } from "framer-motion";
import { reasons } from "@/lib/data";
import SplitReveal from "@/components/ui/SplitReveal";

export default function Reasons() {
  return (
    <section id="por-que" className="relative overflow-hidden px-6 py-32 md:px-16 md:py-48">
      <div className="pointer-events-none absolute -left-40 top-20 h-[40rem] w-[40rem] rounded-full bg-oro/10 blur-[140px]" />
      <div className="relative mx-auto max-w-7xl">
        <p className="font-display text-[11px] uppercase tracking-[0.55em] text-oro">El veredicto</p>
        <h2 className="mt-4 font-display text-giant font-black uppercase text-gold">
          <SplitReveal text="¿Por qué leerlo?" />
        </h2>
        <p className="mt-8 max-w-2xl font-serif text-2xl italic text-pergamino/75 md:text-3xl">
          Porque hay libros que se leen, y libros que se viven. Este es de los segundos.
        </p>

        <div className="mt-20 grid gap-px overflow-hidden rounded-3xl border border-oro/15 bg-oro/15 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <motion.article
              key={r.n}
              data-cursor="hover"
              className="group relative overflow-hidden bg-abismo p-10 md:p-12"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.12 }}
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "radial-gradient(420px circle at var(--mx) var(--my), rgba(217,176,100,0.16), transparent 60%)" }}
              />
              <span className="text-stroke-gold relative font-display text-7xl font-black transition-colors duration-500 group-hover:text-oro/30">{r.n}</span>
              <h3 className="relative mt-8 font-display text-2xl font-bold uppercase leading-tight text-pergamino transition-colors duration-500 group-hover:text-dorado">
                {r.title}
              </h3>
              <p className="relative mt-4 leading-relaxed text-pergamino/65">{r.text}</p>
            </motion.article>
          ))}
        </div>

        <motion.blockquote
          className="mx-auto mt-32 max-w-4xl text-center"
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-serif text-4xl italic leading-tight text-pergamino md:text-6xl">
            «Quince hombres sobre el cofre del muerto…
            <br />
            <span className="text-gold">¡yo-ho-ho, y una botella de ron!</span>»
          </p>
          <footer className="mt-8 font-display text-[11px] uppercase tracking-[0.5em] text-pergamino/50">— Canción de Billy Bones, capítulo I</footer>
        </motion.blockquote>
      </div>
    </section>
  );
}
