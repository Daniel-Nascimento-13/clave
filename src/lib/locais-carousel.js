/* ============================================
   CARROSSEL — LOCAIS
   ============================================ */

import { gsap } from "./gsap.js";
import { DURATIONS, EASE } from "../constants/motion.js";

export function initLocaisCarousel() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const track   = document.querySelector(".clv-locais__track");
  const cards   = document.querySelectorAll(".clv-locais__card");
  const btnPrev = document.querySelector(".clv-locais__arrow--prev");
  const btnNext = document.querySelector(".clv-locais__arrow--next");

  if (!track || !cards.length || !btnPrev || !btnNext) return;

  let current = 0;
  const total = cards.length;

  /* O DESLOCAMENTO VAI NOS CARDS, NÃO NO TRACK: O TRACK É QUEM RECORTA
     (overflow: hidden) — MOVÊ-LO LEVARIA O RECORTE JUNTO E A TELA NÃO MUDARIA.
     CADA CARD MEDE 100% DO TRACK, ENTÃO xPercent -100 POR ÍNDICE ALINHA O PRÓXIMO. */
  function goTo(index) {
    current = (index + total) % total;

    gsap.to(cards, {
      xPercent:  -100 * current,
      duration:  reduce ? 0 : DURATIONS.sm,
      ease:      EASE.inOut,
      overwrite: true,
    });
  }

  btnPrev.addEventListener("click", () => goTo(current - 1));
  btnNext.addEventListener("click", () => goTo(current + 1));
}
