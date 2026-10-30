"use client";

import { motion } from "framer-motion";

const COLS = [
  { title: "Tienda", links: ["Salsas", "Packs", "Edición limitada", "Tarjeta regalo"] },
  { title: "Marca", links: ["Historia", "Productores", "Recetas", "Prensa"] },
  { title: "Ayuda", links: ["Envíos", "Devoluciones", "Mayoristas", "Contacto"] },
];

export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-crema/10 bg-ink px-5 pt-20 md:px-10">
      <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <p className="max-w-xs font-serif text-2xl italic text-crema/80">Salsas de autor hechas a fuego lento, en pequeños lotes.</p>
          <div className="mt-8 flex gap-3">
            {["IG", "TT", "YT"].map((s) => (
              <motion.a
                key={s}
                href="#"
                whileHover={{ y: -4, backgroundColor: "#ff5b14", color: "#0a0806" }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-crema/20 font-sans text-xs font-bold text-crema"
              >
                {s}
              </motion.a>
            ))}
          </div>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <p className="mb-5 font-sans text-xs font-bold uppercase tracking-[0.3em] text-fuego">{c.title}</p>
            <ul className="space-y-2">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="group relative inline-block font-sans text-sm text-crema/70 transition-colors hover:text-crema">
                    {l}
                    <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-fuego transition-transform duration-500 ease-expo group-hover:origin-left group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-20 flex flex-col justify-between gap-2 border-t border-crema/10 py-6 font-sans text-[11px] uppercase tracking-[0.2em] text-crema/40 md:flex-row">
        <span>© {new Date().getFullYear()} Fuego Negro — Marca ficticia de demostración</span>
        <span>Hecho con fuego, Three.js y paciencia</span>
      </div>

      <p aria-hidden className="pointer-events-none -mb-[3.5vw] select-none whitespace-nowrap text-center font-display text-[19.5vw] uppercase leading-[0.8] text-fuego">
        Fuego Negro
      </p>
    </footer>
  );
}
