"use client";

import { AppProvider } from "@/lib/store";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Letterbox from "@/components/Letterbox";
import Grain from "@/components/Grain";
import Cursor from "@/components/ui/Cursor";
import TrailerModal from "@/components/TrailerModal";
import CartDrawer from "@/components/CartDrawer";
import Hero from "@/components/sections/Hero";
import TrailerScroll from "@/components/sections/TrailerScroll";
import Marquee from "@/components/sections/Marquee";
import Characters from "@/components/sections/Characters";
import CoverReveal from "@/components/sections/CoverReveal";
import Reasons from "@/components/sections/Reasons";
import Shop from "@/components/sections/Shop";
import FinalCta from "@/components/sections/FinalCta";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <AppProvider>
      <SmoothScroll />
      <Preloader />
      <Navbar />
      <Letterbox />
      <TrailerModal />
      <CartDrawer />
      <Grain />
      <Cursor />

      <main className="relative">
        <Hero />
        <TrailerScroll />
        <Marquee
          items={["Un mapa", "Un barco", "Un traidor", "Un tesoro"]}
          className="border-y border-oro/20 bg-oro py-5 font-display text-3xl font-black uppercase text-abismo md:text-5xl"
        />
        <Characters />
        <Marquee
          items={["¡Yo-ho-ho!", "Y una botella de ron", "Quince hombres", "Sobre el cofre del muerto"]}
          reverse
          className="py-8 font-serif text-5xl italic text-pergamino/25 md:text-7xl"
        />
        <CoverReveal />
        <Reasons />
        <Shop />
        <FinalCta />
        <Footer />
      </main>
    </AppProvider>
  );
}
