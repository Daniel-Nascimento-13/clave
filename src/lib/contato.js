/* ============================================
   LIB — CONTATO
   OVERLAY ÚNICO COM 2 FORMULÁRIOS → WHATSAPP
   ============================================ */

import { WHATSAPP_GREETING, WHATSAPP_NUMBER } from "./whatsapp.js";

/* ---------- CONSTANTES ---------- */

const OVERLAY_ID  = "form-contato";
const DEFAULT_TAB = "anunciante";
const REQUIRED    = ["nome", "whatsapp", "cidade"];

const MIN_PHONE_DIGITS = 10; // DDD + número
const ERRORS = {
  required: "Campo obrigatório",
  whatsapp: "Informe o WhatsApp com DDD",
};

const PLANO_LABEL = {
  trimestral: "Trimestral (3 meses)",
  semestral:  "Semestral (6 meses)",
  anual:      "Anual (12 meses)",
};

const HEADINGS = {
  anunciante: { title: "Quero anunciar", sub: "Preencha os dados e nossa equipe comercial entrará em contato." },
  espaco:     { title: "Quero ser um ponto Clave", sub: "Conte-nos sobre seu espaço. Entraremos em contato para avaliar a oportunidade." },
};

/* BLOCO → [TÍTULO, [CAMPO, RÓTULO]], NA ORDEM DA MENSAGEM. CAMPOS VAZIOS SÃO
   OMITIDOS; BLOCO SEM NENHUM CAMPO PREENCHIDO SAI INTEIRO. */
const MESSAGES = {
  anunciante: {
    intro: "Gostaria de anunciar com a CLAVE.",
    blocks: [
      ["Meus dados", [["nome", "Nome"], ["empresa", "Empresa"], ["whatsapp", "WhatsApp"], ["cidade", "Cidade"]]],
      ["Sobre a campanha", [["plano", "Plano de interesse"], ["segmento", "Segmento"], ["mensagem", "Mensagem"]]],
    ],
  },
  espaco: {
    intro: "Gostaria de transformar meu espaço em um ponto CLAVE.",
    blocks: [
      ["Meus dados", [["nome", "Nome"], ["empresa", "Empresa"], ["whatsapp", "WhatsApp"], ["cidade", "Cidade"]]],
      ["Sobre o espaço", [["endereco", "Endereço"], ["tipo", "Tipo"], ["interesse", "Interesse em"], ["descricao", "Descrição"]]],
    ],
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
  const { intro, blocks } = MESSAGES[type];

  const blocos = blocks.flatMap(([title, fields]) => {
    const linhas = fields
      .map(([name, label]) => [label, valueOf(form, name)])
      .filter(([, v]) => v)
      .map(([label, v]) => `${label}: ${v}`);

    return linhas.length ? ["", `*${title}*`, ...linhas] : [];
  });

  return [WHATSAPP_GREETING, "", intro, ...blocos].join("\n");
}

/* ---------- VALIDAÇÃO ---------- */

/* UM ERRO POR CAMPO, NA ORDEM DE REQUIRED — O PRIMEIRO RECEBE O FOCO.
   WHATSAPP VAZIO É "OBRIGATÓRIO"; PREENCHIDO, PRECISA DE DDD + NÚMERO. */
function validate(form) {
  return REQUIRED.flatMap((name) => {
    const field = form.elements[name];
    const value = valueOf(form, name);

    if (!value) return [{ field, msg: ERRORS.required }];

    if (name === "whatsapp" && value.replace(/\D/g, "").length < MIN_PHONE_DIGITS) {
      return [{ field, msg: ERRORS.whatsapp }];
    }

    return [];
  });
}

/* O <p> NASCE LOGO APÓS O CAMPO E É LIGADO POR aria-describedby —
   LEITOR DE TELA ANUNCIA A MENSAGEM JUNTO COM O CAMPO */
function showError(field, msg) {
  const id = `${field.id}-erro`;
  let p = document.getElementById(id);

  if (!p) {
    p = document.createElement("p");
    p.className = "clv-contato__error";
    p.id = id;
    field.insertAdjacentElement("afterend", p);
  }

  p.textContent = msg;
  field.setAttribute("aria-invalid", "true");
  field.setAttribute("aria-describedby", id);
}

function clearError(field) {
  field.removeAttribute("aria-invalid");
  field.removeAttribute("aria-describedby");
  document.getElementById(`${field.id}-erro`)?.remove();
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
    [...form.elements].forEach((field) =>
      field.addEventListener("input", () => clearError(field)));

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      REQUIRED.forEach((name) => clearError(form.elements[name]));

      const errors = validate(form);
      if (errors.length) {
        errors.forEach(({ field, msg }) => showError(field, msg));
        errors[0].field.focus();
        return;
      }

      const text = buildMessage(form.dataset.whatsappForm, form);
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
    });
  });
}
