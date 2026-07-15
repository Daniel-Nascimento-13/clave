/* ============================================
   DIFERENCIAIS — CONTEÚDO
   ============================================ */
const IC = {
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  repeat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
  screen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8"/><path d="M12 16v4"/></svg>`,
};

export const diferenciais = [
  {
    num: "01",
    icon: IC.eye,
    title: "Público cativo",
    sub: "Atenção total no elevador",
    desc: "No elevador não dá pra pular, fechar ou trocar de aba. Sua marca tem 100% da atenção.",
    items: ["Exibição sem concorrência de tela", "Ambiente sem distração", "Contato visual garantido"],
  },
  {
    num: "02",
    icon: IC.repeat,
    title: "Alta frequência",
    sub: "Impacto que se repete",
    desc: "O morador vê sua marca várias vezes por dia, todos os dias. Repetição que fixa.",
    items: ["Múltiplas exibições por dia", "Presença diária constante", "Fixação de marca"],
  },
  {
    num: "03",
    icon: IC.pin,
    title: "Segmentação local",
    sub: "Onde seu público mora",
    desc: "Anuncie exatamente nos condomínios certos de Lajeado e região. Público qualificado.",
    items: ["Condomínios estratégicos", "Público qualificado", "Lajeado e região"],
  },
  {
    num: "04",
    icon: IC.screen,
    title: "Mídia digital",
    sub: "Telas de alta resolução",
    desc: "Conteúdo dinâmico, atualização remota e visual premium. Nada de papel.",
    items: ["Telas Full HD", "Conteúdo dinâmico", "Atualização remota"],
  },
];