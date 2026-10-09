/* ============================================
   CONSTANTES DE MOVIMENTO
   ============================================ */

export const DURATIONS = { sm: 0.8, md: 1.0, lg: 1.2 };
export const EASE      = { primary: "power3.out", expo: "expo.out", inOut: "power3.inOut" };

/* ---------- REVEAL — ENTRADA PADRÃO DAS SEÇÕES ---------- */

/* clipFrom/clipTo — MÁSCARA QUE SOBE: A CAIXA ABRE DE BAIXO PARA CIMA
   ENQUANTO O ELEMENTO SOBE. SÓ clip-path/transform/opacity. */
export const REVEAL = {
  y:            24,
  clipFrom:     "inset(0% 0% 100% 0%)",
  clipTo:       "inset(0% 0% 0% 0%)",
  start:        "top 85%",
  blockOffset:  0.2,
  linesStagger: 0.2,

  /* bleed — INSET SUPERIOR NEGATIVO, SÓ PARA [data-reveal-bleed]. ESTENDE O
     RECORTE ACIMA DA CAIXA PARA QUE CONTEÚDO QUE VAZA (O BADGE DO CARD ANUAL,
     13px ACIMA DA BORDA) NÃO FIQUE FATIADO DURANTE A ANIMAÇÃO. */
  bleed:        "2em",
};

/* ---------- HERO — TIMELINE DE ABERTURA ---------- */

/* stepGap — MESMA CADÊNCIA DO stagger DE LINHAS: O SUBTÍTULO, OS CTAs E O
   INDICADOR CONTINUAM A CONTAGEM INICIADA PELAS LINHAS DO H1. */
/* scrollHideAt — px DE SCROLL QUE CONTAM COMO "PRIMEIRO MOVIMENTO";
   UM VALOR > 0 EVITA DISPARO PELO BOUNCE DO iOS.
   scrollHideY — O INDICADOR DESCE UM POUCO ENQUANTO SOME. */
export const HERO = {
  stepGap:      0.2,
  scrollHideAt: 8,
  scrollHideY:  12,
  arrowBobY:        6,   /* px — OSCILAÇÃO DA SETA DO INDICADOR */
  arrowBobDuration: DURATIONS.lg,
};

/* ---------- ROLETA DE NÚMEROS ---------- */

/* extraTurns — QUANTAS VOLTAS COMPLETAS DE 0–9 A FITA PERCORRE ANTES DE
   PARAR NO DÍGITO FINAL. */
export const ROULETTE = {
  duration:     DURATIONS.lg,
  digitStagger: 0.2,
  extraTurns:   3,
};

/* ---------- DIFERENCIAIS — CARDS E GLOW ---------- */

export const DIFERENCIAIS = {
  revealX:  70,
  duration: 0.9,
  ease:     "power3.out",
  start:    "top 85%",
};

/* ---------- PRODUTO — TELA ANIMADA ---------- */

export const PRODUTO = {
  revealDuration: 0.9,
  revealEase:     "power3.out",
  revealStart:    "top 80%",
  scrubDistance:  "+=200%",
};
