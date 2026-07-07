/* ============================================
   SEÇÃO 4 — DIFERENCIAIS — CARDS E GLOW
   ============================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DIFERENCIAIS } from "../constants/motion.js";
import { animateRouletteTitle } from "../lib/roulette-title.js";

gsap.registerPlugin(ScrollTrigger);

const sideX = (i) => (i % 2 === 0 ? DIFERENCIAIS.revealX : -DIFERENCIAIS.revealX);

export function initDiferenciais() {
  const section = document.querySelector("[data-diferenciais]");
  if (!section) return;

  const heading = section.querySelector(".clv-heading");
  const cards = gsap.utils.toArray(".clv-card-container", section);
  if (!cards.length) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    gsap.set(cards, { autoAlpha: 1, x: 0 });
    if (heading) gsap.set(heading, { opacity: 1 });
    return;
  }

  /* ---------- ROLETA DO TÍTULO ---------- */
  if (heading) {
    ScrollTrigger.create({
      trigger: heading,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.set(heading, { opacity: 1 });
        animateRouletteTitle(heading);
      },
    });
  }

  const triggers = cards.map((card, i) => {
    gsap.set(card, {
      autoAlpha: 0,
      x: sideX(i),
      willChange: "transform, opacity",
    });

    const tween = gsap.to(card, {
      autoAlpha: 1,
      x: 0,
      duration: DIFERENCIAIS.duration,
      ease: DIFERENCIAIS.ease,
      paused: true,
      onComplete: () => gsap.set(card, { willChange: "auto" }),
    });

    return ScrollTrigger.create({
      trigger: card,
      start: DIFERENCIAIS.start,
      once: true,
      invalidateOnRefresh: true,
      onEnter: () => tween.play(),
    });
  });

  requestAnimationFrame(() => ScrollTrigger.refresh());

  return () => triggers.forEach((t) => t.kill());
}