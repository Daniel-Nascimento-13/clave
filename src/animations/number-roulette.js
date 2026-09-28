/* ============================================
   ROLETA DE NÚMEROS — ESTATÍSTICAS
   ============================================ */

/* ---------- IMPORTS ---------- */

import { gsap } from "../lib/gsap.js";
import { EASE, ROULETTE } from "../constants/motion.js";

/* ============================================
   CONSTANTES
   ============================================ */

/* SÓ 0–9 VIRAM COLUNA. "+", "." E QUALQUER OUTRO SÍMBOLO FICAM ESTÁTICOS —
   O SEPARADOR DE MILHAR pt-BR ("50.000+") CAI NESSE CASO E NÃO É ANIMADO. */
const DIGIT = /[0-9]/;

const CELLS_PER_TURN = 10;

/* ============================================
   CONSTRUÇÃO DA FITA
   ============================================ */

/* CADA COLUNA É UMA FITA VERTICAL: extraTurns VOLTAS DE 0–9 SEGUIDAS DO
   DÍGITO FINAL. A JANELA TEM ALTURA DE 1 LINHA E overflow: hidden, ENTÃO SÓ
   UMA CÉLULA APARECE POR VEZ. */
function buildStrip(finalDigit) {
  const col = document.createElement("span");
  col.className = "clv-roulette__col";
  col.setAttribute("aria-hidden", "true");

  const strip = document.createElement("span");
  strip.className = "clv-roulette__strip";

  for (let turn = 0; turn < ROULETTE.extraTurns; turn += 1) {
    for (let n = 0; n < CELLS_PER_TURN; n += 1) {
      const cell = document.createElement("span");
      cell.className   = "clv-roulette__cell";
      cell.textContent = String(n);
      strip.appendChild(cell);
    }
  }

  const last = document.createElement("span");
  last.className   = "clv-roulette__cell";
  last.textContent = finalDigit;
  strip.appendChild(last);

  col.appendChild(strip);
  return { col, strip, cells: ROULETTE.extraTurns * CELLS_PER_TURN + 1 };
}

/* ============================================
   API — USADA PELO BATCH DE reveal.js
   ============================================ */

/* RETORNA UMA TIMELINE PAUSADA (OU null QUANDO NÃO HÁ DÍGITOS). QUEM DISPARA
   É O ScrollTrigger.batch() ÚNICO EM reveal.js — ESTE MÓDULO NÃO CRIA TRIGGER. */
export function buildRoulette(el) {
  const value = el.textContent.trim();
  if (!value || !DIGIT.test(value)) return null;

  /* O VALOR FINAL VIRA aria-label ANTES DE O TEXTO SER TROCADO PELAS COLUNAS */
  el.setAttribute("aria-label", value);
  el.textContent = "";

  const strips = [];

  Array.from(value).forEach((char) => {
    if (!DIGIT.test(char)) {
      const symbol = document.createElement("span");
      symbol.className   = "clv-roulette__symbol";
      symbol.textContent = char;
      el.appendChild(symbol);
      return;
    }

    const { col, strip, cells } = buildStrip(char);
    el.appendChild(col);
    strips.push({ strip, cells });
  });

  if (!strips.length) return null;

  const tl = gsap.timeline({ paused: true });

  /* ESQUERDA → DIREITA: O DÍGITO MAIS SIGNIFICATIVO TRAVA PRIMEIRO, ENTÃO A
     LEITURA COMEÇA ANTES DE O NÚMERO TERMINAR DE RODAR.
     yPercent É RELATIVO À ALTURA DA FITA INTEIRA — DAÍ O (cells - 1) / cells. */
  strips.forEach(({ strip, cells }, index) => {
    tl.fromTo(
      strip,
      { yPercent: 0 },
      {
        yPercent: -((cells - 1) / cells) * 100,
        duration: ROULETTE.duration,
        ease:     EASE.expo,
      },
      index * ROULETTE.digitStagger
    );
  });

  return tl;
}
