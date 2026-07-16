/* ============================================
   OVERLAY — SOBRE — VÍDEO (PLAY SOB CLIQUE)
   ============================================ */
import { gsap } from '../../lib/gsap.js';

/* ============================================
   CONSTANTES
   ============================================ */

const OVERLAY_ID = 'sobre';
const FADE_DURATION = 0.7;
const EASE = 'power3.out';

/* ============================================
   ESTADO
   ============================================ */

let videoEl, posterEl, playBtn;
let hasStarted = false;      // JÁ HOUVE UM PRIMEIRO PLAY? CONTROLA O CROSSFADE
let listeners = [];          // TODO listener REGISTRADO AQUI PRA MORRER NO destroy

/* ============================================
   INIT
   ============================================ */

export function initSobreVideo() {
  videoEl = document.querySelector('[data-sobre-video-el]');
  posterEl = document.querySelector('[data-sobre-video-poster]');
  playBtn = document.querySelector('[data-sobre-video-play]');

  if (!videoEl || !posterEl || !playBtn) return;

  gsap.set(posterEl, { autoAlpha: 1 });
  gsap.set(playBtn, { autoAlpha: 1 });
  gsap.set(videoEl, { autoAlpha: 0 });

  on(playBtn, 'click', handlePlayClick);

  // AO TERMINAR, VOLTA AO ESTADO DE POSTER — SENÃO SOBRA UM FRAME CONGELADO
  on(videoEl, 'ended', resetToPoster);

  // O overlay-open/close É EMITIDO POR menu.js (openOverlay/closeOverlay)
  on(document, 'clv:overlay-open', (e) => {
    if (e.detail?.id === OVERLAY_ID) armPreload();
  });

  on(document, 'clv:overlay-close', (e) => {
    if (e.detail?.id === OVERLAY_ID) resetToPoster();
  });

  // TROCA DE ABA — O ÁUDIO NÃO PODE CONTINUAR TOCANDO NUMA ABA ESCONDIDA
  on(document, 'visibilitychange', () => {
    if (document.hidden) resetToPoster();
  });
}

/* ============================================
   PRELOAD — SÓ QUANDO O OVERLAY ABRE
   ============================================ */

// O ARQUIVO TEM 23MB: COM preload="none" NO HTML ELE NÃO PESA NO LOAD DA PÁGINA.
// NA ABERTURA DO OVERLAY SUBIMOS PRA "metadata" (E NÃO "auto") — ISSO BUSCA SÓ O
// CABEÇALHO, DEIXANDO O play() POSTERIOR INSTANTÂNEO SEM BAIXAR O VÍDEO INTEIRO
// DE QUEM SÓ ABRIU O "SOBRE" PRA LER O TEXTO.
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

  // play() PRECISA SAIR *SÍNCRONO* DENTRO DO CLIQUE, ANTES DE QUALQUER await OU
  // CALLBACK DO GSAP. SE ELE FOR PARAR NO onComplete DO CROSSFADE, O BROWSER JÁ
  // NÃO ENXERGA MAIS O GESTO DO USUÁRIO E BLOQUEIA O ÁUDIO (OU O PLAY INTEIRO).
  const played = videoEl.play();

  hasStarted = true;

  gsap.killTweensOf([posterEl, playBtn, videoEl]);

  gsap.to(videoEl, { autoAlpha: 1, duration: FADE_DURATION, ease: EASE });
  gsap.to([posterEl, playBtn], {
    autoAlpha: 0,
    duration: FADE_DURATION,
    ease: EASE,
    onComplete: () => {
      // controls SÓ DEPOIS DO FADE: NO ESTADO DE POSTER A BARRA NATIVA APARECERIA
      // POR CIMA DA IMAGEM E SUJARIA O CARD.
      videoEl.controls = true;
    },
  });

  // SE O BROWSER RECUSAR O PLAY (POLÍTICA DE MÍDIA, REDE), NÃO PODEMOS DEIXAR O
  // POSTER APAGADO COM UM VÍDEO PARADO ATRÁS — VOLTA TUDO PRO ESTADO INICIAL.
  if (played && typeof played.catch === 'function') {
    played.catch(() => resetToPoster());
  }
}

/* ============================================
   RESET — FECHAR OVERLAY / TROCAR DE ABA / FIM DO VÍDEO
   ============================================ */

function resetToPoster() {
  if (!videoEl) return;

  videoEl.pause();
  videoEl.currentTime = 0;
  videoEl.controls = false;
  hasStarted = false;

  gsap.killTweensOf([posterEl, playBtn, videoEl]);

  // SEM TRANSIÇÃO: ISTO RODA COM O OVERLAY JÁ SUMINDO (OU A ABA ESCONDIDA), ENTÃO
  // UM FADE AQUI SERIA INVISÍVEL E AINDA DEIXARIA TWEEN VIVO DEPOIS DO FECHAMENTO.
  gsap.set(videoEl, { autoAlpha: 0 });
  gsap.set([posterEl, playBtn], { autoAlpha: 1 });
}

/* ============================================
   DESTROY
   ============================================ */

export function destroySobreVideo() {
  gsap.killTweensOf([posterEl, playBtn, videoEl]);
  listeners.forEach(({ target, type, handler }) => target.removeEventListener(type, handler));
  listeners = [];
  videoEl = posterEl = playBtn = null;
  hasStarted = false;
}

/* ---------- REGISTRO DE listeners PRA LIMPEZA ---------- */

function on(target, type, handler) {
  target.addEventListener(type, handler);
  listeners.push({ target, type, handler });
}
