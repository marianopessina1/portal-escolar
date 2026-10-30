import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";

const display = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Fuego Negro — Salsas de autor",
  description: "Salsas gourmet ahumadas sobre leña, fermentadas sin prisa y embotelladas a mano en pequeños lotes.",
};

export const viewport: Viewport = {
  themeColor: "#0a0806",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${serif.variable} ${sans.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
