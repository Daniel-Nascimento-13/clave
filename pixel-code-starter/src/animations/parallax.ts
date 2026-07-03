// ==========================================================
// PARALLAX.TS · ANIMAÇÃO
// O QUE FAZ: APLICA DESLOCAMENTO VERTICAL SUAVE NUM ELEMENTO CONFORME
//            O SCROLL, USANDO GSAP + SCROLLTRIGGER (EFEITO PARALLAX).
// QUANDO MEXER: TODA LP — PASSE UM "SPEED" MENOR PARA EFEITO MAIS SUTIL.
// ==========================================================
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const parallax = (target: Element, speed = 0.3) => {
  return gsap.to(target, {
    yPercent: -50 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: target,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
};
