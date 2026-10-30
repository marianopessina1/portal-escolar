"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** Blend-mode cursor that grows and shows a label over [data-cursor] targets. */
export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [label, setLabel] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = (e.target as HTMLElement)?.closest?.("[data-cursor], a, button, input") as HTMLElement | null;
      setHover(!!target);
      setLabel(target?.dataset.cursor || null);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  const size = label ? 96 : hover ? 56 : 14;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[80] flex items-center justify-center rounded-full border text-[11px] font-semibold uppercase tracking-[0.2em]"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: size,
        height: size,
        backgroundColor: label ? "#ff5b14" : hover ? "rgba(245,235,220,0)" : "#ff5b14",
        borderColor: hover && !label ? "#f5ebdc" : "rgba(245,235,220,0)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <motion.span
        className="text-ink"
        initial={false}
        animate={{ opacity: label ? 1 : 0, scale: label ? 1 : 0.4 }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}
