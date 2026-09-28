/* ============================================
   MENU — NAVEGAÇÃO PRINCIPAL
   ============================================ */

/* ---------- IMPORTS ---------- */

import { gsap } from '../../lib/gsap.js';
import { getLenis } from '../../lib/smooth-scroll.js';
import { getMarcasRevealY } from '../../animations/marcas.js';

/* ============================================
   CONSTANTES
   ============================================ */

const MARCAS_TARGET   = '.marcas__bar';
const REVEAL_DURATION = 0.8;
const EASE            = 'power3.out';

/* ============================================
   ESTADO
   ============================================ */

let overlays, openOverlayId = null;
let lenis = null; /* null EM prefers-reduced-motion — TODO USO ABAIXO TRATA ISSO */

/* ============================================
   INIT
   ============================================ */

export function initMenu() {
  const menuEl = document.querySelector('[data-menu]');
  gsap.set(menuEl, { y: 0, clearProps: 'transform' });

  overlays = document.querySelectorAll('[data-overlay]');
  lenis    = getLenis();

  overlays.forEach((el) => {
    gsap.set(el, { clipPath: 'inset(0 0 100% 0)', autoAlpha: 0 });
  });

  bindMenuLinks();
  bindOverlayClose();
  bindBurger();
  bindEscKey();
}

/* ============================================
   CLIQUES NOS LINKS
   ============================================ */

function bindMenuLinks() {
  document.querySelectorAll('[data-menu-link]').forEach((link) => {
    link.addEventListener('click', (e) => {
      closeBurgerMenu();

      const action = link.dataset.action;
      const target = link.dataset.target;

      if (action === 'scroll') {
        e.preventDefault();
        closeOverlay();
        scrollToTarget(target);
      }

      if (action === 'overlay') {
        e.preventDefault();
        /* data-category/data-item REPASSADOS CRUS — QUEM INTERPRETA É O OVERLAY */
        openOverlay(target, { category: link.dataset.category, item: link.dataset.item });
      }
    });
  });
}

function scrollToTarget(target) {
  /* "ANUNCIANTES" APONTA PARA UM PONTO NO MEIO DO PIN DE MARCAS —
     O SELETOR É SÓ FALLBACK */
  const destination = target === MARCAS_TARGET ? getMarcasRevealY() ?? target : target;

  /* AGUARDA O FECHAMENTO DO BURGER ANTES DE SCROLLAR.
     A SONDA É is-open NA NAV, NÃO aria-expanded NO BURGER: closeBurgerMenu()
     RODA ANTES DAQUI E JÁ ZEROU O aria-expanded DE FORMA SÍNCRONA. A CLASSE
     SÓ CAI NO onComplete DO TWEEN (0.6s), ENTÃO AINDA ESTÁ LÁ NESTE PONTO. */
  const burgerAberto = document
    .querySelector('[data-menu-nav]')
    ?.classList.contains('is-open');

  const delay = burgerAberto ? 700 : 0;

  setTimeout(() => {
    if (lenis) {
      /* offset NEGATIVO — DESCONTA A BARRA FIXA DE 80px */
      lenis.scrollTo(destination, { duration: 1.2, offset: -80 });
      return;
    }

    if (typeof destination === 'number') {
      window.scrollTo({ top: destination, behavior: 'auto' });
      return;
    }

    const el = document.querySelector(destination);
    if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, delay);
}

/* ============================================
   TRAVA DE SCROLL
   ============================================ */

/* FONTE ÚNICA DA TRAVA — NUNCA COMBINAR lenis.stop() COM overflow: hidden:
   O LENIS PERDE SINCRONIA E REPROJEITA O SCROLL AO RETOMAR. */

function lockScroll() {
  if (lenis) lenis.stop();
  else document.documentElement.classList.add('clv-no-scroll');
}

function unlockScroll() {
  if (lenis) lenis.start();
  else document.documentElement.classList.remove('clv-no-scroll');
}

/* ============================================
   OVERLAYS
   ============================================ */

/* EXPORTADA PARA MÓDULOS EXTERNOS (EX.: predios.js) — TRAVA E EVENTO
   PRECISAM SAIR DE UM LUGAR SÓ */
export function openOverlay(id, params = {}) {
  const el = document.getElementById(`overlay-${id}`);
  if (!el || openOverlayId === id) return;

  if (openOverlayId) closeOverlay(true);

  openOverlayId = id;
  el.setAttribute('aria-hidden', 'false');
  el.style.pointerEvents = 'auto';
  lockScroll();
  emitOverlayEvent('open', id, params);

  gsap.to(el, {
    clipPath: 'inset(0 0 0% 0)',
    autoAlpha: 1,
    duration: REVEAL_DURATION,
    ease: 'expo.out',
  });
}

/* EXPORTADA PARA O ITEM "HOME" DO FILTRO DO "ANUNCIE" */
export function closeOverlay(immediate = false) {
  if (!openOverlayId) return;
  const el = document.getElementById(`overlay-${openOverlayId}`);

  /* EMIT ANTES DO TWEEN — CONTEÚDO (EX.: VÍDEO DO "SOBRE") PARA NO CLIQUE */
  emitOverlayEvent('close', openOverlayId);

  const closingId = openOverlayId;

  gsap.to(el, {
    clipPath: 'inset(0 0 100% 0)',
    autoAlpha: 0,
    duration: immediate ? 0.3 : REVEAL_DURATION,
    ease: EASE,
    onComplete: () => {
      /* GUARDA CONTRA RACE CONDITION: NOVO OVERLAY ABERTO DURANTE O TWEEN */
      if (openOverlayId === closingId) return;
      el.setAttribute('aria-hidden', 'true');
      el.style.pointerEvents = 'none';
    },
  });

  unlockScroll();
  openOverlayId = null;
}

/* ---------- EVENTOS ---------- */

/* menu.js NÃO CONHECE O CONTEÚDO DE CADA OVERLAY — O EVENTO INVERTE O ACOPLAMENTO */
function emitOverlayEvent(action, id, params = {}) {
  document.dispatchEvent(new CustomEvent(`clv:overlay-${action}`, { detail: { id, ...params } }));
}

function bindOverlayClose() {
  document.querySelectorAll('[data-overlay-close]').forEach((btn) => {
    btn.addEventListener('click', () => closeOverlay());
  });
}

function bindEscKey() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeOverlay();
  });
}

/* ============================================
   BURGER (MOBILE)
   ============================================ */

function closeBurgerMenu() {
  const burger = document.querySelector('[data-menu-burger]');
  const nav    = document.querySelector('[data-menu-nav]');

  if (burger.getAttribute('aria-expanded') !== 'true') return;

  burger.setAttribute('aria-expanded', 'false');
  unlockScroll();

  gsap.to(nav, {
    clipPath: 'inset(0 0 100% 0)',
    autoAlpha: 0,
    duration: 0.6,
    ease: EASE,
    onComplete: () => {
      nav.classList.remove('is-open');
      gsap.set(nav, { clearProps: 'opacity,visibility,clipPath' });
    },
  });
}

function bindBurger() {
  const burger = document.querySelector('[data-menu-burger]');
  const nav    = document.querySelector('[data-menu-nav]');

  burger.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!isOpen));

    if (!isOpen) {
      nav.classList.add('is-open');
      lockScroll();
      gsap.set(nav, { clipPath: 'inset(0 0 100% 0)', autoAlpha: 0 });
      gsap.to(nav, { clipPath: 'inset(0 0 0% 0)', autoAlpha: 1, duration: 0.6, ease: EASE });
    } else {
      unlockScroll();
      gsap.to(nav, {
        clipPath: 'inset(0 0 100% 0)',
        autoAlpha: 0,
        duration: 0.6,
        ease: EASE,
        onComplete: () => {
          nav.classList.remove('is-open');
          gsap.set(nav, { clearProps: 'opacity,visibility,clipPath' });
        },
      });
    }
  });
}