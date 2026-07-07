/* ============================================
   SEÇÃO 5 — PRODUTO — TELA ANIMADA
   ============================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PRODUTO } from "../constants/motion.js";
import { animateRouletteTitle } from "../lib/roulette-title.js";

gsap.registerPlugin(ScrollTrigger);

export function initProduto() {
  const section = document.querySelector("[data-produto]");
  if (!section) return;

  const heading = section.querySelector(".produto__heading");
  const content = section.querySelector(".produto__content");
  const frame = section.querySelector(".produto__frame");
  const video = section.querySelector(".produto__video");

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- REVEAL AO ENTRAR NA SEÇÃO ---------- */
  if (reduce) {
    gsap.set([content, frame], { opacity: 1, scale: 1 });
    if (heading) gsap.set(heading, { opacity: 1 });
  } else {
    ScrollTrigger.create({
      trigger: section,
      start: PRODUTO.revealStart,
      once: true,
      onEnter: () => {
        if (heading) {
          gsap.set(heading, { opacity: 1 });
          animateRouletteTitle(heading);
        }

        gsap.to(content, {
          opacity: 1,
          duration: PRODUTO.revealDuration,
          ease: PRODUTO.revealEase,
        });
        gsap.to(frame, {
          opacity: 1,
          scale: 1,
          duration: PRODUTO.revealDuration,
          ease: PRODUTO.revealEase,
          delay: 0.15,
        });

        /* ---------- STAGGER DOS CHECKBOXES ---------- */
        const items = section.querySelectorAll(".produto__item");
        items.forEach((item, i) => {
          gsap.delayedCall(0.4 + i * 1.5, () => {
            item.classList.add("is-checked");
          });
        });
      },
    });
  }

  /* ---------- PIN + SCRUB DO VÍDEO (SÍNCRONO — EVITA BUG DE TIMING) ---------- */
  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: PRODUTO.scrubDistance,
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      if (video.duration) {
        video.currentTime = self.progress * video.duration;
      }
    },
  });

  /* ---------- PRIMING iOS ---------- */
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