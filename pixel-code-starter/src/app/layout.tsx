// ==========================================================
// LAYOUT.TSX · ESTRUTURA RAIZ (APP ROUTER DO NEXT.JS)
// O QUE FAZ: ENVOLVE TODAS AS PÁGINAS COM AS FONTES, O METADATA SEO
//            (TÍTULO, DESCRIÇÃO, OG) E O PROVIDER DE SCROLL SUAVE.
// QUANDO MEXER: TODA LP — ATUALIZE TÍTULO, DESCRIÇÃO E OG IMAGE.
// ==========================================================
import type { Metadata } from 'next';
import './globals.css';
import { fontDisplay, fontMono, fontSans } from '@/lib/fonts';
import SmoothScroll from '@/providers/SmoothScroll';
import { siteConfig } from '@/constants/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.name,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [{ url: siteConfig.ogImage }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fontDisplay.variable} ${fontMono.variable} ${fontSans.variable}`}>
      <body className="bg-bg text-fg antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
