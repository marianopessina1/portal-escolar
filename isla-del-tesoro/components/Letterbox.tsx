"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Cinema bars: full 2.39:1 letterbox over the hero, retracting as the film "opens up" on scroll. */
export default function Letterbox() {
  const top = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to([top.current, bottom.current], {
      scaleY: 0,
      ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "+=600", scrub: true },
    });
  });

  const bar = "pointer-events-none fixed inset-x-0 z-[45] h-[11vh] bg-black";
  return (
    <>
      <div ref={top} aria-hidden className={`${bar} top-0 origin-top`} />
      <div ref={bottom} aria-hidden className={`${bar} bottom-0 origin-bottom`} />
    </>
  );
}
