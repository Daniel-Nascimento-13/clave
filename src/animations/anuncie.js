/* ============================================
   OVERLAY — ANUNCIE — ANIMAÇÕES
   ============================================ */

/* ---------- IMPORTS ---------- */

import { gsap } from "../lib/gsap.js";

const REVEAL_DURATION = 0.8;
const EASE = "power3.out";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- SHIMMER ---------- */

let shimmerTween = null;

export function hideShimmer(glows) {
  shimmerTween?.kill();
  shimmerTween = null;
  gsap.set(glows, { autoAlpha: 0 });
}

export function playShimmer(glows, target) {
  hideShimmer(glows);
  if (!target) return;

  gsap.set(target, { autoAlpha: 1 });

  if (prefersReducedMotion()) {
    gsap.set(target, { backgroundPosition: "0px 0" });
    return;
  }

  shimmerTween = gsap.fromTo(
    target,
    { backgroundPosition: "-60px 0" },
    {
      backgroundPosition: "60px 0",
      duration: 1.4,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    }
  );
}

/* ---------- INDICADOR DE SCROLL ---------- */

const hintTweens = new WeakMap();

export function toggleHint(hint, mostrar) {
  if (!hint) return;

  if (!mostrar) {
    hintTweens.get(hint)?.kill();
    hintTweens.delete(hint);
    gsap.set(hint, { visibility: "hidden", opacity: 0, x: 0 });
    return;
  }

  if (hintTweens.has(hint)) return;

  gsap.set(hint, { visibility: "visible" });

  if (prefersReducedMotion()) {
    gsap.set(hint, { opacity: 1, x: 0 });
    return;
  }

  const sentido = hint.dataset.anuncieHint === "prev" ? 4 : -4;

  hintTweens.set(
    hint,
    gsap.fromTo(
      hint,
      { x: sentido, opacity: 0.35 },
      { x: 0, opacity: 1, duration: 1.4, ease: "power1.inOut", repeat: -1, yoyo: true }
    )
  );
}

/* ---------- REVELAR PÍLULA ATIVA ---------- */

export function revelarPilulaAtiva(menu, pill) {
  if (!pill) return;

  const max = menu.scrollWidth - menu.clientWidth;
  if (max <= 1) return;

  const areaMenu = menu.getBoundingClientRect();
  const areaPill = pill.getBoundingClientRect();

  if (areaPill.left >= areaMenu.left - 1 && areaPill.right <= areaMenu.right + 1) return;

  const alvo = gsap.utils.clamp(
    0,
    max,
    menu.scrollLeft + (areaPill.left - areaMenu.left) - (menu.clientWidth - areaPill.width) / 2
  );

  if (prefersReducedMotion()) {
    menu.scrollLeft = alvo;
    return;
  }

  gsap.to(menu, {
    scrollTo: { x: alvo },
    duration: 0.8,
    ease: EASE,
    overwrite: true,
  });
}

/* ---------- TROCA DE SLIDE ---------- */

export function revealSlide(textEl, photoEl) {
  gsap.fromTo(
    textEl,
    { clipPath: "inset(0 0 100% 0)", y: 16, autoAlpha: 0 },
    {
      clipPath: "inset(0 0 0% 0)",
      y: 0,
      autoAlpha: 1,
      duration: REVEAL_DURATION,
      ease: EASE,
      overwrite: true,
    }
  );

  gsap.fromTo(
    photoEl,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: REVEAL_DURATION, ease: EASE, overwrite: true }
  );
}

/* ---------- LIMPEZA ---------- */

export function destroyAnuncie(glows, hints, elements) {
  hideShimmer(glows);
  hints.forEach((hint) => toggleHint(hint, false));
  gsap.killTweensOf(elements);
}