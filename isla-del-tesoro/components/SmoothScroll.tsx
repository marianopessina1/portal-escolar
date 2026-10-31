"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { bookState } from "@/lib/bookState";
import { useApp } from "@/lib/store";

/** Lenis inertia scrolling driven by GSAP's ticker so ScrollTrigger stays in sync. */
export default function SmoothScroll() {
  const { setLenis, lenis, loaded, trailerOpen, cartOpen } = useApp();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const l = new Lenis({ lerp: reduce ? 1 : 0.085, smoothWheel: !reduce, wheelMultiplier: 0.9 });
    l.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    l.stop();
    setLenis(l);
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
      setLenis(null);
    };
  }, [setLenis]);

  // locked while the preloader runs or an overlay is open
  useEffect(() => {
    if (!lenis) return;
    if (!loaded) {
      lenis.stop();
      window.scrollTo(0, 0);
    } else if (trailerOpen || cartOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [lenis, loaded, trailerOpen, cartOpen]);

  useEffect(() => {
    if (loaded) ScrollTrigger.refresh();
  }, [loaded]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      bookState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      bookState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
