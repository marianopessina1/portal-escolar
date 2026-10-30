"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useApp } from "@/lib/store";

const Scene = dynamic(() => import("./scene/Scene"), { ssr: false });

/** Fixed full-viewport WebGL layer that sits between section backgrounds and content. */
export default function SceneLayer() {
  const { loaded } = useApp();
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5]"
      initial={{ opacity: 0, scale: 1.08 }}
      animate={loaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.08 }}
      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
    >
      <Scene />
    </motion.div>
  );
}
