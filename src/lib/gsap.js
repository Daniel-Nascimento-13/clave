// ============================================
// GSAP — REGISTRO DE PLUGINS
// ============================================
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// iOS Safari mostra/esconde a barra de endereço de forma assimétrica com a
// direção do scroll (colapsa descendo, expande subindo), disparando um resize
// a cada toggle. Sem isto o ScrollTrigger dá refresh() no meio do gesto e o pin
// da .produto entra cortado ao voltar (Prédios -> Produto). ignoreMobileResize
// faz o ScrollTrigger ignorar esses resizes só-de-altura em touch (no-op no
// desktop), mantendo start/end do pin estáveis nas duas direções.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };