/* ============================================
   LIB — CONTATO
   OVERLAY ÚNICO COM 2 FORMULÁRIOS → WHATSAPP
   ============================================ */

import { WHATSAPP_NUMBER } from "./whatsapp.js";

/* ---------- CONSTANTES ---------- */

const OVERLAY_ID  = "form-contato";
const DEFAULT_TAB = "anunciante";
const REQUIRED    = ["nome", "whatsapp", "cidade"];

const PLANO_LABEL = {
  trimestral: "Trimestral (3 meses)",
  semestral:  "Semestral (6 meses)",
  anual:      "Anual (12 meses)",
};

const HEADINGS = {
  anunciante: { title: "Quero anunciar", sub: "Preencha os dados e nossa equipe comercial entrará em contato." },
  espaco:     { title: "Quero ser um ponto Clave", sub: "Conte-nos sobre seu espaço. Entraremos em contato para avaliar a oportunidade." },
};

/* CAMPO → RÓTULO, NA ORDEM DA MENSAGEM. CAMPOS VAZIOS SÃO OMITIDOS. */
const MESSAGES = {
  anunciante: {
    intro:  "Olá! Tenho interesse em anunciar com a Clave.",
    fields: [["nome", "Nome"], ["empresa", "Empresa"], ["whatsapp", "WhatsApp"], ["cidade", "Cidade"],
             ["plano", "Plano"], ["segmento", "Segmento"], ["mensagem", "Mensagem"]],
  },
  espaco: {
    intro:  "Olá! Tenho interesse em ser um ponto Clave.",
    fields: [["nome", "Nome"], ["empresa", "Empresa"], ["whatsapp", "WhatsApp"], ["cidade", "Cidade"],
             ["endereco", "Endereço"], ["tipo", "Tipo de espaço"], ["interesse", "Interesse em"],
             ["descricao", "Descrição"]],
  },
};

/* ---------- SWITCHER ---------- */

function setTab(overlay, tab) {
  overlay.querySelectorAll("[data-form-tab]").forEach((b) =>
    b.classList.toggle("clv-form-overlay__switcher-btn--active", b.dataset.formTab === tab));

  overlay.querySelectorAll("[data-form-overlay]").forEach((f) =>
    f.classList.toggle("clv-form-overlay__form--active", f.dataset.formOverlay === tab));

  const h = HEADINGS[tab];
  overlay.querySelector(".clv-form-overlay__heading").textContent  = h.title;
  overlay.querySelector(".clv-form-overlay__subtitle").textContent = h.sub;
}

/* ---------- MENSAGEM ---------- */

function valueOf(form, name) {
  if (name === "interesse") {
    return [...form.querySelectorAll(`[name="interesse"]:checked`)]
      .map((cb) => cb.value)
      .join(", ");
  }

  const v = (form.elements[name]?.value ?? "").trim();
  return name === "plano" ? (PLANO_LABEL[v] ?? v) : v;
}

function buildMessage(type, form) {
  const { intro, fields } = MESSAGES[type];

  const linhas = fields
    .map(([name, label]) => [label, valueOf(form, name)])
    .filter(([, v]) => v)
    .map(([label, v]) => `*${label}:* ${v}`);

  return [intro, "", ...linhas].join("\n");
}

/* ---------- INIT ---------- */

export function initContato() {
  const overlay = document.getElementById(`overlay-${OVERLAY_ID}`);
  if (!overlay) return;

  /* ABERTURA — ABA E PLANO VÊM DO GATILHO, VIA menu.js */
  document.addEventListener("clv:overlay-open", (e) => {
    if (e.detail.id !== OVERLAY_ID) return;

    setTab(overlay, e.detail.form || DEFAULT_TAB);

    if (e.detail.plano) {
      const select = overlay.querySelector("#an-plano");
      if (select) select.value = e.detail.plano;
    }
  });

  overlay.querySelectorAll("[data-form-tab]").forEach((btn) =>
    btn.addEventListener("click", () => setTab(overlay, btn.dataset.formTab)));

  overlay.querySelectorAll("[data-whatsapp-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (REQUIRED.some((n) => !valueOf(form, n))) {
        alert("Preencha os campos obrigatórios: Nome, WhatsApp e Cidade.");
        return;
      }

      const text = buildMessage(form.dataset.whatsappForm, form);
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
    });
  });
}
