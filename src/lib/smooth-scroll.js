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

  // iOS SAFARI — RE-SYNC DO PIN QUANDO A BARRA DE ENDEREÇO APARECE/SOME.
  // A barra do Safari é OVERLAY: sobrepõe o conteúdo sem redimensionar o layout
  // (svh não muda), criando dessincronia temporária entre visual viewport e
  // layout viewport bem no instante em que o pin da .produto deveria enquadrar
  // 100% ao voltar (Prédios -> Produto). ignoreMobileResize (em gsap.js) faz o
  // ScrollTrigger IGNORAR o resize da toolbar; aqui re-medimos de forma pontual
  // e debounced (só DEPOIS da toolbar assentar) para re-alinhar o pin sem o
  // "jump" de um refresh no meio do gesto. Só em touch — no-op no desktop.
  const vv = window.visualViewport;
  if (vv && window.matchMedia("(pointer: coarse)").matches) {
    let lastHeight = vv.height;
    let settleTimer = 0;
    vv.addEventListener("resize", () => {
      // Só reage a mudanças de altura reais (a toolbar), ignora ruído/largura.
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