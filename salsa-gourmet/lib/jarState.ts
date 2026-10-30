/**
 * Mutable, render-free store shared between the GSAP scroll choreography
 * (DOM side) and the R3F scene (WebGL side). Written by ScrollTrigger,
 * read every frame inside useFrame — no React re-renders involved.
 */
export const jarState = {
  /** horizontal position, in half-viewport units (-1 = left edge, 1 = right edge) */
  x: 0,
  /** vertical position, in half-viewport units */
  y: 0,
  scale: 1,
  /** extra rotation driven by scroll (radians) */
  spin: 0,
  /** active flavour index */
  flavor: 0,
  /** smoothed scroll velocity, used for spin boost and particle turbulence */
  velocity: 0,
  /** pointer in normalised device coords */
  pointer: { x: 0, y: 0 },
};

export type JarKeyframe = { x: number; y: number; scale: number };
