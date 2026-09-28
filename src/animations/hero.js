/* ============================================
   SEÇÃO 1 — HERO — TIMELINE DE ABERTURA
   ============================================ */

/* ---------- IMPORTS ---------- */

import { gsap, SplitText } from "../lib/gsap.js";
import { DURATIONS, EASE, HERO, REVEAL } from "../constants/motion.js";
import { settleReveal } from "./reveal.js";

/* ============================================
   CONSTANTES
   ============================================ */

/* O HERO ESTÁ ACIMA DA DOBRA — ENTRA NO LOAD, SEM ScrollTrigger.
   ATRIBUTO PRÓPRIO (data-hero) PARA NÃO SER CAPTURADO PELO BATCH DE reveal.js. */
const TITLE    = '[data-hero="title"]';
const SUBTITLE = '[data-hero="subtitle"]';
const ACTIONS  = '[data-hero="actions"]';
const SCROLL   = '[data-hero="scroll"]';

/* ============================================
   INIT
   ============================================ */

export function initHero() {
  const title = document.querySelector(TITLE);
  if (!title) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* SEM MOVIMENTO: O CSS JÁ NEUTRALIZA O ESTADO INICIAL DE [data-hero] */
  if (reduce) return;

  /* ---------- TÍTULO POR LINHAS ---------- */

  /* MESMO CONTRATO DO data-reveal="lines": autoSplit REFAZ O SPLIT NO resize E
     NO fonts.ready, E O GSAP RESTAURA O totalTime DO TWEEN DEVOLVIDO PELO
     onSplit — UM TÍTULO JÁ REVELADO REAPARECE PRONTO, SEM REANIMAR.

     O TWEEN DAS LINHAS FICA FORA DA TIMELINE DAS DEMAIS ETAPAS: SE ENTRASSE
     NELA, O RESPLIT DO resize REINICIARIA SUBTÍTULO E CTAs JUNTO. */
  let lineCount = 1;

  SplitText.create(title, {
    type:       "lines",
    mask:       "lines",
    autoSplit:  true,
    linesClass: "clv-line",
    onSplit(self) {
      title.classList.add("is-split");
      lineCount = self.lines.length;

      return gsap.from(self.lines, {
        yPercent:  100,
        autoAlpha: 0,
        duration:  DURATIONS.md,
        ease:      EASE.expo,
        stagger:   REVEAL.linesStagger,
        onComplete: () => gsap.set(self.lines, { clearProps: "transform" }),
      });
    },
  });

  /* ---------- DEMAIS ETAPAS ---------- */

  /* AS ETAPAS SEGUINTES CONTINUAM A CADÊNCIA DE stepGap ABERTA PELAS LINHAS:
     CADA UMA ENTRA UM stepGap DEPOIS DA ANTERIOR, SEM ESPERAR O TÍTULO
     INTEIRO TERMINAR. O PRIMEIRO SPLIT É SÍNCRONO, ENTÃO lineCount JÁ ESTÁ
     RESOLVIDO AQUI. */
  const tl   = gsap.timeline();
  let   step = lineCount;

  const addStep = (target) => {
    if (!target || target.length === 0) return;

    tl.fromTo(
      target,
      { clipPath: REVEAL.clipFrom, y: REVEAL.y, autoAlpha: 0 },
      {
        clipPath:  REVEAL.clipTo,
        y:         0,
        autoAlpha: 1,
        duration:  DURATIONS.sm,
        ease:      EASE.primary,
        stagger:   REVEAL.linesStagger,
        onComplete() {
          this.targets().forEach(settleReveal);
        },
      },
      step * HERO.stepGap
    );

    step += 1;
  };

  addStep(document.querySelector(SUBTITLE));
  addStep(document.querySelectorAll(`${ACTIONS} > *`));
  addStep(document.querySelector(SCROLL));
}
