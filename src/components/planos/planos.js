/* ============================================ */
/* OVERLAY — PLANOS                             */
/* ============================================ */

import { getWhatsappLink } from "../../lib/whatsapp.js";

/* ------------ MENSAGENS POR PLANO ------------ */

const MSGS = {
  trimestral: "Olá! Gostaria de mais informações sobre o plano trimestral da Clave.",
  semestral:  "Olá! Gostaria de mais informações sobre o plano semestral da Clave.",
  anual:      "Olá! Gostaria de mais informações sobre o plano anual da Clave.",
};

/* ------------ INIT ------------ */

export function initPlanos() {
  const overlay = document.querySelector("#overlay-planos");
  if (!overlay) return;

  const toggleBtns = overlay.querySelectorAll("[data-planos-plan]");
  const cards      = overlay.querySelectorAll("[data-planos-card]");

  /* DEFINE OS LINKS DE WHATSAPP INICIAIS */
  updateLinks(cards);

  /* TOGGLE — TROCA O CARD DESTACADO E ATUALIZA OS LINKS */
  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const plan = btn.dataset.planosPlan;

      /* ATUALIZA TOGGLE */
      toggleBtns.forEach((b) => b.classList.remove("clv-planos__toggle-btn--active"));
      btn.classList.add("clv-planos__toggle-btn--active");

      /* ATUALIZA CARDS */
      cards.forEach((card) => {
        const isFeatured = card.dataset.planosCard === plan;
        card.classList.toggle("clv-planos__card--featured", isFeatured);
      });
    });
  });
}

/* ------------ HELPERS ------------ */

function updateLinks(cards) {
  cards.forEach((card) => {
    const plan = card.dataset.planosCard;
    const cta  = card.querySelector("[data-planos-cta]");
    if (cta && MSGS[plan]) {
      cta.href = getWhatsappLink(MSGS[plan]);
    }
  });
}
