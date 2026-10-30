"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import Magnetic from "./Magnetic";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "ghost" | "dark";
  className?: string;
};

/** Pill button with a liquid fill that wipes up from the bottom on hover. */
export default function FireButton({ children, href, onClick, variant = "solid", className = "" }: Props) {
  const palette = {
    solid: "bg-fuego text-ink",
    ghost: "border border-crema/30 text-crema",
    dark: "bg-ink text-crema",
  }[variant];
  const fill = variant === "solid" ? "bg-crema" : variant === "dark" ? "bg-fuego" : "bg-fuego";
  const Tag = href ? motion.a : motion.button;

  return (
    <Magnetic>
      <Tag
        href={href}
        onClick={onClick}
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 0.95 }}
        animate="rest"
        className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-4 font-sans text-sm font-bold uppercase tracking-[0.18em] ${palette} ${className}`}
      >
        <motion.span
          aria-hidden
          className={`absolute inset-0 ${fill}`}
          variants={{ rest: { y: "101%", borderRadius: "50% 50% 0 0" }, hover: { y: "0%", borderRadius: "0% 0% 0 0" } }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
        <span className="relative z-10 transition-colors duration-300 group-hover:text-ink">{children}</span>
        <motion.span
          aria-hidden
          className="relative z-10 inline-block transition-colors duration-300 group-hover:text-ink"
          variants={{ rest: { x: 0, rotate: 0 }, hover: { x: 4, rotate: -45 } }}
        >
          →
        </motion.span>
      </Tag>
    </Magnetic>
  );
}
