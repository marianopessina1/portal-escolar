"use client";

import { motion } from "framer-motion";

/** Word-by-word masked rise, triggered when scrolled into view. */
export default function SplitReveal({ text, className = "", delay = 0, stagger = 0.06 }: { text: string; className?: string; delay?: number; stagger?: number }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden className="-mt-[0.2em] inline-block overflow-hidden pb-[0.12em] pt-[0.2em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", rotate: 4 }}
            whileInView={{ y: "0%", rotate: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: delay + i * stagger }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}
