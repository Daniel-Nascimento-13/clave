/* ============================================
   SEÇÃO 7 — MARCAS — CARROSSEL
   ============================================ */

/* ---------- IMPORTS ---------- */

import { gsap, ScrollTrigger } from "../lib/gsap.js";
import { MARQUEE } from "../constants/motion.js";

/* ---------- MARQUEE — LOOP INFINITO, DUAS DIREÇÕES ---------- */

function initMarquee(track, direction, reduce) {
  if (!track || reduce) return null;

  const duration = direction === "right" ? MARQUEE.right : MARQUEE.left;

  if (direction === "right") {
    return gsap.fromTo(
      track,
      { xPercent: -50 },
      { xPercent: 0, duration, ease: MARQUEE.ease, repeat: -1, paused: true }
    );
  }

  return gsap.to(track, { xPercent: -50, duration, ease: MARQUEE.ease, repeat: -1, paused: true });
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
