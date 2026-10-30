"use client";

import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { jarState, type JarKeyframe } from "@/lib/jarState";

type Stop = JarKeyframe & {
  /** CSS selector of the trigger element */
  trigger: string;
  /** ScrollTrigger start syntax, e.g. "top center" */
  start: string;
  /** overrides for phones, where the jar can't sit beside the copy */
  mobile?: Partial<JarKeyframe>;
};

/**
 * The jar travels across the page as one continuous move. Each stop is resolved
 * to a scroll position through ScrollTrigger (so pin spacing is accounted for),
 * and the jar state is interpolated between neighbouring stops with easing.
 */
const STOPS: Stop[] = [
  { trigger: "#hero", start: "top top", x: 0, y: -0.04, scale: 1 },
  { trigger: "#manifesto", start: "top 75%", x: 0.42, y: 0, scale: 0.78 },
  { trigger: "#manifesto", start: "bottom 70%", x: 0.42, y: 0, scale: 0.78 },
  { trigger: "#flavors", start: "top top", x: -0.45, y: -0.02, scale: 0.92, mobile: { y: 0.6, scale: 0.5 } },
  { trigger: "#flavors-end", start: "top bottom", x: -0.45, y: -0.02, scale: 0.92, mobile: { y: 0.6, scale: 0.5 } },
  { trigger: ".ing-grid", start: "top 45%", x: 0, y: 0, scale: 0.62 },
  { trigger: ".ing-grid", start: "bottom 85%", x: 0, y: 0, scale: 0.62 },
  { trigger: "#products", start: "top 40%", x: 0, y: -0.3, scale: 0 },
  { trigger: "#cta", start: "top 60%", x: 0, y: -0.3, scale: 0 },
  { trigger: "#cta", start: "top top", x: 0, y: 0.1, scale: 0.68 },
];

const smooth = (t: number) => t * t * (3 - 2 * t);

export default function JarChoreography() {
  useGSAP(() => {
    const anchors = STOPS.map((s) =>
      ScrollTrigger.create({ trigger: s.trigger, start: s.start, refreshPriority: -10 }),
    );

    const phone = window.matchMedia("(max-width: 767px)");
    const frame = (s: Stop): JarKeyframe => (phone.matches && s.mobile ? { ...s, ...s.mobile } : s);

    const apply = (scroll: number) => {
      const positions = anchors.map((a) => a.start);
      let i = 0;
      while (i < positions.length - 1 && scroll > positions[i + 1]) i++;
      const a = frame(STOPS[i]);
      const b = frame(STOPS[Math.min(i + 1, STOPS.length - 1)]);
      const span = positions[Math.min(i + 1, positions.length - 1)] - positions[i];
      const t = span > 0 ? smooth(Math.min(Math.max((scroll - positions[i]) / span, 0), 1)) : 1;
      jarState.x = a.x + (b.x - a.x) * t;
      jarState.y = a.y + (b.y - a.y) * t;
      jarState.scale = a.scale + (b.scale - a.scale) * t;
      jarState.spin = scroll * 0.0032;
    };

    const master = ScrollTrigger.create({
      start: 0,
      end: "max",
      refreshPriority: -20,
      onUpdate: (self) => apply(self.scroll()),
      onRefresh: (self) => apply(self.scroll()),
    });

    return () => {
      anchors.forEach((a) => a.kill());
      master.kill();
    };
  });

  return null;
}
