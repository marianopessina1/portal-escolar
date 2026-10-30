"use client";

import { motion } from "framer-motion";

/** Splits text into characters that rise out of a mask. */
export default function RevealText({
  text,
  className = "",
  delay = 0,
  play = true,
  stagger = 0.035,
}: {
  text: string;
  className?: string;
  delay?: number;
  play?: boolean;
  stagger?: number;
}) {
  return (
    <span className={`inline-flex overflow-hidden pb-[0.06em] ${className}`} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block will-change-transform"
          initial={{ y: "110%", rotate: 8 }}
          animate={play ? { y: "0%", rotate: 0 } : { y: "110%", rotate: 8 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: delay + i * stagger }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}
