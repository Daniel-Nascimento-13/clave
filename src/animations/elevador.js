// ============================================
// SEÇÃO 2 — ELEVADOR: PIN + SCRUB + REVEAL
// ============================================
import { gsap, ScrollTrigger } from "../lib/gsap.js";
import { DURATIONS, EASE } from "../constants/motion.js";

// TRILHO DE SCROLL — QUANTO MAIOR, MAIS LENTO/CONTROLADO O SCRUB
const SCRUB_DISTANCE = "+=250%";

export function initElevador() {
  const section = document.querySelector("[data-elevador]");
  const video = document.querySelector(".elevador__video");
  if (!section || !video) return;

  const label = document.querySelector(".elevador__label");
  const title = document.querySelector(".elevador__title");
  const text = document.querySelector(".elevador__text");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // GUARD — REDUCED MOTION: SEM PIN, SEM SCRUB, TUDO ESTÁTICO E VISÍVEL
  if (reduce) {
    gsap.set([label, title, text], { clipPath: "inset(0 0 0% 0)", y: 0, opacity: 1 });
    video.pause();
    return;
  }

  video.pause(); // CONTROLADO MANUALMENTE VIA CURRENTTIME

  function setup() {
    let hasRevealed = false;

    // TIMELINE ÚNICA DE REVEAL — DISPARA UMA VEZ, NÃO É SCRUBADA
    function revealContent() {
      if (hasRevealed) return;
      hasRevealed = true;

      gsap
        .timeline({ defaults: { ease: EASE.primary } })
        .to(label, { clipPath: "inset(0 0 0% 0)", y: 0, opacity: 1, duration: DURATIONS.sm })
        .to(
          title,
          { clipPath: "inset(0 0 0% 0)", y: 0, opacity: 1, duration: DURATIONS.md },
          `-=${DURATIONS.sm * 0.6}`
        )
        .to(
            text,
            { clipPath: "inset(0 0 0% 0)", opacity: 1, y: 0, duration: DURATIONS.sm },
            `-=${DURATIONS.md * 0.6}`
);
    }

    // PIN + SCRUB — FONTE ÚNICA DO AVANÇO DO VÍDEO É O PROGRESSO DO SCROLL
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: SCRUB_DISTANCE,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        video.currentTime = self.progress * video.duration;
        if (self.progress > 0.02) revealContent();
      },
    });
  }

  // GARANTE DURATION DISPONÍVEL ANTES DE CALCULAR CURRENTTIME
  if (video.readyState >= 1) {
    setup();
  } else {
    video.addEventListener("loadedmetadata", setup, { once: true });
  }
}