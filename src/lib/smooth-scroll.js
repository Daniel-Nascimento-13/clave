/* ============================================
   LENIS — FONTE ÚNICA DE SCROLL
   ============================================ */

/* ---------- IMPORTS ---------- */

import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap.js";

let lenis = null;

/* ============================================
   INIT — RESPEITA prefers-reduced-motion
   ============================================ */

export function initSmoothScroll() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return null;

  lenis = new Lenis({
    duration:    1.2,
    easing:      (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  /* SINCRONIZAÇÃO OBRIGATÓRIA: lenis.raf() <-> ScrollTrigger.update() */
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  /* iOS SAFARI — RE-SYNC DEBOUNCED DO PIN QUANDO A TOOLBAR APARECE/SOME.
     ignoreMobileResize (EM gsap.js) IGNORA O resize; AQUI RE-MEDIMOS
     PONTUALMENTE APÓS A TOOLBAR ASSENTAR, SEM "JUMP" NO MEIO DO GESTO.
     SÓ EM TOUCH — NO-OP NO DESKTOP. */
  const vv = window.visualViewport;
  if (vv && window.matchMedia("(pointer: coarse)").matches) {
    let lastHeight  = vv.height;
    let settleTimer = 0;

    vv.addEventListener("resize", () => {
      if (Math.abs(vv.height - lastHeight) < 2) return;
      lastHeight = vv.height;
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        requestAnimationFrame(() => ScrollTrigger.refresh());
      }, 180);
    });
  }

  return lenis;
}

/* ============================================
   ACESSO À INSTÂNCIA
   ============================================ */

export function getLenis() {
  return lenis;
}