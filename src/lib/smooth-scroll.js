/* ============================================
   LENIS — FONTE ÚNICA DE SCROLL
   ============================================ */
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
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  // SINCRONIZAÇÃO OBRIGATÓRIA: LENIS.RAF() <-> SCROLLTRIGGER.UPDATE()
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // iOS SAFARI — RE-SYNC DO PIN QUANDO A BARRA DE ENDEREÇO APARECE/SOME.
  // A BARRA DO SAFARI É OVERLAY: SOBREPÕE O CONTEÚDO SEM REDIMENSIONAR O LAYOUT
  // (svh NÃO MUDA), CRIANDO DESSINCRONIA TEMPORÁRIA ENTRE VISUAL VIEWPORT E
  // LAYOUT VIEWPORT BEM NO INSTANTE EM QUE O PIN DA .produto DEVERIA ENQUADRAR
  // 100% AO VOLTAR (PRÉDIOS -> PRODUTO). ignoreMobileResize (EM gsap.js) FAZ O
  // ScrollTrigger IGNORAR O resize DA TOOLBAR; AQUI RE-MEDIMOS DE FORMA PONTUAL
  // E DEBOUNCED (SÓ DEPOIS DA TOOLBAR ASSENTAR) PARA RE-ALINHAR O PIN SEM O
  // "JUMP" DE UM refresh NO MEIO DO GESTO. SÓ EM TOUCH — no-op NO DESKTOP.
  const vv = window.visualViewport;
  if (vv && window.matchMedia("(pointer: coarse)").matches) {
    let lastHeight = vv.height;
    let settleTimer = 0;
    vv.addEventListener("resize", () => {
      // SÓ REAGE A MUDANÇAS DE ALTURA REAIS (A TOOLBAR), IGNORA RUÍDO/LARGURA.
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
   ACESSO À INSTÂNCIA — USADO POR OUTRAS ANIMAÇÕES (EX.: SCROLL PROGRAMÁTICO)
   ============================================ */
export function getLenis() {
  return lenis;
}