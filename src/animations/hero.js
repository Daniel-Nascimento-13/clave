/* ============================================
   SEÇÃO 1 — HERO — LOGO ANIMADA
   ============================================ */
import { gsap } from "../lib/gsap.js";
import { getLenis } from "../lib/smooth-scroll.js";

export function initHero() {
  const video = document.querySelector(".hero__video");
  if (!video) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    video.pause();
    video.currentTime = video.duration || 0;
    return;
  }

  // ENTRADA — FADE LEVE, EVITA "POP" ABRUPTO DO VÍDEO
  gsap.from(video, {
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
  });

  // TRANSIÇÃO AUTOMÁTICA — AO TERMINAR A MARCA, ROLA ATÉ O ELEVADOR
  video.addEventListener("ended", () => {
    const elevador = document.querySelector("[data-elevador]");
    const lenis = getLenis();
    if (!elevador || !lenis) return;

    lenis.scrollTo(elevador, {
      duration: 1.5,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
  });
}