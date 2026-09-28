/* ============================================
   BOOT — CLAVE
   ============================================ */

/* ---------- IMPORTS ---------- */

import "./styles/main.css";
import { initSmoothScroll } from "./lib/smooth-scroll.js";
import { initReveal } from "./animations/reveal.js";
import { initHero } from "./animations/hero.js";
import { initMarcas } from "./animations/marcas.js";
import { initMap } from "./lib/map.js";
import { initLocaisCarousel } from "./lib/locais-carousel.js";
import { getWhatsappLink } from "./lib/whatsapp.js";
import { initContato } from "./lib/contato.js";
import { initMenu } from "./components/menu/menu.js";

/* ============================================
   INICIALIZAÇÃO GLOBAL
   ============================================ */

initSmoothScroll();
initHero();
initReveal();
initMarcas();
initMap();
initLocaisCarousel();

document.querySelectorAll("[data-whatsapp-cta]").forEach((el) => {
  el.href = getWhatsappLink();
});

initContato();

initMenu();
