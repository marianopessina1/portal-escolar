/** Movie-poster billing block. */
export default function Footer() {
  return (
    <footer className="relative border-t border-oro/15 bg-black px-6 pb-16 pt-24 text-center md:px-16">
      <p className="mx-auto max-w-5xl font-display text-[11px] uppercase leading-[2.2] tracking-[0.3em] text-pergamino/45 md:text-xs">
        Una novela de <span className="text-pergamino/80">Robert Louis Stevenson</span> · Publicada en <span className="text-pergamino/80">1883</span> ·
        Con <span className="text-pergamino/80">Jim Hawkins</span> · <span className="text-pergamino/80">Long John Silver</span> ·{" "}
        <span className="text-pergamino/80">Billy Bones</span> · <span className="text-pergamino/80">Ben Gunn</span> · El Doctor{" "}
        <span className="text-pergamino/80">Livesey</span> · El Capitán <span className="text-pergamino/80">Smollett</span> · El caballero{" "}
        <span className="text-pergamino/80">Trelawney</span> · y el loro <span className="text-pergamino/80">Capitán Flint</span> · Filmada en
        el mar · Música compuesta con código
      </p>
      <p className="mt-12 font-display text-4xl font-black uppercase text-gold md:text-6xl">La Isla del Tesoro</p>
      <p className="mt-10 text-xs text-pergamino/35">
        Proyecto escolar de Informática · Hecho con Next.js, Tailwind CSS, React Three Fiber, GSAP ScrollTrigger y Framer Motion.
        <br />
        La tienda es una simulación: no se realizan cobros.
      </p>
    </footer>
  );
}
