"use client";

import { useRef } from "react";
import {
  motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, wrap,
} from "framer-motion";

/** Infinite ribbon whose speed and direction react to scroll velocity. */
export default function Marquee({
  items,
  baseVelocity = 3,
  className = "",
  rotate = 0,
}: {
  items: string[];
  baseVelocity?: number;
  className?: string;
  rotate?: number;
}) {
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1000], [0, 5], { clamp: false });
  const direction = useRef(1);
  const xp = useTransform(x, (v) => `${wrap(-25, -50, v)}%`);

  useAnimationFrame((_, delta) => {
    let move = direction.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    move += direction.current * move * f;
    x.set(x.get() + move);
  });

  const row = (
    <>
      {items.map((t, i) => (
        <span key={i} className="flex items-center gap-8 pr-8">
          {t}
          <Star />
        </span>
      ))}
    </>
  );

  return (
    <div className={`relative z-10 overflow-hidden whitespace-nowrap ${className}`} style={{ rotate: `${rotate}deg` }}>
      <motion.div className="flex w-max" style={{ x: xp }}>
        {row}
        {row}
        {row}
        {row}
      </motion.div>
    </div>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="h-[0.6em] w-[0.6em] shrink-0" fill="currentColor" aria-hidden>
      <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
    </svg>
  );
}
