/* ============================================
   LIB — CONTATO
   PRÉ-SELEÇÃO DE PLANO E SUBMIT VIA WHATSAPP
   ============================================ */

/* ---------- IMPORTS ---------- */

import { WHATSAPP_NUMBER } from "./whatsapp.js";

/* ---------- CONSTANTES ---------- */

const PLANO_LABEL = {
  trimestral: "Trimestral (3 meses)",
  semestral:  "Semestral (6 meses)",
  anual:      "Anual (12 meses)",
};

/* ---------- INIT ---------- */

export function initContato() {

  /* ---------- PRÉ-SELECIONA PLANO QUANDO VEM DA SEÇÃO PLANOS ---------- */
  /* O SCROLL + ABERTURA DO OVERLAY JÁ SÃO FEITOS PELO menu.js.
     AQUI APENAS AGUARDA O OVERLAY ABRIR E SETA O SELECT. */

  document.addEventListener("clv:overlay-open", (e) => {
    if (e.detail.id !== "form-anunciante") return;

    const plano = e.detail.plano;
    if (!plano) return;

    const select = document.getElementById("an-plano");
    if (select) select.value = plano;
  });

  /* ---------- PASSA O PLANO COMO PARÂMETRO AO ABRIR O OVERLAY ---------- */
  /* OS BOTÕES DE PLANO TÊM data-contato-plano — CAPTURA ANTES DO menu.js
     PROCESSAR O CLIQUE E INJETA NO EVENTO */

  document.querySelectorAll("[data-contato-plano]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const plano = btn.dataset.contatoPlano;

      /* PEQUENO DELAY PARA O openOverlay DO menu.js DISPARAR PRIMEIRO */
      requestAnimationFrame(() => {
        const select = document.getElementById("an-plano");
        if (select && plano) select.value = plano;
      });
    });
  });

  /* ---------- SWITCHER ENTRE FORMULÁRIOS ---------- */
  /* TROCA O FORM VISÍVEL DENTRO DO OVERLAY SEM FECHAR/ABRIR */

  document.querySelectorAll("[data-form-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.formTab;

      /* ATUALIZA BOTÕES DO SWITCHER NO OVERLAY ATUAL */
      const overlay = btn.closest(".clv-overlay");
      overlay.querySelectorAll("[data-form-tab]").forEach((b) => {
        b.classList.toggle("clv-form-overlay__switcher-btn--active", b.dataset.formTab === tab);
      });

      /* EXIBE O FORM CORRETO DENTRO DO OVERLAY ATUAL */
      overlay.querySelectorAll("[data-form-overlay]").forEach((form) => {
        form.classList.toggle("clv-form-overlay__form--active", form.dataset.formOverlay === tab);
      });

      /* ATUALIZA HEADING */
      const headings = {
        anunciante: { title: "Quero anunciar", sub: "Preencha os dados e nossa equipe comercial entrará em contato." },
        espaco:     { title: "Quero ser um ponto Clave", sub: "Conte-nos sobre seu espaço. Entraremos em contato para avaliar a oportunidade." },
      };
      const h = headings[tab];
      if (h) {
        overlay.querySelector(".clv-form-overlay__heading").textContent = h.title;
        overlay.querySelector(".clv-form-overlay__subtitle").textContent = h.sub;
      }
    });
  });

  /* ---------- SUBMIT — ESPAÇO ALT (overlay anunciante) ---------- */

  document.getElementById("formEspacoAlt")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const nome      = f.querySelector("[name='nome']").value.trim();
    const empresa   = f.querySelector("[name='empresa']").value.trim();
    const whatsapp  = f.querySelector("[name='whatsapp']").value.trim();
    const cidade    = f.querySelector("[name='cidade']").value.trim();
    const endereco  = f.querySelector("[name='endereco']").value.trim();
    const tipo      = f.querySelector("[name='tipo']").value.trim();
    const descricao = f.querySelector("[name='descricao']").value.trim();
    const interesses = [...f.querySelectorAll("[name='interesse']:checked")].map((cb) => cb.value);
    if (!nome || !whatsapp || !cidade) { alert("Preencha os campos obrigatórios: Nome, WhatsApp e Cidade."); return; }
    const linhas = [
      "Olá! Tenho interesse em ser um ponto Clave.", "",
      `*Nome:* ${nome}`,
      empresa   ? `*Empresa:* ${empresa}`   : null,
      `*WhatsApp:* ${whatsapp}`,
      `*Cidade:* ${cidade}`,
      endereco  ? `*Endereço:* ${endereco}` : null,
      tipo      ? `*Tipo de espaço:* ${tipo}` : null,
      interesses.length ? `*Interesse em:* ${interesses.join(", ")}` : null,
      descricao ? `*Descrição:* ${descricao}` : null,
    ].filter(Boolean);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(linhas.join("\n"))}`, "_blank");
  });

  /* ---------- SUBMIT — ANUNCIANTE ALT (overlay espaço) ---------- */

  document.getElementById("formAnuncianteAlt")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const nome     = f.querySelector("[name='nome']").value.trim();
    const empresa  = f.querySelector("[name='empresa']").value.trim();
    const whatsapp = f.querySelector("[name='whatsapp']").value.trim();
    const cidade   = f.querySelector("[name='cidade']").value.trim();
    const plano    = f.querySelector("[name='plano']").value;
    const segmento = f.querySelector("[name='segmento']").value.trim();
    const mensagem = f.querySelector("[name='mensagem']").value.trim();
    if (!nome || !whatsapp || !cidade) { alert("Preencha os campos obrigatórios: Nome, WhatsApp e Cidade."); return; }
    const linhas = [
      "Olá! Tenho interesse em anunciar com a Clave.", "",
      `*Nome:* ${nome}`,
      empresa  ? `*Empresa:* ${empresa}`                   : null,
      `*WhatsApp:* ${whatsapp}`,
      `*Cidade:* ${cidade}`,
      plano    ? `*Plano:* ${PLANO_LABEL[plano] ?? plano}` : null,
      segmento ? `*Segmento:* ${segmento}`                 : null,
      mensagem ? `*Mensagem:* ${mensagem}`                 : null,
    ].filter(Boolean);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(linhas.join("\n"))}`, "_blank");
  });

  /* ---------- SUBMIT — ANUNCIANTE ---------- */

  document.getElementById("formAnunciante")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;

    const nome     = f.querySelector("[name='nome']").value.trim();
    const empresa  = f.querySelector("[name='empresa']").value.trim();
    const whatsapp = f.querySelector("[name='whatsapp']").value.trim();
    const cidade   = f.querySelector("[name='cidade']").value.trim();
    const plano    = f.querySelector("[name='plano']").value;
    const segmento = f.querySelector("[name='segmento']").value.trim();
    const mensagem = f.querySelector("[name='mensagem']").value.trim();

    if (!nome || !whatsapp || !cidade) {
      alert("Preencha os campos obrigatórios: Nome, WhatsApp e Cidade.");
      return;
    }

    const linhas = [
      "Olá! Tenho interesse em anunciar com a Clave.",
      "",
      `*Nome:* ${nome}`,
      empresa  ? `*Empresa:* ${empresa}`                   : null,
      `*WhatsApp:* ${whatsapp}`,
      `*Cidade:* ${cidade}`,
      plano    ? `*Plano:* ${PLANO_LABEL[plano] ?? plano}` : null,
      segmento ? `*Segmento:* ${segmento}`                 : null,
      mensagem ? `*Mensagem:* ${mensagem}`                 : null,
    ].filter(Boolean);

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(linhas.join("\n"))}`,
      "_blank"
    );
  });

  /* ---------- SUBMIT — ESPAÇO ---------- */

  document.getElementById("formEspaco")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;

    const nome      = f.querySelector("[name='nome']").value.trim();
    const empresa   = f.querySelector("[name='empresa']").value.trim();
    const whatsapp  = f.querySelector("[name='whatsapp']").value.trim();
    const cidade    = f.querySelector("[name='cidade']").value.trim();
    const endereco  = f.querySelector("[name='endereco']").value.trim();
    const tipo      = f.querySelector("[name='tipo']").value.trim();
    const descricao = f.querySelector("[name='descricao']").value.trim();
    const interesses = [...f.querySelectorAll("[name='interesse']:checked")]
      .map((cb) => cb.value);

    if (!nome || !whatsapp || !cidade) {
      alert("Preencha os campos obrigatórios: Nome, WhatsApp e Cidade.");
      return;
    }

    const linhas = [
      "Olá! Tenho interesse em ser um ponto Clave.",
      "",
      `*Nome:* ${nome}`,
      empresa   ? `*Empresa:* ${empresa}`                          : null,
      `*WhatsApp:* ${whatsapp}`,
      `*Cidade:* ${cidade}`,
      endereco  ? `*Endereço:* ${endereco}`                        : null,
      tipo      ? `*Tipo de espaço:* ${tipo}`                      : null,
      interesses.length ? `*Interesse em:* ${interesses.join(", ")}` : null,
      descricao ? `*Descrição:* ${descricao}`                      : null,
    ].filter(Boolean);

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(linhas.join("\n"))}`,
      "_blank"
    );
  });
}
