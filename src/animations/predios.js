/* ============================================
   SEÇÃO 6 — PRÉDIOS E CONDOMÍNIOS — CARROSSEL
   ============================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PREDIOS } from "../data/predios.js";
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
  const filterBtns = section.querySelectorAll(".predios__filter");

  let filtered = PREDIOS;
  let index = 0;

  function renderProgress() {
    progressEl.innerHTML = "";
    filtered.forEach((_, i) => {
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
    const item = filtered[index];
    if (!item) return;

    photo.src = item.foto;
    photo.alt = item.nome;
    badgeNome.textContent = item.nome;
    counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(filtered.length).padStart(2, "0")}`;
    desc.textContent = item.descricao;

    renderMetrics(item.metricas);
    renderProgress();

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === filtered.length - 1;
  }

  function goTo(i) {
    if (i < 0 || i >= filtered.length || i === index) return;
    index = i;
    gsap.fromTo(
      card,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", onStart: render }
    );
  }

  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = btn.dataset.filter;
      filtered = filter === "todos" ? PREDIOS : PREDIOS.filter((p) => p.categoria === filter);
      index = 0;
      render();
    });
  });

  render();

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