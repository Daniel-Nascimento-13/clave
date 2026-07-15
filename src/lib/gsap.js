/* ============================================
   GSAP — REGISTRO DE PLUGINS
   ============================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// iOS SAFARI MOSTRA/ESCONDE A BARRA DE ENDEREÇO DE FORMA ASSIMÉTRICA COM A
// DIREÇÃO DO SCROLL (COLAPSA DESCENDO, EXPANDE SUBINDO), DISPARANDO UM resize
// A CADA TOGGLE. SEM ISTO O ScrollTrigger DÁ refresh() NO MEIO DO GESTO E O PIN
// DA .produto ENTRA CORTADO AO VOLTAR (PRÉDIOS -> PRODUTO). ignoreMobileResize
// FAZ O ScrollTrigger IGNORAR ESSES resizes SÓ-DE-ALTURA EM TOUCH (no-op NO
// DESKTOP), MANTENDO start/end DO PIN ESTÁVEIS NAS DUAS DIREÇÕES.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };