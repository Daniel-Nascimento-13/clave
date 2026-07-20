/* ============================================
   BOOT — CLAVE
   ============================================ */
import "./styles/main.css";
import { initSmoothScroll } from "./lib/smooth-scroll.js";
import { initHero } from "./animations/hero.js";
import { initElevador } from "./animations/elevador.js";
import { initMarcas } from "./animations/marcas.js";
import { initDiferenciais } from "./animations/diferenciais.js";
import { initProduto } from "./animations/produto.js";
import { initPredios } from "./animations/predios.js";
import { getWhatsappLink } from "./lib/whatsapp.js";
import { initMenu } from "./components/menu/menu.js";
import { initSobre } from "./components/sobre/sobre.js";
import { initAnuncie } from "./components/anuncie/anuncie.js";
import { initPlanos } from "./components/planos/planos.js";
import { initCobertura } from "./components/cobertura/cobertura.js";

/* ============================================
   INICIALIZAÇÃO GLOBAL
   ============================================ */
initSmoothScroll();
initHero();
initElevador();
initMarcas();
initDiferenciais();
initProduto();
initPredios();
document.querySelectorAll("[data-whatsapp-cta]").forEach((el) => {
  el.href = getWhatsappLink();
});
initMenu();
initSobre();
initAnuncie();
initPlanos();
initCobertura();