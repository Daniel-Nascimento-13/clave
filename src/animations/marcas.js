/* ============================================
   SEÇÃO 3 — MARCAS — CARROSSEL E HEADLINE
   ============================================ */
import { gsap, ScrollTrigger } from "../lib/gsap.js";

const SCATTER_PRESETS = [
  { x: 420, y: -160, rotate: -14, scale: 0.9 },
  { x: -380, y: 140, rotate: 12, scale: 1.05 },
  { x: 340, y: 180, rotate: -10, scale: 0.95 },
  { x: -420, y: -120, rotate: 15, scale: 1.02 },
];

function getScatter(index) {
  const preset = SCATTER_PRESETS[index % SCATTER_PRESETS.length];
  const amplitude = window.innerWidth < 640 ? 0.45 : 1;
  return {
    x: preset.x * amplitude,
    y: preset.y * amplitude,
    rotate: preset.rotate,
    scale: preset.scale,
  };
}

/* ---------- ALVO DE SCROLL DO MENU ("ANUNCIANTES") ---------- */

// FRAÇÃO DO PROGRESSO DO PIN ONDE O MENU DEVE PARAR.
// ABAIXO DE ~0.88 O CARROSSEL AINDA ESTÁ FORA DA DOBRA: O SPACER DO PIN MEDE
// 320vh (70vh DA INTRO + 250vh DE CURSO) E O TOPO DO .marcas__bar CAI EM
// 320vh - progress * 250vh. EM 1.0 O PIN SOLTA E A SEÇÃO COMEÇA A SUBIR.
const REVEAL_PROGRESS = 0.97;

let introTrigger = null;

// RETORNA null SE O PIN NÃO EXISTE (reduced-motion) — CHAMADOR USA O FALLBACK.
export function getMarcasRevealY() {
  if (!introTrigger) return null;
  const { start, end } = introTrigger;
  return start + (end - start) * REVEAL_PROGRESS;
}

/* ---------- INTRO PINADA — HEADLINE EM SCATTER, CONVERGE NO SCROLL ---------- */
function initMarcasIntro() {
  const container = document.querySelector("[data-marcas-intro]");
  const headline = document.querySelector("[data-marcas-headline]");
  const subtitle = document.querySelector("[data-marcas-subtitle]");
  if (!container || !headline || !subtitle) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const text = headline.textContent;
  headline.textContent = "";
  const letters = [...text].map((char) => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    headline.appendChild(span);
    return span;
  });

  if (reduce) {
    gsap.set(letters, { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 });
    gsap.set(subtitle, { opacity: 1, y: 0 });
    return;
  }

  gsap.set(letters, {
    x: (index) => getScatter(index).x,
    y: (index) => getScatter(index).y,
    rotate: (index) => getScatter(index).rotate,
    scale: (index) => getScatter(index).scale,
    opacity: 0,
  });

  const total = letters.length;

  introTrigger = ScrollTrigger.create({
    id: "marcas-intro",
    trigger: container,
    start: "top top",
    end: "+=250%",
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const progress = self.progress;
      letters.forEach((letter, index) => {
        const start = Math.min((index / total) * 0.6, 0.6);
        const end = Math.min(start + 0.3, 0.85);
        const p = gsap.utils.clamp(0, 1, gsap.utils.normalize(start, end, progress));
        const scatter = getScatter(index);
        gsap.set(letter, {
          x: gsap.utils.interpolate(scatter.x, 0, p),
          y: gsap.utils.interpolate(scatter.y, 0, p),
          rotate: gsap.utils.interpolate(scatter.rotate, 0, p),
          scale: gsap.utils.interpolate(scatter.scale, 1, p),
          opacity: p,
        });
      });

      const subtitleProgress = gsap.utils.clamp(0, 1, gsap.utils.normalize(0.75, 1, progress));
      gsap.set(subtitle, {
        opacity: subtitleProgress,
        y: gsap.utils.interpolate(28, 0, subtitleProgress),
      });
    },
  });
}

/* ---------- MARQUEE — LOOP INFINITO, DUAS DIREÇÕES ---------- */
function initMarquee(track, direction, reduce) {
  if (!track || reduce) return;

  const duration = direction === "right" ? 26 : 22;

  if (direction === "right") {
    gsap.fromTo(
      track,
      { xPercent: -50 },
      {
        xPercent: 0,
        duration,
        ease: "none",
        repeat: -1,
      }
    );
  } else {
    gsap.to(track, {
      xPercent: -50,
      duration,
      ease: "none",
      repeat: -1,
    });
  }
}

/* ---------- BOOT DA SEÇÃO ---------- */
export function initMarcas() {
  const section = document.querySelector("[data-marcas]");
  if (!section) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  initMarcasIntro();

  const tracks = section.querySelectorAll("[data-marquee]");
  tracks.forEach((track) => {
    const direction = track.dataset.direction || "left";
    initMarquee(track, direction, reduce);
  });
}