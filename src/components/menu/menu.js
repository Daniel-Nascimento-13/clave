import { gsap } from '../../lib/gsap.js';
import { getLenis } from '../../lib/smooth-scroll.js';
import { getMarcasRevealY } from '../../animations/marcas.js';

/* ============================================
   CONSTANTES
   ============================================ */

const HIDE_THRESHOLD = 80;
const MARCAS_TARGET = '.marcas__bar';
const REVEAL_DURATION = 0.8;
const HIDE_DURATION = 0.6;
const EASE = 'power3.out';

/* ============================================
   ESTADO
   ============================================ */

let menuEl, overlays, isMenuVisible = true, openOverlayId = null;
let lenis = null; // PODE SER null EM prefers-reduced-motion — TODO USO ABAIXO TRATA ISSO

/* ============================================
   INIT
   ============================================ */

export function initMenu() {
  menuEl = document.querySelector('[data-menu]');
  overlays = document.querySelectorAll('[data-overlay]');
  lenis = getLenis(); // null SE reduced-motion ESTIVER ATIVO

  overlays.forEach((el) => {
    gsap.set(el, { clipPath: 'inset(0 0 100% 0)', autoAlpha: 0 });
  });

  if (lenis) {
    bindScrollHide();
  }
  // SEM LENIS: NAV PERMANECE FIXA E SEMPRE VISÍVEL (isMenuVisible FICA true)

  bindMenuLinks();
  bindOverlayClose();
  bindBurger();
  bindEscKey();
}

/* ============================================
   HIDE / SHOW NO SCROLL (LENIS) — SÓ RODA SE LENIS EXISTIR
   ============================================ */

function bindScrollHide() {
  lenis.on('scroll', ({ scroll, direction }) => {
    if (openOverlayId) return;

    const shouldShow = scroll < HIDE_THRESHOLD || direction === -1;

    if (shouldShow && !isMenuVisible) {
      isMenuVisible = true;
      gsap.to(menuEl, { yPercent: 0, duration: REVEAL_DURATION, ease: EASE, overwrite: true });
    }

    if (!shouldShow && isMenuVisible) {
      isMenuVisible = false;
      gsap.to(menuEl, { yPercent: -100, duration: HIDE_DURATION, ease: EASE, overwrite: true });
    }
  });
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
        openOverlay(target);
      }
    });
  });
}

function scrollToTarget(target) {
  // "ANUNCIANTES": O ALVO ÚTIL É UM PONTO NO MEIO DO PIN DA INTRO DE MARCAS, NÃO
  // O TOPO DO .marcas__bar — ELE SÓ ENTRA NA DOBRA DEPOIS DO PIN INTEIRO, O QUE
  // JOGARIA O SCROLL PRA DENTRO DE DIFERENCIAIS. O SELETOR FICA COMO FALLBACK.
  const destination = target === MARCAS_TARGET ? getMarcasRevealY() ?? target : target;

  if (lenis) {
    lenis.scrollTo(destination, { duration: 1.2 });
    return;
  }
  // FALLBACK NATIVO — SEM LENIS, SCROLL INSTANTÂNEO/NATIVO DO BROWSER
  if (typeof destination === 'number') {
    window.scrollTo({ top: destination, behavior: 'auto' });
    return;
  }
  const el = document.querySelector(destination);
  if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
}

/* ============================================
   TRAVA DE SCROLL
   ============================================ */

/* ---------- FONTE ÚNICA DA TRAVA — USADA PELOS 4 PONTOS ---------- */

// openOverlay, closeOverlay, closeBurgerMenu E bindBurger CHAMAM ESTAS DUAS
// FUNÇÕES EM VEZ DE REPETIR A REGRA: ESPALHADA, ELA VOLTA A DIVERGIR.
// NUNCA COMBINAR lenis.stop() COM overflow: hidden NO <html> — O LENIS PERDE A
// SINCRONIA COM A POSIÇÃO REAL DURANTE O BLOQUEIO E, AO RETOMAR, REPROJETA O
// SCROLL PRA UM PONTO ARBITRÁRIO. CADA CAMINHO USA UMA TRAVA SÓ.

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

function openOverlay(id) {
  const el = document.getElementById(`overlay-${id}`);
  if (!el || openOverlayId === id) return;

  if (openOverlayId) closeOverlay(true);

  openOverlayId = id;
  el.setAttribute('aria-hidden', 'false');
  el.style.pointerEvents = 'auto';
  lockScroll();

  gsap.to(el, {
    clipPath: 'inset(0 0 0% 0)',
    autoAlpha: 1,
    duration: REVEAL_DURATION,
    ease: 'expo.out',
  });
}

function closeOverlay(immediate = false) {
  if (!openOverlayId) return;
  const el = document.getElementById(`overlay-${openOverlayId}`);

  gsap.to(el, {
    clipPath: 'inset(0 0 100% 0)',
    autoAlpha: 0,
    duration: immediate ? 0.3 : REVEAL_DURATION,
    ease: EASE,
    onComplete: () => {
      el.setAttribute('aria-hidden', 'true');
      el.style.pointerEvents = 'none';
    },
  });

  unlockScroll();
  openOverlayId = null;
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
  const nav = document.querySelector('[data-menu-nav]');
  const cta = document.querySelector('.clv-menu__cta');

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
      cta.classList.remove('is-open');
    },
  });
}

function bindBurger() {
  const burger = document.querySelector('[data-menu-burger]');
  const nav = document.querySelector('[data-menu-nav]');
  const cta = document.querySelector('.clv-menu__cta');

  burger.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!isOpen));

    if (!isOpen) {
      nav.classList.add('is-open');
      cta.classList.add('is-open');
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
          cta.classList.remove('is-open');
        },
      });
    }
  });
}
