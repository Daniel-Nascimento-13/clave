'use client';
// ==========================================================
// SMOOTHSCROLL.TSX · PROVIDER
// O QUE FAZ: INICIALIZA O LENIS (SCROLL SUAVE), SINCRONIZA COM O
//            GSAP.TICKER E SCROLLTRIGGER, E EXPÕE A INSTÂNCIA VIA CONTEXT.
// QUANDO MEXER: QUASE NUNCA — SÓ PARA AJUSTAR PARÂMETROS DO LENIS.
// ==========================================================
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const LenisContext = createContext<Lenis | null>(null);
export const useLenisContext = () => useContext(LenisContext);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({ duration: 1.2, smoothWheel: true });
    setLenis(instance);

    const scrollHandler = () => ScrollTrigger.update();
    instance.on('scroll', scrollHandler);

    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      instance.off('scroll', scrollHandler);
      instance.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
