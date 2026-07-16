/* ============================================
   OVERLAY — ANUNCIE — ANIMAÇÕES
   ============================================ */
import { gsap } from "../lib/gsap.js";

/* O ESTADO/FILTRO VIVE EM components/anuncie/anuncie.js. AQUI FICA SÓ O MOVIMENTO,
   E TUDO QUE É CRIADO AQUI TEM QUE MORRER EM destroyAnuncie() — O OVERLAY ABRE E
   FECHA VÁRIAS VEZES NA MESMA SESSÃO E OS TWEENS INFINITOS SE ACUMULARIAM. */

const REVEAL_DURATION = 0.8;
const EASE = "power3.out";

/* ---------- SHIMMER — FAIXA DE LUZ DESLIZANTE ---------- */

// UM TWEEN INFINITO POR VEZ, GUARDADO PRA PODER SER MORTO. O PROJETO SÓ ADMITE O
// @keyframes clv-speen QUE JÁ EXISTIA, ENTÃO O DESLOCAMENTO DA FAIXA É FEITO AQUI
// EM GSAP (power1.inOut, O EASE PERMITIDO PARA LOOP CONTÍNUO).
let shimmerTween = null;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function hideShimmer(glows) {
  shimmerTween?.kill();
  shimmerTween = null;
  gsap.set(glows, { autoAlpha: 0 });
}

export function playShimmer(glows, target) {
  hideShimmer(glows);
  if (!target) return;

  gsap.set(target, { autoAlpha: 1 });

  if (prefersReducedMotion()) {
    // SEM LOOP: A FAIXA FICA PARADA NO MEIO DO BOTÃO, MARCANDO O ATIVO.
    gsap.set(target, { backgroundPosition: "0px 0" });
    return;
  }

  shimmerTween = gsap.fromTo(
    target,
    { backgroundPosition: "-60px 0" },
    {
      backgroundPosition: "60px 0",
      duration: 1.4,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    }
  );
}

/* ---------- INDICADOR DE SCROLL (SETA) ---------- */

// MESMO PADRÃO DO SHIMMER: TWEEN INFINITO EM GSAP, SEM @keyframes CSS NOVO.
let hintTween = null;

export function toggleHint(hint, mostrar) {
  if (!hint) return;

  if (!mostrar) {
    hintTween?.kill();
    hintTween = null;
    gsap.set(hint, { visibility: 'hidden', opacity: 0, x: 0 });
    return;
  }

  // O GUARD É O QUE IMPEDE O LOOP DE REINICIAR A CADA EVENTO DE scroll: SEM ELE A
  // SETA "TRAVA" NO PRIMEIRO FRAME ENQUANTO O DEDO ARRASTA, QUE É JUSTO A HORA EM
  // QUE ELA PRECISA ESTAR ANIMANDO.
  if (hintTween) return;

  gsap.set(hint, { visibility: 'visible' });

  if (prefersReducedMotion()) {
    gsap.set(hint, { opacity: 1, x: 0 });
    return;
  }

  // O VAI-E-VOLTA É DE -4 A 0, NÃO DE 0 A 4: ASSIM A BORDA DIREITA DO MENU É O
  // LIMITE DO MOVIMENTO, E NÃO O PONTO DE PARTIDA — A SETA NUNCA ULTRAPASSA O
  // ALINHAMENTO. O SENTIDO CONTINUA CERTO (ANDA PRA DIREITA ENQUANTO ACENDE).
  hintTween = gsap.fromTo(
    hint,
    { x: -4, opacity: 0.35 },
    { x: 0, opacity: 1, duration: 1.4, ease: 'power1.inOut', repeat: -1, yoyo: true }
  );
}

/* ---------- REVELAR A PÍLULA ATIVA (MOBILE) ---------- */

/* ABRIR O OVERLAY JÁ FILTRADO PELA SEÇÃO PRÉDIOS PODE DEIXAR A PÍLULA ATIVA FORA DA
   ÁREA VISÍVEL DO MENU EM TELA ESTREITA ("EVENTOS" É O ÚLTIMO DOS 7): O BRILHO
   ESTARIA ACESO ONDE NINGUÉM VÊ. AQUI O MENU ROLA ATÉ ELA.

   NÃO USEI scrollIntoView: ELE ROLA O ANCESTRAL MAIS PRÓXIMO TAMBÉM, E O PAINEL DO
   OVERLAY (data-lenis-prevent, overflow-y: auto) LEVARIA UM PULO VERTICAL NO MEIO
   DA ABERTURA. O TWEEN MEXE SÓ NO scrollLeft DO MENU, COM O EASE E A DURAÇÃO DO
   RESTO DO PROJETO. */
export function revelarPilulaAtiva(menu, pill) {
  if (!pill) return;

  // SEM RANGE DE SCROLL NÃO HÁ O QUE REVELAR — É O QUE DESLIGA ISTO NO DESKTOP,
  // ONDE OS 7 ITENS CABEM. A CONDIÇÃO REAL É "CABE OU NÃO", NÃO A LARGURA DA TELA.
  const max = menu.scrollWidth - menu.clientWidth;
  if (max <= 1) return;

  // getBoundingClientRect EM VEZ DE offsetLeft: O MENU NÃO É position: relative,
  // ENTÃO offsetParent SERIA O OVERLAY E offsetLeft NÃO DIRIA NADA SOBRE A POSIÇÃO
  // DENTRO DA ÁREA ROLÁVEL.
  const areaMenu = menu.getBoundingClientRect();
  const areaPill = pill.getBoundingClientRect();

  // JÁ TOTALMENTE VISÍVEL: NÃO MEXE. A TOLERÂNCIA DE 1px COBRE O SUBPIXEL.
  if (areaPill.left >= areaMenu.left - 1 && areaPill.right <= areaMenu.right + 1) return;

  // CENTRALIZA A PÍLULA NA ÁREA VISÍVEL, SEM PASSAR DAS PONTAS DO SCROLL.
  const alvo = gsap.utils.clamp(
    0,
    max,
    menu.scrollLeft + (areaPill.left - areaMenu.left) - (menu.clientWidth - areaPill.width) / 2
  );

  if (prefersReducedMotion()) {
    menu.scrollLeft = alvo;
    return;
  }

  // O FADE SE ATUALIZA SOZINHO: O TWEEN MEXE NO scrollLeft, QUE DISPARA O EVENTO
  // scroll NATIVO — E É NELE QUE updateFade() ESTÁ PENDURADO (VER anuncie.js).
  gsap.to(menu, {
    scrollTo: { x: alvo },
    duration: 0.8,
    ease: EASE,
    overwrite: true,
  });
}

/* ---------- TROCA DE SLIDE ---------- */

// REVEAL COM clip-path + translateY + autoAlpha (NUNCA FADE PURO). A FOTO ENTRA EM
// CROSSFADE NO MESMO TEMPO: O src JÁ FOI TROCADO PELO RENDER COM A IMAGEM INVISÍVEL,
// ENTÃO O QUE SE VÊ É A NOVA APARECENDO, NÃO O SWAP.
export function revealSlide(textEl, photoEl) {
  gsap.fromTo(
    textEl,
    { clipPath: "inset(0 0 100% 0)", y: 16, autoAlpha: 0 },
    {
      clipPath: "inset(0 0 0% 0)",
      y: 0,
      autoAlpha: 1,
      duration: REVEAL_DURATION,
      ease: EASE,
      overwrite: true,
    }
  );

  gsap.fromTo(
    photoEl,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: REVEAL_DURATION, ease: EASE, overwrite: true }
  );
}

/* ---------- LIMPEZA ---------- */

// hideShimmer NÃO É REDUNDANTE COM O killTweensOf ABAIXO: MATAR O TWEEN SOZINHO
// CONGELARIA A FAIXA ACESA NO MEIO DO PERCURSO, E ELA RESSURGIRIA ASSIM NA PRÓXIMA
// ABERTURA SE O RESET FALHASSE. FECHAR APAGA.
export function destroyAnuncie(glows, hint, elements) {
  hideShimmer(glows);
  toggleHint(hint, false); // MESMO MOTIVO DO hideShimmer: FECHAR APAGA, NÃO CONGELA.
  gsap.killTweensOf(elements);
}
