import type { Metadata } from "next";
import { fontDisplay, fontMono } from "@/lib/fonts";
import { SmoothScroll } from "@/providers/SmoothScroll";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  // Replace per project
  title: "Pixel Code",
  description: "Landing page de alta performance.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Pixel Code",
    description: "Landing page de alta performance.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={cn(fontDisplay.variable, fontMono.variable)}>
      <body className="bg-bg text-fg antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
