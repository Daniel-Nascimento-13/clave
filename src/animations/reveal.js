/* ============================================
   REVEAL — SISTEMA ÚNICO DE ENTRADA
   ============================================ */

/* ---------- IMPORTS ---------- */

import { gsap, ScrollTrigger, SplitText } from "../lib/gsap.js";
import { DURATIONS, EASE, REVEAL } from "../constants/motion.js";
import { buildRoulette } from "./number-roulette.js";

/* ============================================
   CONSTANTES
   ============================================ */

/* TRÊS VARIANTES NO MESMO ATRIBUTO:
     data-reveal          — PADRÃO: clip-path + y + autoAlpha
     data-reveal="block"  — IGUAL AO PADRÃO, 0.2s APÓS O "lines" DO GRUPO
     data-reveal="lines"  — SplitText POR LINHAS COM MÁSCARA

   O ESTADO INICIAL VIVE NO CSS ([data-reveal] EM main.css) PARA NÃO HAVER
   FLASH ENTRE O PAINT E ESTE MÓDULO RODAR. */
const SELECTOR = "[data-reveal], [data-roulette]";

/* GRUPO = A SEÇÃO. DEFINE DE QUEM O "block" ESPERA OS 0.2s. */
const GROUP = "section, [data-overlay]";

/* ============================================
   ENCERRAMENTO DA ENTRADA
   ============================================ */

/* clip-path E transform SÓ EXISTEM DURANTE A ANIMAÇÃO. MANTÊ-LOS DEPOIS
   RECORTA QUALQUER COISA QUE VAZE DA CAIXA — FOI O QUE CORTOU O BADGE
   "RECOMENDADO" E A SOMBRA DO CARD ANUAL.

   A CLASSE VEM ANTES DO clearProps E NO MESMO TICK: SEM ELA, LIMPAR O INLINE
   DEVOLVERIA O ELEMENTO AO ESTADO INICIAL DO CSS (clip-path DE 100%). */
export function settleReveal(el) {
  el.classList.add("is-revealed");
  gsap.set(el, { clearProps: "clipPath,transform" });
}

/* ============================================
   VARIANTES
   ============================================ */

/* ---------- PADRÃO E BLOCK ---------- */

/* OPT-IN: SEM data-reveal-bleed O RECORTE É EXATAMENTE O DE SEMPRE */
function clipOf(el) {
  if (!el.hasAttribute("data-reveal-bleed")) {
    return { from: REVEAL.clipFrom, to: REVEAL.clipTo };
  }

  return {
    from: `inset(-${REVEAL.bleed} 0% 100% 0%)`,
    to:   `inset(-${REVEAL.bleed} 0% 0% 0%)`,
  };
}

function buildBox(el) {
  const clip = clipOf(el);

  return gsap.fromTo(
    el,
    { clipPath: clip.from, y: REVEAL.y, autoAlpha: 0 },
    {
      clipPath: clip.to,
      y:        0,
      autoAlpha: 1,
      duration: DURATIONS.sm,
      ease:     EASE.primary,
      paused:   true,
      onComplete: () => settleReveal(el),
    }
  );
}

/* ---------- LINES ---------- */

/* autoSplit REFAZ O SPLIT NO resize E QUANDO AS FONTES TERMINAM DE CARREGAR.
   onSplit DEVOLVE O TWEEN, E O GSAP RESTAURA O totalTime DELE NO RESPLIT —
   ENTÃO UM TÍTULO JÁ REVELADO REAPARECE NO ESTADO FINAL, SEM REANIMAR.
   COMO O TWEEN É PAUSADO E "from", O ESTADO INICIAL JÁ FICA APLICADO NAS
   LINHAS — POR ISSO is-split PODE LIBERAR O ELEMENTO NO CSS SEM FLASH. */
function buildLines(el) {
  let tween = null;

  SplitText.create(el, {
    type:       "lines",
    mask:       "lines",
    autoSplit:  true,
    linesClass: "clv-line",
    onSplit(self) {
      el.classList.add("is-split");

      /* O SPLIT NÃO É REVERTIDO — SÓ AS PROPS DAS LINHAS SÃO LIMPAS. AS
         MÁSCARAS DO SplitText PERMANECEM, POIS SÃO PARTE DO EFEITO. */
      tween = gsap.from(self.lines, {
        yPercent:  100,
        autoAlpha: 0,
        duration:  DURATIONS.md,
        ease:      EASE.expo,
        stagger:   REVEAL.linesStagger,
        paused:    true,
        onComplete: () => gsap.set(self.lines, { clearProps: "transform" }),
      });

      return tween;
    },
  });

  /* GETTER — O RESPLIT TROCA A INSTÂNCIA DO TWEEN */
  return () => tween;
}

/* ============================================
   INIT
   ============================================ */

export function initReveal() {
  const targets = Array.from(document.querySelectorAll(SELECTOR));
  if (!targets.length) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* SEM MOVIMENTO: O CSS JÁ NEUTRALIZA O ESTADO INICIAL E A ROLETA NÃO É
     CONSTRUÍDA — O TEXTO ORIGINAL DO NÚMERO PERMANECE NO DOM */
  if (reduce) return;

  /* ---------- PREPARO — TUDO SÍNCRONO, ANTES DO TRIGGER ---------- */

  const entries = new Map();

  targets.forEach((el) => {
    const variant = el.hasAttribute("data-roulette") ? "roulette" : el.dataset.reveal || "box";

    if (variant === "roulette") {
      const tl = buildRoulette(el);
      if (tl) entries.set(el, { variant, get: () => tl });
      return;
    }

    if (variant === "lines") {
      entries.set(el, { variant, get: buildLines(el) });
      return;
    }

    const tween = buildBox(el);
    entries.set(el, { variant, get: () => tween });
  });

  /* ---------- OFFSET DO "block" ---------- */

  /* SÓ ESPERA OS 0.2s SE HOUVER UM "lines" NA MESMA SEÇÃO — UM PARÁGRAFO
     SOZINHO NÃO TEM MOTIVO PARA ATRASAR */
  entries.forEach((entry, el) => {
    if (entry.variant !== "block") {
      entry.delay = 0;
      return;
    }

    const group = el.closest(GROUP);
    entry.delay = group && group.querySelector('[data-reveal="lines"]') ? REVEAL.blockOffset : 0;
  });

  /* ---------- UM ÚNICO BATCH PARA TODAS AS VARIANTES ---------- */

  /* ScrollTrigger.batch() AGRUPA OS CALLBACKS DOS ELEMENTOS QUE ENTRAM JUNTOS —
     É A API DO GSAP PARA ISSO. NÃO HÁ forEach CRIANDO TWEEN+TRIGGER POR ITEM. */
  ScrollTrigger.batch(targets, {
    start: REVEAL.start,
    once:  true,
    onEnter(batch) {
      batch.forEach((el) => {
        const entry = entries.get(el);
        if (!entry) return;

        const anim = entry.get();
        if (!anim) return;

        if (entry.delay) {
          gsap.delayedCall(entry.delay, () => anim.play());
          return;
        }

        anim.play();
      });
    },
  });

  /* IMAGENS ENTRAM DEPOIS E EMPURRAM O LAYOUT — SEM ISTO OS GATILHOS
     ABAIXO DA DOBRA FICAM MEDIDOS NA ALTURA ERRADA */
  window.addEventListener("load", () => ScrollTrigger.refresh());
}
