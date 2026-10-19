/* ============================================
   MAPA — REDE DE PONTOS (LEAFLET VIA NPM, SOB DEMANDA)
   ============================================ */

/* ---------- IMPORTS ---------- */

import { gsap, ScrollTrigger } from "./gsap.js";
import { DURATIONS, EASE } from "../constants/motion.js";
import { WHATSAPP_GREETING, getWhatsappLink } from "./whatsapp.js";

/* ============================================
   CONSTANTES
   ============================================ */

/* LAJEADO/RS */
const CENTRO = [-29.4678, -51.9614];
const ZOOM   = 14;

/* OPENSTREETMAP — SEM CHAVE DE API */
const TILE_URL  = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTR = `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>`;
const TILE_MAX  = 19;

/* CARREGA ~1 TELA ANTES DE O MAPA APARECER — CHEGA PRONTO, SEM FLASH */
const PRELOAD_START = "top bottom+=100%";

/* AVISO DO GESTO — QUANTO TEMPO FICA NA TELA APÓS O ÚLTIMO MOVIMENTO */
const HINT_TEXT    = "Use dois dedos para mover o mapa";
const HINT_HIDE_MS = 1500;

/* ---------- PONTOS ---------- */

/* COORDENADAS COPIADAS DO GOOGLE MAPS — UM PINO POR LOCAL */
const PONTOS = [
  { lat: -29.445946, lng: -51.962542, nome: "Le Blanc",                   tipo: "Residencial" },
  { lat: -29.443924, lng: -51.966352, nome: "Ed. Manhattan",              tipo: "Residencial" },
  { lat: -29.436647, lng: -51.963981, nome: "Ed. Amazon",                 tipo: "Residencial" },
  { lat: -29.462476, lng: -51.967271, nome: "Ed. Diamond Tower",          tipo: "Comercial" },
  { lat: -29.460795, lng: -51.968108, nome: "Diamond Center",             tipo: "Comercial" },
  { lat: -29.457690, lng: -51.972855, nome: "Ed. W. Tower",               tipo: "Comercial" },
  { lat: -29.443239, lng: -51.954882, nome: "Condomínio Villa Allegra",   tipo: "Residencial" },
  { lat: -29.457647, lng: -51.963875, nome: "Residencial Mont Blanc",     tipo: "Residencial" },
  { lat: -29.446550, lng: -51.966204, nome: "Restaurante Meu Escritório", tipo: "Comercial" },
  { lat: -29.459510, lng: -51.960889, nome: "Clube de Tiro e Caça",       tipo: "Comercial" },
  { lat: -29.465763, lng: -51.977383, nome: "Vivance Moinhos",            tipo: "Residencial" },
  { lat: -29.449767, lng: -51.967378, nome: "Tri Hotel Executive",        tipo: "Hotéis" },
  { lat: -29.454415, lng: -51.970399, nome: "TRI Hotel Lajeado",          tipo: "Hotéis" },
  { lat: -29.456997, lng: -51.966522, nome: "Diamond Life",               tipo: "Residencial" },
  { lat: -29.467453, lng: -51.971831, nome: "Residencial do Parque",      tipo: "Residencial" },
  { lat: -29.446301, lng: -51.967308, nome: "Centro Comercial 300",       tipo: "Comercial" },
  { lat: -29.447105, lng: -51.966079, nome: "Res. São Cristóvão",         tipo: "Residencial" },
  { lat: -29.451961, lng: -51.972869, nome: "Edifício Scartezini",        tipo: "Residencial" },
  { lat: -29.446023, lng: -51.967719, nome: "Line Tower",                 tipo: "Residencial" },
];

/* ============================================
   MARCADOR E POPUP
   ============================================ */

/* className VAZIO — O PADRÃO "leaflet-div-icon" TRAZ FUNDO BRANCO E BORDA */
function criarIcone(L) {
  return L.divIcon({
    className:   "",
    html:        `<span class="clv-map-pin"></span>`,
    iconSize:    [18, 18],
    iconAnchor:  [9, 9],
    popupAnchor: [0, -12],
  });
}

/* O href JÁ SAI PRONTO DAQUI — O POPUP NASCE DEPOIS DO BOOT E NUNCA PASSA
   PELA VARREDURA DE [data-whatsapp-cta] DO main.js */
function criarPopup(ponto) {
  const href = getWhatsappLink(
    `${WHATSAPP_GREETING}\n\nVi o ponto "${ponto.nome}" no mapa da CLAVE e gostaria de saber mais sobre anunciar nele.`
  );

  return (
    `<p class="clv-map-popup__nome">${ponto.nome}</p>` +
    `<p class="clv-map-popup__tipo">${ponto.tipo}</p>` +
    `<a class="clv-map-popup__cta" href="${href}" target="_blank" rel="noopener noreferrer" data-whatsapp-cta>Falar no WhatsApp</a>`
  );
}

/* ============================================
   INIT
   ============================================ */

export function initMap() {
  const el = document.getElementById("clv-map");
  if (!el) return;

  /* LEAFLET SÓ ENTRA QUANDO A SEÇÃO SE APROXIMA: TIRA ~150 KB E UM CSS
     BLOQUEANTE DO CARREGAMENTO INICIAL. once — O TRIGGER SE DESTRÓI. */
  ScrollTrigger.create({
    trigger: el,
    start:   PRELOAD_START,
    once:    true,
    onEnter: async () => {
      const [{ default: L }] = await Promise.all([
        import("leaflet"),
        import("leaflet/dist/leaflet.css"),
      ]);

      /* O PLUGIN SE PENDURA NO L GLOBAL — PRECISA EXISTIR ANTES DO IMPORT */
      window.L = L;
      await Promise.all([
        import("leaflet.markercluster"),
        import("leaflet.markercluster/dist/MarkerCluster.css"),
      ]);

      buildMap(L, el);
    },
  });
}

function buildMap(L, el) {
  const map = L.map(el, {
    center: CENTRO,
    zoom:   ZOOM,
    /* ZOOM FRACIONADO — O fitBounds PREENCHE O MAPA EM VEZ DE PARAR NO
       INTEIRO ABAIXO */
    zoomSnap:  0.25,
    zoomDelta: 0.5,
    /* A RODA PERTENCE AO LENIS — HABILITADA, O MAPA SEQUESTRARIA O SCROLL
       DA PÁGINA AO PASSAR POR CIMA DELE */
    scrollWheelZoom: false,
    /* TOQUE: 1 DEDO ROLA A PÁGINA, 2 DEDOS MOVEM O MAPA */
    dragging: !L.Browser.mobile,
    tap:      !L.Browser.mobile,
  });

  if (L.Browser.mobile) initTouchGesture(map, el);

  L.tileLayer(TILE_URL, { attribution: TILE_ATTR, maxZoom: TILE_MAX }).addTo(map);

  const icone = criarIcone(L);

  /* PINOS PRÓXIMOS VIRAM UM CÍRCULO COM A CONTAGEM — CLICAR APROXIMA; NO
     ZOOM MÁXIMO, ABRE EM LEQUE */
  const grupo = L.markerClusterGroup({
    maxClusterRadius:    40,
    showCoverageOnHover: false,
    spiderfyOnMaxZoom:   true,
    iconCreateFunction: (c) => L.divIcon({
      className:  "",
      html:       `<span class="clv-map-cluster">${c.getChildCount()}</span>`,
      iconSize:   [36, 36],
      iconAnchor: [18, 18],
    }),
  });

  PONTOS.forEach((ponto) => {
    L.marker([ponto.lat, ponto.lng], { icon: icone, title: ponto.nome })
      .addTo(grupo)
      .bindPopup(criarPopup(ponto));
  });

  map.addLayer(grupo);

  map.fitBounds(L.latLngBounds(PONTOS.map((p) => [p.lat, p.lng])), { padding: [40, 40] });

  /* O CONTAINER ENTRA COM reveal NO WRAPPER — REMEDIMOS APÓS O PRIMEIRO
     FRAME PARA O LEAFLET NÃO GUARDAR UM TAMANHO ANTIGO */
  requestAnimationFrame(() => map.invalidateSize());
}

/* ============================================
   GESTO DE TOQUE — SÓ MOBILE
   ============================================ */

/* COM dragging DESLIGADO O CONTAINER FICA EM touch-action: pan-x pan-y — UM
   DEDO ROLA A PÁGINA NATIVAMENTE. DOIS DEDOS LIGAM O ARRASTE; O AVISO EXPLICA
   O GESTO A QUEM TENTA COM UM SÓ. */
function initTouchGesture(map, el) {
  const hint = document.createElement("div");
  hint.className   = "clv-mapa__hint";
  hint.textContent = HINT_TEXT;
  hint.setAttribute("aria-hidden", "true");
  el.appendChild(hint);

  let hideTimer = 0;

  const fade = (autoAlpha) =>
    gsap.to(hint, { autoAlpha, duration: DURATIONS.sm, ease: EASE.primary, overwrite: true });

  const hideHint = () => {
    clearTimeout(hideTimer);
    fade(0);
  };

  const onTouch = (e) => {
    if (e.touches.length >= 2) {
      map.dragging.enable();
      hideHint();
      return;
    }

    if (e.type !== "touchmove") return;

    fade(1);
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideHint, HINT_HIDE_MS);
  };

  el.addEventListener("touchstart", onTouch, { passive: true });
  el.addEventListener("touchmove",  onTouch, { passive: true });
  el.addEventListener("touchend", (e) => {
    if (e.touches.length < 2) map.dragging.disable();
  }, { passive: true });
}
