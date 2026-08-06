/* ============================================
   OVERLAY — ANUNCIE COM A CLAVE
   ============================================ */

/* ---------- IMPORTS ---------- */

import { PREDIOS, CATEGORIAS } from '../../data/predios.js';
import { getLenis } from '../../lib/smooth-scroll.js';
import { closeOverlay } from '../menu/menu.js';
import { getWhatsappLink } from '../../lib/whatsapp.js';
import {
  playShimmer,
  hideShimmer,
  revealSlide,
  revelarPilulaAtiva,
  toggleHint,
  destroyAnuncie,
} from '../../animations/anuncie.js';

const FILTRO_PADRAO = 'todos';

/* ============================================
   INIT
   ============================================ */

export function initAnuncie() {
  const overlay   = document.getElementById('overlay-anuncie');
  if (!overlay) return;

  const pills     = overlay.querySelectorAll('[data-anuncie-filter]');
  const glows     = overlay.querySelectorAll('.clv-anuncie-menu__glow');
  const carousel  = overlay.querySelector('[data-anuncie-carousel]');
  const empty     = overlay.querySelector('[data-anuncie-empty]');
  const textEl    = overlay.querySelector('[data-anuncie-text]');
  const counter   = overlay.querySelector('[data-anuncie-counter]');
  const title     = overlay.querySelector('[data-anuncie-title]');
  const tag       = overlay.querySelector('[data-anuncie-tag]');
  const desc      = overlay.querySelector('[data-anuncie-desc]');
  const photo     = overlay.querySelector('[data-anuncie-photo]');
  const metricsEl = overlay.querySelector('[data-anuncie-metrics]');
  const menu      = overlay.querySelector('[data-anuncie-menu]');
  const hintPrev  = overlay.querySelector('[data-anuncie-hint="prev"]');
  const hintNext  = overlay.querySelector('[data-anuncie-hint="next"]');
  const nav       = overlay.querySelector('[data-anuncie-nav]');
  const prevBtn   = overlay.querySelector('[data-anuncie-prev]');
  const nextBtn   = overlay.querySelector('[data-anuncie-next]');

  let filtro = FILTRO_PADRAO;
  let index  = 0;
  let itens  = [];

  /* ---------- DADOS ---------- */

  function filtrar(slug) {
    const categoria = CATEGORIAS[slug];
    if (!categoria) return [...PREDIOS];
    return PREDIOS.filter((p) => p.categoria === categoria);
  }

  /* ---------- RENDER ---------- */

  /* LABELS VÊM DOS DADOS — Object.values PRESERVA A ORDEM DE DECLARAÇÃO */
  function renderMetrics(metricas) {
    metricsEl.innerHTML = '';
    Object.values(metricas).forEach((m) => {
      const item = document.createElement('div');
      item.className = 'clv-anuncie__metric';
      item.innerHTML = `
        <div class="clv-anuncie__metric-label">${m.label}</div>
        <div class="clv-anuncie__metric-valor">${m.valor}</div>
      `;
      metricsEl.appendChild(item);
    });
  }

  function render(animate) {
    const item = itens[index];

    /* CATEGORIA SEM LOCAIS: CARROSSEL SAI, MENSAGEM ENTRA */
    if (!item) {
      carousel.classList.add('is-hidden');
      empty.classList.remove('is-hidden');
      return;
    }

    carousel.classList.remove('is-hidden');
    empty.classList.add('is-hidden');

    counter.textContent = `${pad(index + 1)} / ${pad(itens.length)}`;
    title.textContent   = item.nome;
    tag.textContent     = item.categoria;
    desc.textContent    = item.descricao;
    photo.src           = item.foto;
    photo.alt           = item.nome;
    renderMetrics(item.metricas);

    const whatsappBtn = overlay.querySelector('[data-anuncie-whatsapp]');
    if (whatsappBtn) {
      const nome = item.nome?.trim() ?? '';
      const msg  = nome
        ? `Olá! Espero que esteja tudo bem.\n\nTenho interesse em anunciar no *${nome}*. \n\nPodem me passar mais informações? Obrigado!`
        : `Olá! Espero que esteja tudo bem.\n\nTenho interesse em anunciar com a Clave e gostaria de mais informações.\n\nObrigado!`;
      whatsappBtn.href = getWhatsappLink(msg);
    }

    /* UM ITEM SÓ = SEM NAVEGAÇÃO POSSÍVEL */
    nav.classList.toggle('is-disabled', itens.length < 2);

    if (animate) revealSlide(textEl, photo);
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  /* ---------- NAVEGAÇÃO ---------- */

  function goTo(i) {
    if (itens.length < 2) return;
    index = (i + itens.length) % itens.length;
    render(true);
  }

  /* ---------- FILTRO ---------- */

  /* shimmer: false NA ABERTURA NEUTRA — BRILHO SÓ APÓS ESCOLHA EXPLÍCITA.
     item: NOME DO LOCAL A SELECIONAR (VINDO DO "SABER MAIS" DA SEÇÃO PRÉDIOS). */
  function aplicarFiltro(slug, { shimmer = true, animate = true, item } = {}) {
    filtro = slug;
    itens  = filtrar(slug);

    const alvo = item ? itens.findIndex((p) => p.nome === item) : -1;
    index = alvo > -1 ? alvo : 0;

    const ativo = [...pills].find((p) => p.dataset.anuncieFilter === slug);
    pills.forEach((p) => p.classList.toggle('is-active', p === ativo));

    if (shimmer) playShimmer(glows, ativo?.querySelector('.clv-anuncie-menu__glow'));
    else hideShimmer(glows);

    render(animate);
  }

  /* ---------- SINALIZAÇÃO DE SCROLL DO MENU ---------- */

  /* TOLERÂNCIA DE 1px — scrollLeft É FRACIONÁRIO EM DPR > 1 E NUNCA CHEGA
     EXATAMENTE NO MÁXIMO. UM CÁLCULO SÓ ALIMENTA FADE E SETA DO MESMO LADO. */
  function updateFade() {
    const max           = menu.scrollWidth - menu.clientWidth;
    const rolavel       = max > 1;
    const temMaisADireita = rolavel && menu.scrollLeft < max - 1;
    const jaRolou       = rolavel && menu.scrollLeft > 1;

    menu.classList.toggle('is-fade-start', jaRolou);
    menu.classList.toggle('is-fade-end', temMaisADireita);
    toggleHint(hintNext, temMaisADireita);
    toggleHint(hintPrev, jaRolou);
  }

  menu.addEventListener('scroll', updateFade, { passive: true });
  window.addEventListener('resize', updateFade);

  /* ---------- RESET ---------- */

  /* scrollLeft ZERADO: REABRIR PARECE SEMPRE UMA ABERTURA NOVA */
  function reset(category, item) {
    menu.scrollLeft = 0;

    const vindoDeCategoria = Boolean(category) && category in CATEGORIAS;

    aplicarFiltro(vindoDeCategoria ? category : FILTRO_PADRAO, {
      shimmer: vindoDeCategoria,
      animate: false,
      item: vindoDeCategoria ? item : undefined,
    });
  }

  /* ---------- EVENTOS ---------- */

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const slug = pill.dataset.anuncieFilter;

      /* "HOME" FECHA O OVERLAY E VOLTA AO TOPO — NÃO FILTRA */
      if (slug === 'home') {
        closeOverlay();
        scrollToTopo();
        return;
      }

      aplicarFiltro(slug);
    });
  });

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));

  /* RESET NA ABERTURA (NÃO NO FECHAMENTO) — GARANTE ESTADO LIMPO
     MESMO SE FECHADO POR ESC OU X */
  document.addEventListener('clv:overlay-open', (e) => {
    if (e.detail.id !== 'anuncie') return;
    reset(e.detail.category, e.detail.item);
    updateFade();
    revelarPilulaAtiva(menu, overlay.querySelector('.clv-anuncie-menu__pill.is-active'));
  });

  document.addEventListener('clv:overlay-close', (e) => {
    if (e.detail.id !== 'anuncie') return;
    /* menu NA LISTA: FECHAR NO MEIO DO TWEEN DE scrollLeft DEIXARIA
       O MENU ROLANDO SOZINHO ENQUANTO O OVERLAY SOME */
    destroyAnuncie(glows, [hintPrev, hintNext], [textEl, photo, menu]);
  });

  aplicarFiltro(FILTRO_PADRAO, { shimmer: false, animate: false });
  updateFade();
}

/* ============================================
   HOME — VOLTA AO TOPO
   ============================================ */

function scrollToTopo() {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.2 });
    return;
  }
  window.scrollTo({ top: 0, behavior: 'auto' });
}