/* ============================================
   SEÇÃO 1 — HERO — TIMELINE DE ABERTURA
   ============================================ */

/* ---------- IMPORTS ---------- */

import { gsap, ScrollTrigger, SplitText } from "../lib/gsap.js";
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

  /* ---------- SETA — OSCILAÇÃO CONTÍNUA ---------- */

  /* ANIMA A SETA (FILHA), NÃO O INDICADOR: O y DO INDICADOR PERTENCE À
     ENTRADA E AO FADE DE SAÍDA — DOIS TWEENS NO MESMO y BRIGARIAM. */
  const arrow = document.querySelector(`${SCROLL} .clv-hero__scroll-arrow`);
  const bob = arrow
    ? gsap.to(arrow, {
        y:        HERO.arrowBobY,
        duration: HERO.arrowBobDuration,
        ease:     EASE.inOut,
        repeat:   -1,
        yoyo:     true,
      })
    : null;

  /* ---------- INDICADOR — SOME NO PRIMEIRO SCROLL ---------- */

  /* UM ÚNICO TRIGGER POR POSIÇÃO ABSOLUTA, once: SEM ELEMENTO-GATILHO, SEM
     REVERSÃO. killTweensOf CANCELA A ENTRADA SE O USUÁRIO ROLAR ANTES DELA
     TERMINAR — SENÃO A TIMELINE DEVOLVERIA O INDICADOR DEPOIS DO FADE. */
  const indicator = document.querySelector(SCROLL);

  if (indicator) {
    ScrollTrigger.create({
      start: HERO.scrollHideAt,
      once:  true,
      onEnter() {
        gsap.killTweensOf(indicator);
        gsap.to(indicator, {
          autoAlpha: 0,
          y:         HERO.scrollHideY,
          duration:  DURATIONS.sm,
          ease:      EASE.primary,
          overwrite: true,
          onComplete: () => bob?.kill(),
        });
      },
    });
  }
}
