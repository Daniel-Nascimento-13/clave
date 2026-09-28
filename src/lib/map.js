/* ============================================
   MAPA — REDE DE PONTOS (LEAFLET VIA CDN)
   ============================================ */

/* ---------- IMPORTS ---------- */

import { getWhatsappLink } from "./whatsapp.js";

/* ============================================
   CONSTANTES
   ============================================ */

/* LAJEADO/RS */
const CENTRO = [-29.4678, -51.9614];
const ZOOM   = 14;

/* OPENSTREETMAP — SEM CHAVE DE API */
const TILE_URL  = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const TILE_MAX  = 19;

/* ---------- PONTOS ---------- */

/* PLACEHOLDER — SUBSTITUIR PELAS COORDENADAS REAIS DOS LOCAIS */
const PONTOS = [
  { lat: -29.4678, lng: -51.9614, nome: "Local 1", tipo: "Residencial" },
  { lat: -29.4710, lng: -51.9580, nome: "Local 2", tipo: "Comercial" },
  { lat: -29.4650, lng: -51.9640, nome: "Local 3", tipo: "Hotéis" },
];

/* ============================================
   MARCADOR E POPUP
   ============================================ */

/* className VAZIO — O PADRÃO "leaflet-div-icon" TRAZ FUNDO BRANCO E BORDA */
function criarIcone(L) {
  return L.divIcon({
    className:   "",
    html:        '<span class="clv-map-pin"></span>',
    iconSize:    [18, 18],
    iconAnchor:  [9, 9],
    popupAnchor: [0, -12],
  });
}

/* O href JÁ SAI PRONTO DAQUI — O POPUP NASCE DEPOIS DO BOOT E NUNCA PASSA
   PELA VARREDURA DE [data-whatsapp-cta] DO main.js */
function criarPopup(ponto) {
  const href = getWhatsappLink(
    "Olá! Espero que esteja tudo bem.\n\n" +
    `Vi o ponto "${ponto.nome}" (${ponto.tipo}) no mapa da Clave e gostaria de ` +
    "receber mais informações sobre anunciar nele.\n\n" +
    "Aguardo seu retorno. Obrigado!"
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

  /* LEAFLET VEM DO <script> CDN EM index.html — SE O CDN FALHAR, A SEÇÃO
     APENAS NÃO RENDERIZA O MAPA, SEM DERRUBAR O RESTO DO BOOT */
  const L = window.L;
  if (!L) return;

  const map = L.map(el, {
    center: CENTRO,
    zoom:   ZOOM,
    /* A RODA PERTENCE AO LENIS — HABILITADA, O MAPA SEQUESTRARIA O SCROLL
       DA PÁGINA AO PASSAR POR CIMA DELE */
    scrollWheelZoom: false,
  });

  L.tileLayer(TILE_URL, { attribution: TILE_ATTR, maxZoom: TILE_MAX }).addTo(map);

  const icone = criarIcone(L);

  PONTOS.forEach((ponto) => {
    L.marker([ponto.lat, ponto.lng], { icon: icone, title: ponto.nome })
      .addTo(map)
      .bindPopup(criarPopup(ponto));
  });

  /* O CONTAINER ENTRA COM reveal NO WRAPPER — REMEDIMOS APÓS O PRIMEIRO
     FRAME PARA O LEAFLET NÃO GUARDAR UM TAMANHO ANTIGO */
  requestAnimationFrame(() => map.invalidateSize());
}
