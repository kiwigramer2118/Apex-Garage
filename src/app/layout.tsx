import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-display",
  display: "swap",
});

const ui = Manrope({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ui",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Apex Garage",
  description: "Garage digital para la escena de track de SoCal — mapa de eventos en vivo, perfiles de vehículos y clasificados.",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${ui.variable}`}>
      <body>{children}</body>
    </html>
  );
}
