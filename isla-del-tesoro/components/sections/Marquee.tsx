"use client";

import { motion } from "framer-motion";

export default function Marquee({ items, reverse = false, className = "" }: { items: string[]; reverse?: boolean; className?: string }) {
  const row = [...items, ...items];
  return (
    <div className={`relative overflow-hidden whitespace-nowrap ${className}`} aria-hidden>
      <motion.div
        className="inline-flex"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {row.map((t, i) => (
          <span key={i} className="flex items-center">
            <span className="px-8">{t}</span>
            <span className="text-oro">✕</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
