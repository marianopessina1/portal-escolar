import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const display = Cinzel({ subsets: ["latin"], weight: ["500", "700", "900"], variable: "--font-display", display: "swap" });
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "La Isla del Tesoro — Robert Louis Stevenson",
  description:
    "El tráiler de la novela de aventuras más famosa de todos los tiempos. Un mapa, un barco, un traidor y un tesoro. Descubrí por qué leerla.",
  openGraph: { images: ["/media/cover-flat.jpg"] },
};

export const viewport: Viewport = {
  themeColor: "#05080d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${serif.variable} ${sans.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
