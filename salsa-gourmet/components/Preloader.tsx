"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "@/lib/store";

const EASE = [0.76, 0, 0.24, 1] as const;

export default function Preloader() {
  const { loaded, setLoaded } = useApp();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 2200;
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      // ease-out so it lingers near 100 like a real load
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(step);
      else setTimeout(() => setLoaded(true), 250);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [setLoaded]);

  return (
    <AnimatePresence>
      {!loaded && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[90] flex flex-col justify-between bg-ink p-6 text-crema md:p-10"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1.1, ease: EASE }}
          style={{ clipPath: "inset(0 0 0% 0)" }}
        >
          <div className="flex items-center justify-between font-sans text-xs uppercase tracking-[0.3em] text-crema/60">
            <span>Fuego Negro®</span>
            <span>Encendiendo las brasas</span>
          </div>

          <div className="relative overflow-hidden">
            <motion.div
              className="font-display text-giant uppercase leading-none"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <span className="text-stroke">Salsas</span>{" "}
              <span className="font-serif italic normal-case text-fuego">de autor</span>
            </motion.div>
          </div>

          <div className="flex items-end justify-between">
            <div className="h-[2px] w-1/2 overflow-hidden bg-crema/10">
              <div className="h-full bg-fuego transition-[width] duration-100" style={{ width: `${count}%` }} />
            </div>
            <span className="font-display text-7xl tabular-nums md:text-[10rem] leading-none text-fuego">
              {count.toString().padStart(3, "0")}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
