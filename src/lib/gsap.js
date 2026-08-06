/* ============================================
   GSAP — REGISTRO DE PLUGINS
   ============================================ */

/* ---------- IMPORTS ---------- */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* iOS SAFARI DISPARA resize A CADA TOGGLE DA BARRA DE ENDEREÇO — SEM ISTO
   O ScrollTrigger DÁ refresh() NO MEIO DO GESTO E O PIN DE .produto ENTRA
   CORTADO AO VOLTAR. ignoreMobileResize É NO-OP NO DESKTOP. */
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };