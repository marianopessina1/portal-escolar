"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "@/lib/store";

/** Full-screen cinema player for the rendered trailer (with sound). */
export default function TrailerModal() {
  const { trailerOpen, setTrailerOpen } = useApp();
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!trailerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setTrailerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [trailerOpen, setTrailerOpen]);

  return (
    <AnimatePresence>
      {trailerOpen && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 p-4 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => setTrailerOpen(false)}
          role="dialog"
          aria-modal
          aria-label="Tráiler de La Isla del Tesoro"
        >
          <motion.div
            className="relative w-full max-w-6xl"
            initial={{ scale: 0.92, clipPath: "inset(45% 0 45% 0)" }}
            animate={{ scale: 1, clipPath: "inset(0% 0 0% 0)" }}
            exit={{ scale: 0.95, clipPath: "inset(50% 0 50% 0)" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={video}
              src="/media/trailer.mp4"
              poster="/media/trailer-poster.jpg"
              className="aspect-video w-full bg-black shadow-[0_0_120px_-20px_rgba(217,176,100,0.45)]"
              autoPlay
              controls
              playsInline
            />
            <div className="mt-4 flex items-center justify-between font-display text-[10px] uppercase tracking-[0.35em] text-pergamino/50">
              <span>Tráiler oficial · 1:08</span>
              <a href="/media/trailer.mp4" download="la-isla-del-tesoro-trailer.mp4" className="text-dorado hover:underline">
                Descargar MP4
              </a>
            </div>
          </motion.div>
          <button
            type="button"
            onClick={() => setTrailerOpen(false)}
            className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-oro/40 text-dorado hover:bg-oro/10"
            aria-label="Cerrar tráiler"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
