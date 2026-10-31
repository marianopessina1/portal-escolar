/** Animated film grain + vignette over the whole page. */
export default function Grain() {
  return (
    <>
      <div aria-hidden className="grain pointer-events-none fixed -inset-[50%] z-[70] opacity-[0.08] mix-blend-overlay" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[69]"
        style={{ background: "radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(0,0,0,0.6) 100%)" }}
      />
    </>
  );
}
