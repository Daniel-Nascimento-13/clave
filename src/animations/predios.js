/* ============================================
   SEÇÃO 6 — PRÉDIOS E CONDOMÍNIOS — CARROSSEL
   ============================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PREDIOS, slugDaCategoria } from "../data/predios.js";
import { animateRouletteTitle } from "../lib/roulette-title.js";

gsap.registerPlugin(ScrollTrigger);

export function initPredios() {
  const section = document.querySelector("[data-predios]");
  if (!section) return;

  const heading = section.querySelector(".predios__heading");
  const card = section.querySelector(".predios__card");
  const photo = section.querySelector(".predios__photo");
  const badgeNome = section.querySelector(".predios__nome");
  const counter = section.querySelector(".predios__counter");
  const desc = section.querySelector(".predios__desc");
  const metricsEl = section.querySelector(".predios__metrics");
  const progressEl = section.querySelector(".predios__progress");
  const prevBtn = section.querySelector(".predios__arrow--prev");
  const nextBtn = section.querySelector(".predios__arrow--next");
  const cta = section.querySelector("[data-predios-cta]");
  const todosBtn = section.querySelector('.predios__filter[data-filter="todos"]');

  let index = 0;

  function renderProgress() {
    progressEl.innerHTML = "";
    PREDIOS.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "predios__progress-dot" + (i === index ? " is-active" : "");
      dot.setAttribute("aria-label", `Ir para item ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      progressEl.appendChild(dot);
    });
  }

  function renderMetrics(metricas) {
    metricsEl.innerHTML = "";
    Object.values(metricas).forEach((m) => {
      const item = document.createElement("div");
      item.className = "predios__metric";
      item.innerHTML = `
        <div class="predios__metric-label">${m.label}</div>
        <div class="predios__metric-valor">${m.valor}</div>
      `;
      metricsEl.appendChild(item);
    });
  }

  function render() {
    const item = PREDIOS[index];
    if (!item) return;

    photo.src = item.foto;
    photo.alt = item.nome;
    badgeNome.textContent = item.nome;
    counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(PREDIOS.length).padStart(2, "0")}`;
    desc.textContent = item.descricao;

    // O "SABER MAIS" ABRE O OVERLAY "ANUNCIE" NESTE PRÉDIO. QUEM LÊ ESSES DOIS
    // data-* É O menu.js (bindMenuLinks), QUE OS REPASSA NO EVENTO DE ABERTURA —
    // POR ISSO ELES SÓ PRECISAM ESTAR ATUALIZADOS NO MOMENTO DO CLIQUE.
    cta.dataset.category = slugDaCategoria(item.categoria) ?? "todos";
    cta.dataset.item = item.nome;

    renderMetrics(item.metricas);
    renderProgress();

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === PREDIOS.length - 1;
  }

  function goTo(i) {
    if (i < 0 || i >= PREDIOS.length || i === index) return;
    index = i;
    gsap.fromTo(
      card,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", onStart: render }
    );
  }

  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));

  // O FILTRO POR CATEGORIA SAIU DAQUI: OS BOTÕES Residencial/Comercial VIRARAM O
  // DROPDOWN DE CATEGORIAS, QUE ABRE A OVERLAY "ANUNCIE" EM VEZ DE FILTRAR.
  // "TODOS" SOBROU E APENAS VOLTA O CARROSSEL AO PRIMEIRO ITEM.
  todosBtn.addEventListener("click", () => {
    index = 0;
    render();
  });

  render();

  bindCategoryMenu(section);
  bindCategoryHoverFX(section);

  /* ---------- REVEAL DO TÍTULO (ROLETA) ---------- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    gsap.set(heading, { opacity: 1 });
  } else {
    ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.set(heading, { opacity: 1 });
        animateRouletteTitle(heading);
      },
    });
  }
}

/* ============================================
   DROPDOWN DE CATEGORIAS — ABRIR / FECHAR
   ============================================ */

// REVELAÇÃO GSAP-ONLY (clip-path + opacity), IGUAL AO PAINEL DO BURGER PRINCIPAL
// EM menu.js. SEM CSS TRANSITION NO CONTAINER — AS DUAS COISAS BRIGARIAM.

function bindCategoryMenu(section) {
  const burger = section.querySelector("[data-predios-burger]");
  const menu = section.querySelector("[data-predios-cat-menu]");
  if (!burger || !menu) return;

  gsap.set(menu, { clipPath: "inset(0 0 100% 0)", autoAlpha: 0, pointerEvents: "none" });

  function open() {
    burger.setAttribute("aria-expanded", "true");
    gsap.to(menu, {
      clipPath: "inset(0 0 0% 0)",
      autoAlpha: 1,
      pointerEvents: "auto",
      duration: 0.6,
      ease: "power3.out",
      overwrite: true,
    });
  }

  function close() {
    if (burger.getAttribute("aria-expanded") !== "true") return;
    burger.setAttribute("aria-expanded", "false");
    gsap.to(menu, {
      clipPath: "inset(0 0 100% 0)",
      autoAlpha: 0,
      pointerEvents: "none",
      duration: 0.6,
      ease: "power3.out",
      overwrite: true,
    });
  }

  burger.addEventListener("click", () => {
    if (burger.getAttribute("aria-expanded") === "true") close();
    else open();
  });

  // O bindMenuLinks() DO menu.js JÁ ABRE A OVERLAY NO CLIQUE DO ITEM, MAS SÓ FECHA
  // O BURGER DO TOPO — ESTE DROPDOWN FICARIA ABERTO ATRÁS DELA.
  menu.querySelectorAll(".predios__cat-item").forEach((item) => {
    item.addEventListener("click", close);
  });

  document.addEventListener("click", (e) => {
    if (!section.contains(e.target)) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/* ============================================
   EFEITOS DE HOVER DO MENU DE CATEGORIAS
   ============================================ */

function bindCategoryHoverFX(section) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return; // SEM EFEITOS DE HOVER NESSE MODO

  section.querySelectorAll(".predios__cat-item").forEach((item) => {
    const sweep = item.querySelector(".predios__cat-sweep");
    const debris = item.querySelectorAll(".predios__cat-debris");
    let sweepTween;
    let debrisTweens = [];

    item.addEventListener("mouseenter", () => {
      gsap.to(item, {
        x: 2,
        borderColor: "rgb(110, 110, 110)",
        backgroundColor: "rgb(22, 22, 22)",
        color: "#fff",
        duration: 0.3,
        ease: "power3.out",
      });

      gsap.set(sweep, { opacity: 1 });
      sweepTween = gsap
        .timeline({ repeat: -1, yoyo: true })
        .to(sweep, { x: "140%", duration: 1.6, ease: "power1.inOut" });

      debrisTweens = Array.from(debris).map((d, i) =>
        gsap.timeline({ repeat: -1, delay: i * 0.4 }).fromTo(
          d,
          { x: -20, opacity: 0 },
          { x: 240, opacity: 0.22, duration: 5 + i * 0.8, ease: "power1.inOut" }
        )
      );
    });

    item.addEventListener("mouseleave", () => {
      gsap.to(item, {
        x: 0,
        borderColor: "rgb(35, 35, 35)",
        backgroundColor: "rgb(20, 20, 20)",
        color: "rgb(170, 170, 170)",
        duration: 0.3,
        ease: "power3.out",
      });
      gsap.to(sweep, { opacity: 0, duration: 0.3, ease: "power3.out" });
      sweepTween?.kill();
      debrisTweens.forEach((t) => t.kill());
      gsap.set(debris, { opacity: 0, x: -20 });
    });
  });
}