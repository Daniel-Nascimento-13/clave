/* ============================================ */
/* OVERLAY — COBERTURA AMPLA                    */
/* ============================================ */

import { PREDIOS } from "../../data/predios.js";
import { getWhatsappLink } from "../../lib/whatsapp.js";

/* ------------ INIT ------------ */

export function initCobertura() {
  const overlay = document.querySelector("#overlay-cobertura");
  if (!overlay) return;

  const grid    = overlay.querySelector("[data-cobertura-grid]");
  const counter = overlay.querySelector("[data-cobertura-counter]");
  const cta     = overlay.querySelector("[data-cobertura-cta]");
  const inpNome = overlay.querySelector("[data-cobertura-nome]");
  const inpEmp  = overlay.querySelector("[data-cobertura-empresa]");

  const sync = () => update(grid, counter, cta, inpNome, inpEmp);

  /* RENDERIZA OS CARDS A PARTIR DE PREDIOS. O TOGGLE AVISA AQUI EM VEZ DE
     REDESCOBRIR OS ELEMENTOS NO CLIQUE: OS REFS JÁ ESTÃO NESTE ESCOPO. */
  renderGrid(grid, sync);

  /* LISTENERS DOS INPUTS */
  inpNome.addEventListener("input", sync);
  inpEmp.addEventListener("input", sync);

  /* RESET NA ABERTURA — MESMO MOTIVO DO "ANUNCIE" (VER anuncie.js): É O ÚNICO
     PONTO QUE PEGA TAMBÉM O FECHAMENTO POR ESC E PELO X, E NÃO LIMPA A TELA NA
     FRENTE DO USUÁRIO ENQUANTO O PAINEL AINDA ESTÁ SUMINDO.
     O EVENTO VEM DE document, NÃO DO OVERLAY: menu.js DISPARA NO DOCUMENTO E
     IDENTIFICA O ALVO POR detail.id. */
  document.addEventListener("clv:overlay-open", (e) => {
    if (e.detail.id !== "cobertura") return;
    grid.querySelectorAll(".clv-cobertura__loc").forEach((el) => el.classList.remove("is-selected"));
    inpNome.value = "";
    inpEmp.value = "";
    sync();
  });

  /* ESTADO INICIAL — NENHUM LOCAL, CTA DESLIGADO. */
  sync();
}

/* ------------ RENDER ------------ */

function renderGrid(grid, onToggle) {
  grid.innerHTML = "";

  PREDIOS.forEach((predio) => {
    const loc = document.createElement("div");
    loc.className    = "clv-cobertura__loc";
    loc.dataset.nome = predio.nome.trim();
    loc.dataset.cat  = predio.categoria;

    loc.innerHTML = `
      <img
        class="clv-cobertura__loc-img"
        src="${predio.foto}"
        alt="${predio.nome.trim()}"
        loading="lazy"
      />
      <div class="clv-cobertura__loc-scrim"></div>
      <span class="clv-cobertura__loc-cat">${predio.categoria}</span>
      <div class="clv-cobertura__loc-check">
        <svg viewBox="0 0 24 24" width="10" height="10" fill="none"
             stroke="#fff" stroke-width="3" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <p class="clv-cobertura__loc-name">${predio.nome.trim()}</p>
    `;

    loc.addEventListener("click", () => {
      loc.classList.toggle("is-selected");
      onToggle();
    });

    grid.appendChild(loc);
  });
}

/* ------------ UPDATE ------------ */

function update(grid, counter, cta, inpNome, inpEmp) {
  const selected = [...grid.querySelectorAll(".clv-cobertura__loc.is-selected")];
  const count    = selected.length;
  const ready    = count >= 2;

  /* CONTADOR */
  if (count === 0) {
    counter.innerHTML = "Nenhum local selecionado";
  } else if (count === 1) {
    counter.innerHTML = `<strong>1</strong> local selecionado — selecione ao menos mais um para continuar`;
  } else {
    counter.innerHTML = `<strong>${count}</strong> locais selecionados`;
  }

  /* ESTADO DO CTA */
  cta.classList.toggle("is-ready", ready);
  cta.setAttribute("aria-disabled", String(!ready));

  if (!ready) return;

  /* MONTA A MENSAGEM */
  const nome    = inpNome.value.trim();
  const empresa = inpEmp.value.trim();
  const locais  = selected.map((el) => `• ${el.dataset.nome}`).join(";\n");

  const introNome    = nome    ? `Me chamo *${nome}*` : null;
  const introEmpresa = empresa ? `, da empresa *${empresa}*` : "";

  const intro = introNome
    ? `Olá! ${introNome}${introEmpresa}.\n\n`
    : `Olá!\n\n`;

  const msg =
    `${intro}` +
    `Gostaria de anunciar em mais de um local da Clave.\n\n` +
    `*Locais de interesse:*\n\n` +
    `${locais}.\n\n` +
    `Podem me passar mais informações sobre uma proposta?`;

  cta.href = getWhatsappLink(msg);
}
