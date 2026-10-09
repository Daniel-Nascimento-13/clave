/* ============================================
   SEÇÃO 7 — MARCAS — CARROSSEL
   ============================================ */

/* ---------- IMPORTS ---------- */

import { gsap, ScrollTrigger } from "../lib/gsap.js";

/* ---------- ALVO DE SCROLL DO MENU ---------- */

/* A INTRO NÃO É MAIS PINADA — O TÍTULO ENTRA PELO reveal GENÉRICO.
   SEM PIN NÃO HÁ OFFSET A CALCULAR, ENTÃO O MENU CAI NO SELETOR DIRETO.
   A EXPORT PERMANECE PORQUE menu.js CONSOME ESTE CONTRATO. */
export function getMarcasRevealY() {
  return null;
}

/* ---------- MARQUEE — LOOP INFINITO, DUAS DIREÇÕES ---------- */

function initMarquee(track, direction, reduce) {
  if (!track || reduce) return null;

  const duration = direction === "right" ? 26 : 22;

  if (direction === "right") {
    return gsap.fromTo(
      track,
      { xPercent: -50 },
      { xPercent: 0, duration, ease: "none", repeat: -1, paused: true }
    );
  }

  return gsap.to(track, { xPercent: -50, duration, ease: "none", repeat: -1, paused: true });
}

/* ---------- BOOT DA SEÇÃO ---------- */

export function initMarcas() {
  const section = document.querySelector("[data-marcas]");
  if (!section) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const tracks = section.querySelectorAll("[data-marquee]");

  /* ---------- PAUSA FORA DA TELA ---------- */

  /* UM TRIGGER PARA A SEÇÃO INTEIRA, NÃO UM POR TRACK. OS TWEENS NASCEM
     PAUSADOS E SÓ RODAM ENQUANTO ALGUM PIXEL DA SEÇÃO ESTÁ NA VIEWPORT. */
  const tweens = [...tracks]
    .map((track) => initMarquee(track, track.dataset.direction || "left", reduce))
    .filter(Boolean);

  if (!tweens.length) return;

  ScrollTrigger.create({
    trigger: section,
    start:   "top bottom",
    end:     "bottom top",
    onToggle: (self) => tweens.forEach((t) => (self.isActive ? t.play() : t.pause())),
  });
}
