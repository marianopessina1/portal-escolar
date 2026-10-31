"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "@/lib/store";

/** Academy-leader countdown (3 · 2 · 1) before the "film" starts. */
export default function Preloader() {
  const { loaded, setLoaded } = useApp();
  const [count, setCount] = useState(3);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const step = reduce ? 250 : 850;
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          window.clearInterval(id);
          window.setTimeout(() => setLoaded(true), step * 0.6);
          return 0;
        }
        return c - 1;
      });
    }, step);
    return () => window.clearInterval(id);
  }, [setLoaded]);

  return (
    <AnimatePresence>
      {!loaded && (
        <motion.div
          key="leader"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-abismo"
          exit={{ clipPath: "inset(50% 0 50% 0)" }}
          initial={{ clipPath: "inset(0% 0 0% 0)" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="absolute inset-x-0 top-1/2 h-px bg-pergamino/10" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-pergamino/10" />
          <div className="relative flex h-[min(60vw,22rem)] w-[min(60vw,22rem)] items-center justify-center">
            <motion.div
              key={count}
              className="absolute inset-0 rounded-full"
              initial={{ background: "conic-gradient(from 0deg, rgba(217,176,100,0.32) 0deg, rgba(217,176,100,0) 0deg)" }}
              animate={{ background: "conic-gradient(from 0deg, rgba(217,176,100,0.32) 360deg, rgba(217,176,100,0) 360deg)" }}
              transition={{ duration: 0.85, ease: "linear" }}
            />
            <div className="absolute inset-0 rounded-full border border-oro/40" />
            <div className="absolute inset-[12%] rounded-full border border-oro/20" />
            <AnimatePresence mode="popLayout">
              <motion.span
                key={count}
                className="relative font-display text-[min(30vw,11rem)] font-bold leading-none text-gold"
                initial={{ opacity: 0, scale: 1.4, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.4 }}
              >
                {count > 0 ? count : "✕"}
              </motion.span>
            </AnimatePresence>
          </div>
          <p className="absolute bottom-[12vh] font-display text-[10px] uppercase tracking-[0.6em] text-pergamino/50">
            Una novela de Robert Louis Stevenson
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
