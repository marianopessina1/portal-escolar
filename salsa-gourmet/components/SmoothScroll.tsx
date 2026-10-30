"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { jarState } from "@/lib/jarState";
import { useApp } from "@/lib/store";

/** Lenis inertia scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export default function SmoothScroll() {
  const { setLenis, loaded } = useApp();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({ lerp: reduce ? 1 : 0.09, smoothWheel: !reduce, wheelMultiplier: 0.9 });
    lenis.on("scroll", (l: Lenis) => {
      jarState.velocity = l.velocity * 10;
      ScrollTrigger.update();
    });
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
    setLenis(lenis);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, [setLenis]);

  // keep the page locked while the preloader runs
  const { lenis } = useApp();
  useEffect(() => {
    if (!lenis) return;
    if (loaded) {
      lenis.start();
      ScrollTrigger.refresh();
    } else {
      lenis.stop();
      window.scrollTo(0, 0);
    }
  }, [lenis, loaded]);

  // pointer feeds the 3D scene (tilt, light, spice parallax)
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      jarState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      jarState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
