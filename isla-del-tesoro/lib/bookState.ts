/** Mutable state shared between GSAP (DOM side) and the R3F book scene — no React re-renders. */
export const bookState = {
  /** 0 → 1 scroll progress through the cover reveal section */
  progress: 0,
  pointer: { x: 0, y: 0 },
};
