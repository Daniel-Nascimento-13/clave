/* ============================================
   OVERLAY — SOBRE — VÍDEO (PLAY SOB CLIQUE)
   ============================================ */

/* ---------- IMPORTS ---------- */

import { gsap } from '../../lib/gsap.js';

/* ============================================
   CONSTANTES
   ============================================ */

const OVERLAY_ID    = 'sobre';
const FADE_DURATION = 0.7;
const EASE          = 'power3.out';

/* ============================================
   ESTADO
   ============================================ */

let videoEl, posterEl, playBtn;
let hasStarted = false; /* CONTROLA O CROSSFADE — JÁ HOUVE UM PRIMEIRO PLAY? */
let listeners  = [];    /* TODO LISTENER REGISTRADO AQUI PRA MORRER NO destroy */

/* ============================================
   INIT
   ============================================ */

export function initSobreVideo() {
  videoEl  = document.querySelector('[data-sobre-video-el]');
  posterEl = document.querySelector('[data-sobre-video-poster]');
  playBtn  = document.querySelector('[data-sobre-video-play]');

  if (!videoEl || !posterEl || !playBtn) return;

  gsap.set(posterEl, { autoAlpha: 1 });
  gsap.set(playBtn,  { autoAlpha: 1 });
  gsap.set(videoEl,  { autoAlpha: 0 });

  on(playBtn,  'click', handlePlayClick);
  on(videoEl,  'ended', resetToPoster);

  on(document, 'clv:overlay-open',  (e) => { if (e.detail?.id === OVERLAY_ID) armPreload(); });
  on(document, 'clv:overlay-close', (e) => { if (e.detail?.id === OVERLAY_ID) resetToPoster(); });

  /* ÁUDIO NÃO PODE CONTINUAR EM ABA ESCONDIDA */
  on(document, 'visibilitychange', () => { if (document.hidden) resetToPoster(); });
}

/* ============================================
   PRELOAD
   ============================================ */

/* 23MB COM preload="none" NO HTML — NA ABERTURA SOBE PARA "metadata" (SÓ O CABEÇALHO),
   DEIXANDO O play() POSTERIOR INSTANTÂNEO SEM BAIXAR O ARQUIVO INTEIRO */
function armPreload() {
  if (!videoEl || hasStarted) return;
  if (videoEl.preload !== 'none') return;
  videoEl.preload = 'metadata';
  videoEl.load();
}

/* ============================================
   PLAY — CROSSFADE POSTER → VÍDEO
   ============================================ */

function handlePlayClick() {
  if (!videoEl) return;

  /* play() SÍNCRONO DENTRO DO CLIQUE — SE FOR PRA UM CALLBACK DO GSAP,
     O BROWSER NÃO ENXERGA MAIS O GESTO E BLOQUEIA O ÁUDIO */
  const played = videoEl.play();

  hasStarted = true;

  gsap.killTweensOf([posterEl, playBtn, videoEl]);

  gsap.to(videoEl, { autoAlpha: 1, duration: FADE_DURATION, ease: EASE });
  gsap.to([posterEl, playBtn], {
    autoAlpha: 0,
    duration: FADE_DURATION,
    ease: EASE,
    onComplete: () => {
      /* controls SÓ APÓS O FADE — EVITA BARRA NATIVA SOBRE O POSTER */
      videoEl.controls = true;
    },
  });

  /* PLAY RECUSADO PELO BROWSER: VOLTA AO ESTADO INICIAL */
  if (played && typeof played.catch === 'function') {
    played.catch(() => resetToPoster());
  }
}

/* ============================================
   RESET — FECHAR / TROCAR DE ABA / FIM DO VÍDEO
   ============================================ */

function resetToPoster() {
  if (!videoEl) return;

  videoEl.pause();
  videoEl.currentTime = 0;
  videoEl.controls    = false;
  hasStarted          = false;

  gsap.killTweensOf([posterEl, playBtn, videoEl]);

  /* SEM TRANSIÇÃO — OVERLAY JÁ ESTÁ SUMINDO, FADE SERIA INVISÍVEL
     E DEIXARIA TWEEN VIVO APÓS O FECHAMENTO */
  gsap.set(videoEl,          { autoAlpha: 0 });
  gsap.set([posterEl, playBtn], { autoAlpha: 1 });
}

/* ============================================
   DESTROY
   ============================================ */

export function destroySobreVideo() {
  gsap.killTweensOf([posterEl, playBtn, videoEl]);
  listeners.forEach(({ target, type, handler }) => target.removeEventListener(type, handler));
  listeners  = [];
  videoEl = posterEl = playBtn = null;
  hasStarted = false;
}

/* ---------- REGISTRO DE LISTENERS ---------- */

function on(target, type, handler) {
  target.addEventListener(type, handler);
  listeners.push({ target, type, handler });
}