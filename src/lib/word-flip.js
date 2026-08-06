/* ============================================
   PALAVRA GIRATÓRIA — LOOP INFINITO
   ============================================ */

/* ---------- IMPORTS ---------- */

import { gsap } from './gsap.js';

/* TÉCNICA: PRIMEIRA PALAVRA DUPLICADA NO FINAL DA FITA. QUANDO A ANIMAÇÃO
   CHEGA NA CÓPIA, A FITA VOLTA AO TOPO SEM TRANSIÇÃO — PADRÃO DE CARROSSEL
   INFINITO, EVITA O "PULO" DA ÚLTIMA PARA A PRIMEIRA PALAVRA.

   kill() GUARDADA EM el._wordFlipKill: CHAMAR initWordFlip 2× NO MESMO
   ELEMENTO MATA O LOOP ANTERIOR ANTES DE RECRIAR. */
export function initWordFlip(el, { interval = 2.2, duration = 0.6 } = {}) {
  if (typeof el._wordFlipKill === 'function') el._wordFlipKill();

  const words = (el.dataset.words || '').split(',').map((w) => w.trim()).filter(Boolean);
  if (words.length < 2) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const track = document.createElement('div');
  track.className = 'clv-sobre__flip-track';

  const loopWords = [...words, words[0]];
  loopWords.forEach((word) => {
    const line = document.createElement('span');
    line.className   = 'clv-sobre__flip-word';
    line.textContent = word;
    track.appendChild(line);
  });

  el.textContent = '';
  el.appendChild(track);

  let alive      = true;
  let posTween   = null;
  let widthTween = null;

  /* MEDE APÓS document.fonts.ready — FONTES NÃO CARREGADAS DARIAM
     offsetWidth INCORRETO */
  const start = () => {
    if (!alive) return;

    const wordEls = Array.from(track.children);
    const widths  = wordEls.map((w) => w.offsetWidth);

    gsap.set(el, { width: widths[0] });

    if (reduce) return;

    const lineHeight = wordEls[0].offsetHeight;
    let index = 0;

    function step() {
      if (!alive) return;
      index += 1;

      /* POSIÇÃO E LARGURA SINCRONIZADAS — MESMOS duration/delay/ease */
      posTween = gsap.to(track, {
        y: -index * lineHeight,
        duration,
        ease: 'power1.inOut',
        delay: interval,
        onComplete: () => {
          if (index === loopWords.length - 1) {
            gsap.set(track, { y: 0 });
            index = 0;
          }
          step();
        },
      });

      widthTween = gsap.to(el, {
        width: widths[index],
        duration,
        ease: 'power1.inOut',
        delay: interval,
      });
    }

    step();
  };

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
  } else {
    start();
  }

  const kill = () => {
    alive = false;
    if (posTween)   posTween.kill();
    if (widthTween) widthTween.kill();
    delete el._wordFlipKill;
  };

  el._wordFlipKill = kill;
  return kill;
}