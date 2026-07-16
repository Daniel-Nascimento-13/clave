/* ============================================
   OVERLAY — SOBRE
   ============================================ */
import { initWordFlip } from '../../lib/word-flip.js';
import { initSobreVideo } from './sobre-video.js';

export function initSobre() {
  const flipEl = document.querySelector('[data-word-flip]');
  if (flipEl) initWordFlip(flipEl);

  initSobreVideo();
}
