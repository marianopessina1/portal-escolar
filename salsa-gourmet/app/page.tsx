"use client";

import { AppProvider } from "@/lib/store";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import SceneLayer from "@/components/SceneLayer";
import JarChoreography from "@/components/JarChoreography";
import Grain from "@/components/Grain";
import Cursor from "@/components/ui/Cursor";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Manifesto from "@/components/sections/Manifesto";
import Flavors from "@/components/sections/Flavors";
import Ingredients from "@/components/sections/Ingredients";
import Products from "@/components/sections/Products";
import FinalCta from "@/components/sections/FinalCta";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <AppProvider>
      <SmoothScroll />
      <Preloader />
      <Navbar />
      <CartDrawer />
      <SceneLayer />
      <Grain />
      <Cursor />

      <main className="relative">
        <Hero />
        <Marquee
          items={["Salsas de autor", "Ahumadas en nogal", "Fermentadas sin prisa", "Lotes numerados"]}
          className="border-y border-ink bg-fuego py-4 font-display text-4xl uppercase text-ink md:text-6xl"
          rotate={-2}
        />
        <Manifesto />
        <Flavors />
        <Ingredients />
        <Marquee
          items={["Sin conservantes", "100% natural", "Hecho a mano", "Envío en 48h"]}
          baseVelocity={-2.5}
          className="py-6 font-display text-5xl uppercase text-stroke md:text-8xl"
        />
        <Products />
        <FinalCta />
        <Footer />
      </main>

      {/* choreography last: its ScrollTriggers must resolve after the section pins */}
      <JarChoreography />
    </AppProvider>
  );
}
