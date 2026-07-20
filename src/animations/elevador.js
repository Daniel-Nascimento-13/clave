/* ============================================
   SEÇÃO 2 — ELEVADOR — ANIMAÇÃO SCRUB
   ============================================ */
import { gsap, ScrollTrigger } from "../lib/gsap.js";
import { DURATIONS, EASE } from "../constants/motion.js";
import { animateRouletteTitle } from "../lib/roulette-title.js";

const SCRUB_DISTANCE = "+=250%";

export function initElevador() {
  const section = document.querySelector("[data-elevador]");
  const video = document.querySelector(".elevador__video");
  if (!section || !video) return;

  const label = document.querySelector(".elevador__label");
  const title = document.querySelector(".elevador__title");
  const text = document.querySelector(".elevador__text");

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    gsap.set([label, title, text], { clipPath: "inset(0 0 0% 0)", y: 0, opacity: 1 });
    video.pause();
    return;
  }

  video.pause();

  let hasRevealed = false;

  function revealContent() {
    if (hasRevealed) return;
    hasRevealed = true;

    gsap
      .timeline({ defaults: { ease: EASE.primary } })
      // O LABEL ENTRA JUNTO COM O TÍTULO: O CSS O DEIXA EM opacity:0 NO MESMO
      // GRUPO DE .elevador__title/.elevador__text, ENTÃO PRECISA DE UM TWEEN
      // PRÓPRIO — SEM ELE FICARIA INVISÍVEL PARA SEMPRE.
      .to(
        label,
        { clipPath: "inset(0 0 0% 0)", opacity: 1, y: 0, duration: DURATIONS.sm },
        0
      )
      .add(() => {
        gsap.set(title, { clipPath: "inset(0 0 0% 0)", y: 0, opacity: 1 });
        animateRouletteTitle(title);
      }, 0)
      .to(
        text,
        { clipPath: "inset(0 0 0% 0)", opacity: 1, y: 0, duration: DURATIONS.sm },
        `-=${DURATIONS.md * 0.3}`
      );
  }

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: SCRUB_DISTANCE,
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      if (video.duration) video.currentTime = self.progress * video.duration;
      if (self.progress > 0.02) revealContent();
    },
  });

  function primeVideo() {
    const prime = video.play();
    if (prime && typeof prime.then === "function") {
      prime.then(() => {
        video.pause();
        video.currentTime = 0;
      }).catch(() => {});
    } else {
      video.pause();
    }
  }

  if (video.readyState >= 1) {
    primeVideo();
  } else {
    video.addEventListener("loadedmetadata", primeVideo, { once: true });
  }
}