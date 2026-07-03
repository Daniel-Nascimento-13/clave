// ==========================================================
// SITE.TS · CONSTANTES
// O QUE FAZ: OBJETO CENTRAL COM NOME, DESCRIÇÃO SEO, URL, OG IMAGE,
//            E-MAIL DE CONTATO E LINKS DE NAVEGAÇÃO DO SITE.
// QUANDO MEXER: 1X POR CLIENTE — CONFIGURE TUDO DA LP AQUI PRIMEIRO.
// ==========================================================
export const siteConfig = {
  name: 'Site Name',
  description: 'Descrição do site para SEO.',
  url: 'https://example.com',
  ogImage: '/images/og.png',
  contact: {
    email: 'hello@example.com',
  },
  navLinks: [] as { label: string; href: string }[],
};
