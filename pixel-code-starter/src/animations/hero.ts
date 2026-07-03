// ==========================================================
// HERO.TS · ANIMAÇÃO
// O QUE FAZ: TIMELINE DE ENTRADA DO HERO (FADE + SLIDE PARA CIMA)
//            SCOPED AO ELEMENTO RECEBIDO. WRAPPED EM GSAP.MATCHMEDIA()
//            PARA RESPEITAR PREFERS-REDUCED-MOTION.
// QUANDO MEXER: TODA LP — AJUSTE DURAÇÃO, EASE E DESLOCAMENTO AQUI.
// ==========================================================
import { gsap } from 'gsap';

export function heroReveal(scope: HTMLElement) {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap
      .timeline({ defaults: { ease: 'power3.out' } })
      .from(scope.querySelectorAll('[data-reveal]'), {
        opacity: 0,
        y: 50,
        duration: 0.9,
        stagger: 0.15,
      });
  });
}
