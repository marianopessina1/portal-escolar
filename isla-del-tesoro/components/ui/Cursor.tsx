"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** Compass-ring cursor that grows over interactive elements (pointer: fine only). */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40 });
  const sy = useSpring(y, { stiffness: 500, damping: 40 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      setHover(!!t?.closest("a, button, [data-cursor='hover']"));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;
  return (
    <>
      <motion.div className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-dorado" style={{ x, y }} />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2"
        style={{ x: sx, y: sy }}
      >
        <motion.svg
          viewBox="0 0 60 60"
          animate={{ width: hover ? 64 : 34, height: hover ? 64 : 34, rotate: hover ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="text-oro"
        >
          <circle cx="30" cy="30" r="27" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.8" />
          <path d="M30 4 L33 30 L30 56 L27 30 Z" fill="currentColor" opacity="0.35" />
          <path d="M4 30 L30 27 L56 30 L30 33 Z" fill="currentColor" opacity="0.2" />
        </motion.svg>
      </motion.div>
    </>
  );
}
