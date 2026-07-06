// ============================================
// DIFERENCIAIS — REVEAL POR CARD (GSAP + ScrollTrigger)
// ============================================
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DIFERENCIAIS } from "../constants/motion.js";

gsap.registerPlugin(ScrollTrigger);

// Ímpares (01, 03) → direita; pares (02, 04) → esquerda
const sideX = (i) => (i % 2 === 0 ? DIFERENCIAIS.revealX : -DIFERENCIAIS.revealX);

export function initDiferenciais() {
  const section = document.querySelector("[data-diferenciais]");
  if (!section) return;

  const cards = gsap.utils.toArray(".clv-card-container", section);
  if (!cards.length) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    gsap.set(cards, { autoAlpha: 1, x: 0 });
    return;
  }

  // Um trigger por card → cada um revela quando entra na viewport
  const triggers = cards.map((card, i) => {
    gsap.set(card, {
      autoAlpha: 0,
      x: sideX(i),
      willChange: "transform, opacity",
    });

    return ScrollTrigger.create({
      trigger: card,
      start: DIFERENCIAIS.start,       // "top 85%"
      once: true,
      invalidateOnRefresh: true,
      onEnter: () => {
        gsap.to(card, {
          autoAlpha: 1,
          x: 0,
          duration: DIFERENCIAIS.duration,
          ease: DIFERENCIAIS.ease,
          onComplete: () => gsap.set(card, { willChange: "auto" }),
        });
      },
    });
  });

  // Recalibra após layout final (Lenis + vídeos desalinham o start)
  requestAnimationFrame(() => ScrollTrigger.refresh());

  // Cleanup
  return () => triggers.forEach((t) => t.kill());
}