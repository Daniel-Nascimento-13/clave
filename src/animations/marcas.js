/* ============================================
   SEÇÃO 7 — MARCAS — CARROSSEL
   ============================================ */

/* ---------- IMPORTS ---------- */

import { gsap } from "../lib/gsap.js";

/* ---------- ALVO DE SCROLL DO MENU ---------- */

/* A INTRO NÃO É MAIS PINADA — O TÍTULO ENTRA PELO reveal GENÉRICO.
   SEM PIN NÃO HÁ OFFSET A CALCULAR, ENTÃO O MENU CAI NO SELETOR DIRETO.
   A EXPORT PERMANECE PORQUE menu.js CONSOME ESTE CONTRATO. */
export function getMarcasRevealY() {
  return null;
}

/* ---------- MARQUEE — LOOP INFINITO, DUAS DIREÇÕES ---------- */

function initMarquee(track, direction, reduce) {
  if (!track || reduce) return;

  const duration = direction === "right" ? 26 : 22;

  if (direction === "right") {
    gsap.fromTo(
      track,
      { xPercent: -50 },
      { xPercent: 0, duration, ease: "none", repeat: -1 }
    );
  } else {
    gsap.to(track, { xPercent: -50, duration, ease: "none", repeat: -1 });
  }
}

/* ---------- BOOT DA SEÇÃO ---------- */

export function initMarcas() {
  const section = document.querySelector("[data-marcas]");
  if (!section) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const tracks = section.querySelectorAll("[data-marquee]");
  tracks.forEach((track) => {
    const direction = track.dataset.direction || "left";
    initMarquee(track, direction, reduce);
  });
}
