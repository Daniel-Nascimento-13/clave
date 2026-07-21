/* ============================================
   DADOS — PRÉDIOS E CONDOMÍNIOS
   ============================================ */

/* ---------- CATEGORIAS ---------- */

/* slug -> categoria COMO ELA APARECE NOS ITENS ABAIXO. O slug É O QUE TRAFEGA NO
   data-category DO HTML (MENU DE FILTROS DO "ANUNCIE" E BOTÕES DA SEÇÃO PRÉDIOS).
   MORA AQUI, JUNTO DOS DADOS, PORQUE OS DOIS CARROSSÉIS DEPENDEM DESSE PAR: EM DOIS
   LUGARES, AS DUAS CÓPIAS DIVERGIRIAM NA PRIMEIRA CATEGORIA NOVA.

   null = "TODOS", QUE NÃO FILTRA NADA. HOTÉIS/RESTAURANTES/EVENTOS AINDA NÃO TÊM
   NENHUM ITEM CADASTRADO — O OVERLAY MOSTRA ESTADO VAZIO NELAS. */
export const CATEGORIAS = {
  todos: null,
  residencial: "Residencial",
  comercial: "Comercial",
  hoteis: "Hotéis",
  restaurantes: "Restaurantes",
  eventos: "Eventos",
};

// O CAMINHO INVERSO (LABEL -> slug) NÃO PODE SER toLowerCase(): "Hotéis" VIRARIA
// "hotéis" E NUNCA BATERIA COM O slug "hoteis" DO HTML.
export function slugDaCategoria(categoria) {
  return Object.keys(CATEGORIAS).find((slug) => CATEGORIAS[slug] === categoria);
}

/* ---------- LOCAIS ---------- */

export const PREDIOS = [

/* ---------- RESIDENCIAIS ---------- */

  /* - 01 - */
  {
    nome: "Residencial São Cristóvão",
    categoria: "Residencial",
    foto: "/images/predios/PREDIO-SAO-CRISTOVAO.webp",
    descricao:
      "Torre residencial de alto padrão, mais alta do estado, localizado no bairro São Cristóvão em Lajeado, com telas Clave posicionadas nos elevadores.",
    metricas: {
      apartamentos: { label: "Apartamentos", valor: "118" },
      moradores: { label: "Moradores", valor: "250" },
      telas: { label: "Telas instaladas", valor: "3" },
      alcance: { label: "Alcance mensal", valor: "500" },
    },
  },

  /* - 02 - */
  {
    nome: "Edifício Line Tower",
    categoria: "Residencial",
    foto: "/images/predios/PREDIO-LINE-TOWER.webp",
    descricao:
      "Torre residencial de alto padrão, localizado no bairro São Cristóvão em Lajeado, com telas instaladas nos elevadores.",
    metricas: {
      apartamentos: { label: "Apartamentos", valor: "109" },
      moradores: { label: "Moradores", valor: "200" },
      telas: { label: "Telas instaladas", valor: "2" },
      alcance: { label: "Alcance mensal", valor: "400" },
    },
  },

  /* - 03 - */
  {
    nome: "Edifício Diamond Life",
    categoria: "Residencial",
    foto: "/images/predios/PREDIO-DIAMOND-LIFE.webp",
    descricao:
      "Torre residencial de alto padrão, localizado no bairro Americano em Lajeado, com telas instaladas nos elevadores.",
    metricas: {
      apartamentos: { label: "Apartamentos", valor: "72" },
      moradores: { label: "Moradores", valor: "160" },
      telas: { label: "Telas instaladas", valor: "1" },
      alcance: { label: "Alcance mensal", valor: "320" },
    },
  },

  /* - 04 - */
  {
    nome: "Edifício Scartesini",
    categoria: "Residencial",
    foto: "/images/predios/PREDIO-SCARTESINI.webp",
    descricao:
      "Prédio residencial na rotula movimentada da Univates, localizado no bairro São Cristóvão em Lajeado, telas instaladas nos elevadores.",
    metricas: {
      apartamentos: { label: "Apartamentos", valor: "88" },
      moradores: { label: "Moradores", valor: "180" },
      telas: { label: "Telas instaladas", valor: "1" },
      alcance: { label: "Alcance mensal", valor: "360" },
    },
  },

  /* - 05 - */
  {
    nome: "Residencial do Parque",
    categoria: "Residencial",
    foto: "/images/predios/PREDIO-DO-PARQUE.webp",
    descricao:
      "Condomínio horizontal fechado com duas torres, localizado no bairro Moinhos em Lajeado, telas instaladas nos elevadores.",
    metricas: {
      apartamentos: { label: "Apartamentos", valor: "225" },
      moradores: { label: "Moradores", valor: "600" },
      telas: { label: "Telas instaladas", valor: "4" },
      alcance: { label: "Alcance mensal", valor: "1.200" },
    },
  },

  /* ---------- COMERCIAIS ---------- */

  /* - 01 - */
  {
    nome: "Edifício Comercial 300",
    categoria: "Comercial",
    foto: "/images/predios/PREDIO-300.webp",
    descricao:
      "Torre comercial com salas corporativas e clínicas, localizado no bairro São Cristóvão em Lajeado, telas instaladas nos elevadores com fluxo intenso de profissionais e clientes.",
    metricas: {
      apartamentos: { label: "Salas", valor: "151" },
      moradores: { label: "Circulação diária", valor: "1k" },
      telas: { label: "Telas instaladas", valor: "3" },
      alcance: { label: "Alcance mensal", valor: "30K" },
    },
  },

   /* ---------- HOTEIS ---------- */

  /* - 01 - */
  {
    nome: "Tri Hotel Executive ",
    categoria: "Hotéis",
    foto: "/images/predios/HOTEL-TRIHOTEL-SAOCRISTOVAO.webp",
    descricao:
      "Hotel executivo de alto padrão localizada no bairro São Cristóvão, em Lajeado, com telas instaladas nos elevadores e áreas de circulação, alcançando um fluxo intenso de hóspedes, visitantes e profissionais.",
    metricas: {
      apartamentos: { label: "Quartos", valor: "84" },
      moradores: { label: "Circulação diária", valor: "60" },
      telas: { label: "Telas instaladas", valor: "2" },
      alcance: { label: "Alcance mensal", valor: "1.800" },
    },
  },

   /* - 02 - */
  {
    nome: "Tri Hotel",
    categoria: "Hotéis",
    foto: "/images/predios/HOTEL-TRIHOTEL-FLORESTAL.webp",
    descricao:
      "Hotel localizado no bairro Florestal, em Lajeado, com telas instaladas nos elevadores e áreas de circulação, alcançando um fluxo intenso de hóspedes, visitantes e profissionais.",
    metricas: {
      apartamentos: { label: "Quartos", valor: "118" },
      moradores: { label: "Circulação diária", valor: "55" },
      telas: { label: "Telas instaladas", valor: "1" },
      alcance: { label: "Alcance mensal", valor: "1.600" },
    },
  },

];