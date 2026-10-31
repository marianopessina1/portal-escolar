"use client";

import type { ReactNode } from "react";
import Magnetic from "./Magnetic";

type Props = { children: ReactNode; onClick?: () => void; href?: string; variant?: "solid" | "ghost"; className?: string };

/** Gold pill with a sweeping shine on hover. */
export default function GoldButton({ children, onClick, href, variant = "solid", className = "" }: Props) {
  const base =
    "group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-4 font-display text-xs font-bold uppercase tracking-[0.25em] transition-colors duration-500";
  const look =
    variant === "solid"
      ? "bg-gradient-to-b from-dorado via-oro to-cobre text-abismo shadow-[0_0_40px_-8px_rgba(217,176,100,0.7)]"
      : "border border-oro/50 text-dorado hover:border-dorado hover:bg-oro/10";
  const inner = (
    <>
      <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/50 opacity-0 blur-md transition-all duration-700 ease-expo group-hover:left-[120%] group-hover:opacity-100" />
      <span className="relative flex items-center gap-3">{children}</span>
    </>
  );
  return (
    <Magnetic className={`inline-block ${className}`}>
      {href ? (
        <a href={href} data-cursor="hover" className={`${base} ${look}`}>
          {inner}
        </a>
      ) : (
        <button type="button" onClick={onClick} data-cursor="hover" className={`${base} ${look}`}>
          {inner}
        </button>
      )}
    </Magnetic>
  );
}
