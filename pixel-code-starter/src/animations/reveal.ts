// ==========================================================
// REVEAL.TS · ANIMAÇÃO
// O QUE FAZ: ANIMA ELEMENTOS COM FADE + SLIDE DE BAIXO PARA CIMA QUANDO
//            ENTRAM NA VIEWPORT, USANDO GSAP + SCROLLTRIGGER.
// QUANDO MEXER: TODA LP — É A ANIMAÇÃO DE REVEAL PADRÃO DAS SECTIONS.
// ==========================================================
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type RevealTarget = string | Element | Element[];

export const reveal = (targets: RevealTarget, trigger?: Element | string) => {
  return gsap.from(targets, {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.1,
    scrollTrigger: {
      trigger: (trigger ?? (Array.isArray(targets) ? targets[0] : targets)) as Element | string,
      start: 'top 85%',
    },
  });
};
