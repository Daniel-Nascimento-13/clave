// ============================================
// LENIS — FONTE ÚNICA DE SCROLL
// ============================================
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap.js";

let lenis = null;

// ============================================
// INIT — RESPEITA PREFERS-REDUCED-MOTION
// ============================================
export function initSmoothScroll() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return null;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  // SINCRONIZAÇÃO OBRIGATÓRIA: LENIS.RAF() <-> SCROLLTRIGGER.UPDATE()
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

// ============================================
// ACESSO À INSTÂNCIA — usado por outras animações (ex: scroll programático)
// ============================================
export function getLenis() {
  return lenis;
}

// ============================================
// CLEANUP — DESTRÓI LENIS E TODOS OS SCROLLTRIGGERS
// ============================================
export function destroySmoothScroll() {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
  ScrollTrigger.getAll().forEach((t) => t.kill());
}