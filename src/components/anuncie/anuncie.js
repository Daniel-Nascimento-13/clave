/* ============================================
   OVERLAY — ANUNCIE COM A CLAVE
   ============================================ */
import { PREDIOS, CATEGORIAS } from '../../data/predios.js';
import { getLenis } from '../../lib/smooth-scroll.js';
import { closeOverlay } from '../menu/menu.js';
import {
  playShimmer,
  hideShimmer,
  revealSlide,
  revelarPilulaAtiva,
  toggleHint,
  destroyAnuncie,
} from '../../animations/anuncie.js';

/* A ABERTURA/FECHAMENTO DO OVERLAY É GENÉRICA E VIVE EM menu.js (data-action="overlay"
   data-target="anuncie"). ESTE ARQUIVO CUIDA SÓ DO CONTEÚDO: FILTRO + CARROSSEL. */

/* ============================================
   CONSTANTES
   ============================================ */

// O MAPA slug -> categoria VEM DE data/predios.js: OS BOTÕES DE CATEGORIA E O
// "SABER MAIS" DA SEÇÃO PRÉDIOS MONTAM O data-category A PARTIR DELE, ENTÃO OS DOIS
// LADOS PRECISAM LER A MESMA TABELA.

const FILTRO_PADRAO = 'todos';

/* ============================================
   INIT
   ============================================ */

export function initAnuncie() {
  const overlay = document.getElementById('overlay-anuncie');
  if (!overlay) return;

  const pills = overlay.querySelectorAll('[data-anuncie-filter]');
  const glows = overlay.querySelectorAll('.clv-anuncie-menu__glow');
  const carousel = overlay.querySelector('[data-anuncie-carousel]');
  const empty = overlay.querySelector('[data-anuncie-empty]');
  const textEl = overlay.querySelector('[data-anuncie-text]');
  const counter = overlay.querySelector('[data-anuncie-counter]');
  const title = overlay.querySelector('[data-anuncie-title]');
  const tag = overlay.querySelector('[data-anuncie-tag]');
  const desc = overlay.querySelector('[data-anuncie-desc]');
  const photo = overlay.querySelector('[data-anuncie-photo]');
  const metricsEl = overlay.querySelector('[data-anuncie-metrics]');
  const menu = overlay.querySelector('[data-anuncie-menu]');
  const hint = overlay.querySelector('[data-anuncie-hint]');
  const nav = overlay.querySelector('[data-anuncie-nav]');
  const prevBtn = overlay.querySelector('[data-anuncie-prev]');
  const nextBtn = overlay.querySelector('[data-anuncie-next]');

  let filtro = FILTRO_PADRAO;
  let index = 0;
  let itens = [];

  /* ---------- DADOS ---------- */

  function filtrar(slug) {
    const categoria = CATEGORIAS[slug];
    if (!categoria) return [...PREDIOS]; // "todos"
    return PREDIOS.filter((p) => p.categoria === categoria);
  }

  /* ---------- RENDER ---------- */

  // OS LABELS VÊM DOS DADOS, NÃO SÃO FIXOS: O PRÉDIO COMERCIAL USA "Salas" E
  // "Circulação diária" ONDE OS RESIDENCIAIS USAM "Apartamentos" E "Moradores".
  // Object.values PRESERVA A ORDEM DE DECLARAÇÃO, QUE É A MESMA DA HOME.
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

    // CATEGORIA SEM LOCAIS (HOTÉIS/RESTAURANTES/EVENTOS): O CARROSSEL INTEIRO SAI E
    // A MENSAGEM ENTRA. NADA DE CONTADOR "00 / 00" NEM SETAS ÓRFÃS.
    if (!item) {
      carousel.classList.add('is-hidden');
      empty.classList.remove('is-hidden');
      return;
    }

    carousel.classList.remove('is-hidden');
    empty.classList.add('is-hidden');

    counter.textContent = `${pad(index + 1)} / ${pad(itens.length)}`;
    title.textContent = item.nome;
    tag.textContent = item.categoria;
    desc.textContent = item.descricao;
    photo.src = item.foto;
    photo.alt = item.nome;
    renderMetrics(item.metricas);

    // COM UM ITEM SÓ NÃO HÁ NAVEGAÇÃO POSSÍVEL (HOJE: "COMERCIAL").
    nav.classList.toggle('is-disabled', itens.length < 2);

    if (animate) revealSlide(textEl, photo);
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  /* ---------- NAVEGAÇÃO ---------- */

  function goTo(i) {
    if (itens.length < 2) return;
    // CICLA NAS DUAS PONTAS: AS SETAS NUNCA VIRAM BOTÃO MORTO NO MEIO DA LISTA.
    index = (i + itens.length) % itens.length;
    render(true);
  }

  /* ---------- FILTRO ---------- */

  // shimmer = false NA ABERTURA NEUTRA PELO MENU PRINCIPAL: "TODOS" JÁ NASCE ATIVO,
  // MAS SEM BRILHO ATÉ O USUÁRIO CLICAR EM ALGO. VINDO DA SEÇÃO PRÉDIOS OU DE UM
  // CLIQUE AQUI DENTRO, A ESCOLHA FOI EXPLÍCITA E O BRILHO ACOMPANHA.
  //
  // item = NOME DO LOCAL A SELECIONAR DENTRO DA CATEGORIA ("SABER MAIS" DA SEÇÃO
  // PRÉDIOS ABRE NO PRÉDIO CLICADO, NÃO NO PRIMEIRO DA LISTA). SEM ELE, ITEM 1.
  function aplicarFiltro(slug, { shimmer = true, animate = true, item } = {}) {
    filtro = slug;
    itens = filtrar(slug);
    // NOME NÃO ENCONTRADO CAI NO ITEM 1 EM VEZ DE DEIXAR O CARROSSEL EM -1.
    const alvo = item ? itens.findIndex((p) => p.nome === item) : -1;
    index = alvo > -1 ? alvo : 0;

    const ativo = [...pills].find((p) => p.dataset.anuncieFilter === slug);
    pills.forEach((p) => p.classList.toggle('is-active', p === ativo));

    if (shimmer) playShimmer(glows, ativo?.querySelector('.clv-anuncie-menu__glow'));
    else hideShimmer(glows);

    render(animate);
  }

  /* ---------- SINALIZAÇÃO DE SCROLL DO MENU ---------- */

  // O FADE APARECE SÓ NO LADO QUE AINDA TEM PÍLULA ESCONDIDA. A TOLERÂNCIA DE 1px
  // NÃO É FRESCURA: scrollLeft É FRACIONÁRIO EM TELA COM DPR > 1 E NUNCA CHEGA
  // EXATAMENTE NO MÁXIMO, ENTÃO O FADE DA DIREITA NUNCA SUMIRIA NO FIM DA ROLAGEM.
  function updateFade() {
    const max = menu.scrollWidth - menu.clientWidth;
    const rolavel = max > 1;
    // UM CÁLCULO SÓ ALIMENTA OS DOIS SINAIS: O FADE DA DIREITA E A SETA DIZEM A
    // MESMA COISA ("TEM MAIS PRA LÁ"), ENTÃO NÃO PODEM TER FONTES SEPARADAS —
    // DIVERGIRIAM NA PRIMEIRA MUDANÇA.
    const temMaisADireita = rolavel && menu.scrollLeft < max - 1;
    menu.classList.toggle('is-fade-start', rolavel && menu.scrollLeft > 1);
    menu.classList.toggle('is-fade-end', temMaisADireita);
    toggleHint(hint, temMaisADireita);
  }

  menu.addEventListener('scroll', updateFade, { passive: true });
  window.addEventListener('resize', updateFade);

  /* ---------- RESET ---------- */

  function reset(category, item) {
    // O MENU GUARDA O scrollLeft DA ÚLTIMA ABERTURA. SEM ZERAR, REABRIR PELO MENU
    // PRINCIPAL DEVOLVIA "TODOS" ATIVO MAS COM O "HOME" CORTADO PELA METADE — E A
    // REGRA É QUE REABRIR PAREÇA UMA ABERTURA NOVA. ZERANDO AQUI, O TWEEN DE
    // revelarPilulaAtiva TAMBÉM PARTE SEMPRE DO MESMO LUGAR.
    menu.scrollLeft = 0;

    // A CATEGORIA SÓ VALE SE EXISTIR NO MAPA: data-category DESCONHECIDO CAI NO
    // PADRÃO EM VEZ DE ESVAZIAR A LISTA SEM MOTIVO.
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

      // "HOME" NÃO FILTRA: FECHA O OVERLAY E VOLTA PRO TOPO. O FECHAMENTO VEM DO
      // menu.js — É ELE QUE DEVOLVE A TRAVA DE SCROLL E AVISA O RESTO DA PÁGINA.
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

  // O RESET NA ABERTURA (E NÃO NO FECHAMENTO) É O QUE GARANTE O ESTADO LIMPO MESMO
  // SE O OVERLAY FOR FECHADO PELO ESC OU PELO X, QUE NÃO PASSAM POR AQUI.
  document.addEventListener('clv:overlay-open', (e) => {
    if (e.detail.id !== 'anuncie') return;
    reset(e.detail.category, e.detail.item);
    // SÓ NA ABERTURA O MENU TEM LARGURA REAL PRA COMPARAR COM scrollWidth.
    updateFade();
    // SÓ NA ABERTURA: NUM CLIQUE AQUI DENTRO A PÍLULA ESTÁ VISÍVEL POR DEFINIÇÃO —
    // O DEDO ACABOU DE ACERTAR NELA.
    revelarPilulaAtiva(menu, overlay.querySelector('.clv-anuncie-menu__pill.is-active'));
  });

  document.addEventListener('clv:overlay-close', (e) => {
    if (e.detail.id !== 'anuncie') return;
    // O menu ENTRA NA LISTA POR CAUSA DO TWEEN DE scrollLeft: FECHAR NO MEIO DELE
    // DEIXARIA O MENU ROLANDO SOZINHO ENQUANTO O OVERLAY SOME.
    destroyAnuncie(glows, hint, [textEl, photo, menu]);
  });

  // ESTADO INICIAL — OVERLAY FECHADO, SEM BRILHO E SEM ANIMAÇÃO.
  aplicarFiltro(FILTRO_PADRAO, { shimmer: false, animate: false });
  updateFade();
}

/* ============================================
   HOME — VOLTA AO TOPO
   ============================================ */

function scrollToTopo() {
  const lenis = getLenis(); // null EM prefers-reduced-motion
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.2 });
    return;
  }
  window.scrollTo({ top: 0, behavior: 'auto' });
}
