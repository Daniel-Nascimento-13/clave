import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

// Loaded once and applied as CSS variables on <html> in layout.tsx.
// The family names are referenced from globals.css @theme.
export const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
