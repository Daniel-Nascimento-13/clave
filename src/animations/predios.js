/* ============================================
   SEÇÃO 6 — PRÉDIOS E CONDOMÍNIOS — CARROSSEL
   ============================================ */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PREDIOS, slugDaCategoria } from "../data/predios.js";
import { animateRouletteTitle } from "../lib/roulette-title.js";
import { openOverlay } from "../components/menu/menu.js";

gsap.registerPlugin(ScrollTrigger);

/* ------------ CONSTANTES ------------ */

const EASE            = "power3.out";
const DURATION        = 0.9;
const NOME_DURATION   = 0.8;
const NOME_EASE       = "expo.out";

/* ------------ INIT ------------ */

export function initPredios() {
  const section  = document.querySelector("[data-predios]");
  if (!section) return;

  const stage    = section.querySelector("[data-predios-stage]");
  const btnPrev  = section.querySelector("[data-predios-prev]");
  const btnNext  = section.querySelector("[data-predios-next]");
  const elCurrent = section.querySelector(".predios__counter-current");
  const elTotal   = section.querySelector(".predios__counter-total");
  const heading   = section.querySelector(".predios__heading");

  if (!stage || PREDIOS.length === 0) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let activeIdx = 0;
  let animating = false;

  /* ------------ TOTAL ------------ */

  elTotal.textContent = String(PREDIOS.length).padStart(2, "0");

  /* ------------ RENDER INICIAL ------------ */

  renderCarousel();
  updateCounter();

  /* ------------ SCROLL TRIGGER DO HEADING ------------ */

  // O CSS DEIXA O HEADING EM opacity:0. QUEM DEVOLVE A VISIBILIDADE É AQUI — E
  // TAMBÉM NO BRANCH DE reduced-motion, PORQUE animateRouletteTitle DÁ return
  // ANTES DE TOCAR NO ELEMENTO E O TÍTULO FICARIA INVISÍVEL PARA SEMPRE.
  if (heading) {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      gsap.set(heading, { opacity: 1 });
    } else {
      ScrollTrigger.create({
        trigger: heading,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.set(heading, { opacity: 1 });
          animateRouletteTitle(heading);
        },
      });
    }
  }

  /* ------------ NAVEGAÇÃO ------------ */

  btnPrev?.addEventListener("click", () => goTo(activeIdx - 1));
  btnNext?.addEventListener("click", () => goTo(activeIdx + 1));

  /* DELEGAÇÃO — O .predios__card-cta É RECRIADO A CADA goTo(),
     ENTÃO O bindMenuLinks() DO MENU NÃO COBRE ELE.
     INTERCEPTAMOS O CLIQUE NA SECTION E ABRIMOS O OVERLAY DIRETAMENTE. */
  section.addEventListener("click", (e) => {
    const link = e.target.closest("[data-menu-link]");
    if (!link) return;
    const target   = link.dataset.target;
    const category = link.dataset.category ?? "";
    const item     = link.dataset.item ?? "";
    if (target) openOverlay(target, { category, item });
  });

  /* ------------ CLICK NOS CARDS LATERAIS ------------ */

  stage.addEventListener("click", (e) => {
    const card = e.target.closest(".predios__card");
    if (!card || card.classList.contains("predios__card--center")) return;
    const idx = parseInt(card.dataset.idx, 10);
    if (!isNaN(idx)) goTo(idx);
  });

  /* ------------ FUNÇÕES ------------ */

  function getVisibleIndices(centerIdx) {
    const total = PREDIOS.length;
    return {
      left:   (centerIdx - 1 + total) % total,
      center: centerIdx,
      right:  (centerIdx + 1) % total,
    };
  }

  function renderCarousel() {
    stage.innerHTML = "";
    const { left, center, right } = getVisibleIndices(activeIdx);

    stage.appendChild(buildCard(left,   "side-left"));
    stage.appendChild(buildCard(center, "center"));
    stage.appendChild(buildCard(right,  "side-right"));
  }

  function buildCard(idx, role) {
    const predio = PREDIOS[idx];
    const isCenter = role === "center";

    const card = document.createElement("div");
    card.className = `predios__card predios__card--side predios__card--${role}`;
    if (isCenter) card.classList.remove("predios__card--side");
    card.dataset.idx = idx;

    const img = document.createElement("img");
    img.className = "predios__card-img";
    img.src = predio.foto;
    img.alt = predio.nome.trim();
    img.loading = "eager";

    const scrim = document.createElement("div");
    scrim.className = "predios__card-scrim";

    card.appendChild(img);
    card.appendChild(scrim);

    if (isCenter) {
      const info = document.createElement("div");
      info.className = "predios__card-info";

      const nome = document.createElement("p");
      nome.className = "predios__card-nome";
      nome.textContent = predio.nome.trim();

      const cta = document.createElement("button");
      cta.className = "predios__card-cta";
      cta.textContent = "Saber mais";
      cta.dataset.menuLink = "";
      cta.dataset.action = "overlay";
      cta.dataset.target = "anuncie";
      // O OVERLAY "ANUNCIE" VALIDA data-category CONTRA AS CHAVES DE CATEGORIAS,
      // QUE SÃO SLUGS. MANDAR A LABEL CRUA ("Hotéis") CAI NO FILTRO PADRÃO.
      cta.dataset.category = slugDaCategoria(predio.categoria) ?? "todos";
      cta.dataset.item = predio.nome.trim();

      info.appendChild(nome);
      info.appendChild(cta);
      card.appendChild(info);

      /* REVEAL DO NOME */
      if (reduce) {
        gsap.set(nome, { clipPath: "inset(0 0 0% 0)" });
      } else {
        requestAnimationFrame(() => {
          gsap.fromTo(nome,
            { clipPath: "inset(0 0 100% 0)", y: 12, autoAlpha: 0 },
            { clipPath: "inset(0 0 0% 0)",   y: 0,  autoAlpha: 1,
              duration: NOME_DURATION, ease: NOME_EASE, delay: 0.15 }
          );
        });
      }
    }

    return card;
  }

  function goTo(newIdx) {
    if (animating) return;
    const total = PREDIOS.length;
    newIdx = ((newIdx % total) + total) % total;
    if (newIdx === activeIdx) return;

    if (reduce) {
      activeIdx = newIdx;
      renderCarousel();
      updateCounter();
      return;
    }

    animating = true;

    const direction = getDirection(activeIdx, newIdx);
    const cards     = stage.querySelectorAll(".predios__card");

    gsap.to(cards, {
      autoAlpha: 0,
      x: direction === 1 ? -40 : 40,
      duration: DURATION * 0.45,
      ease: "power2.in",
      onComplete: () => {
        activeIdx = newIdx;
        renderCarousel();
        updateCounter();

        const newCards = stage.querySelectorAll(".predios__card");
        gsap.fromTo(newCards,
          { autoAlpha: 0, x: direction === 1 ? 40 : -40 },
          {
            autoAlpha: 1, x: 0,
            duration: DURATION * 0.6,
            ease: EASE,
            stagger: 0.05,
            onComplete: () => { animating = false; }
          }
        );
      }
    });
  }

  function getDirection(from, to) {
    const total = PREDIOS.length;
    const fwd = ((to - from) + total) % total;
    return fwd <= total / 2 ? 1 : -1;
  }

  function updateCounter() {
    if (!elCurrent) return;
    // O TEXTO TROCA ANTES DO TWEEN: SE FIZESSE O CONTRÁRIO, O FADE-IN RODARIA
    // SOBRE O NÚMERO ANTIGO E O NOVO APARECERIA DE ESTALO NO FIM.
    elCurrent.textContent = String(activeIdx + 1).padStart(2, "0");
    if (reduce) return;
    gsap.fromTo(elCurrent,
      { autoAlpha: 0, y: -8 },
      { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE }
    );
  }
}
