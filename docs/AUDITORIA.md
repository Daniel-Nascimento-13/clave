# Auditoria — Clave Mídia Indoor

> Varredura somente leitura em 2026-10-09, sobre o commit `1ea645f` (branch `main`, árvore limpa).
> Stack: Vite 8 · HTML/CSS/JS vanilla · Tailwind v4 (`@tailwindcss/vite`) · GSAP 3.15 (ScrollTrigger, ScrollToPlugin, SplitText) · Lenis 1.3 · Leaflet 1.9.4 via CDN.
> Toda referência segue o formato `arquivo:linha`.

---

## 1. Árvore do projeto

```
CLAVE/
├── index.html                      # Página única: menu, 10 seções, rodapé e 2 overlays de formulário (966 linhas)
├── vite.config.js                  # Vite + plugin do Tailwind v4; nenhuma outra config
├── package.json                    # Scripts dev/build/preview; deps gsap, lenis, fontsource (Inter, Bricolage)
├── package-lock.json               # Lockfile npm
├── README.MD                       # Descrição comercial do projeto (link de produção vazio na linha "👉")
├── .gitignore                      # Ignora node_modules, dist, .DS_Store etc.
├── .claude/settings.local.json     # Permissões locais do Claude Code
├── public/
│   ├── images/clave/logo.webp      # Logo (menu e rodapé)
│   ├── images/clave/sobre.webp     # Foto da seção Sobre
│   ├── images/marcas/*.webp (16)   # Logos dos anunciantes do marquee
│   ├── images/predios/*.webp (4)   # Fotos do carrossel "Locais" (PREDIO-LINE-TOWER não é usada)
│   ├── images/sobre/VIDEO-SOBRE.mp4         # Vídeo de 23 MB — NÃO USADO
│   ├── images/sobre/VIDEO-SOBRE-POSTER.jpg  # Poster do vídeo — NÃO USADO
│   └── videos/                     # Pasta vazia (só .DS_Store)
└── src/
    ├── main.js                     # Boot: importa CSS e chama todos os init* na ordem
    ├── constants/motion.js         # Tokens de movimento (DURATIONS, EASE, REVEAL, HERO, ROULETTE + 2 objetos mortos)
    ├── lib/gsap.js                 # Registra ScrollTrigger/ScrollToPlugin/SplitText; ignoreMobileResize
    ├── lib/smooth-scroll.js        # Lenis + sincronização com ScrollTrigger; refresh no visualViewport
    ├── lib/map.js                  # Mapa Leaflet (OSM) com 3 pontos placeholder e popup de WhatsApp
    ├── lib/locais-carousel.js      # Carrossel de 3 cards (setas prev/next, translateX via CSS transition)
    ├── lib/whatsapp.js             # Número e mensagem padrão; getWhatsappLink()
    ├── lib/contato.js              # Switcher de formulários, pré-seleção de plano e 4 submits → wa.me
    ├── animations/hero.js          # Timeline de abertura do hero (SplitText + etapas)
    ├── animations/reveal.js        # Sistema único de entrada: box / block / lines / roulette via ScrollTrigger.batch
    ├── animations/number-roulette.js # Constrói as fitas de dígitos e devolve timeline pausada
    ├── animations/marcas.js        # Marquee infinito em 2 direções; getMarcasRevealY() vestigial
    ├── components/menu/menu.js     # Menu, burger mobile, overlays (abrir/fechar), trava de scroll, ESC
    ├── components/menu/menu.css    # Estilos da barra, burger, painel mobile e base dos overlays
    ├── data/predios.js             # Lista de prédios/categorias — ARQUIVO MORTO (não é importado)
    └── styles/main.css             # Tokens, primitivas, reveal, roleta e todas as seções (1664 linhas)
```

Fora do versionamento, mas presentes no disco: `dist/` (build antigo, inclui `dist/videos/` vazio) e `node_modules/`.

---

## 2. Seções do site

Ordem real no DOM. Os comentários "SEÇÃO N" no HTML e no CSS **não seguem a ordem do DOM** (3, 6, 6.5, 4, 2, 7, 5, 8, 9).

| # | Seção (DOM) | id / classe | HTML | JS que anima/controla | CSS |
|---|---|---|---|---|---|
| — | Menu | `#clv-menu.clv-menu` + `nav.clv-menu__nav` (irmã) | `index.html:27-50` | `menu.js` inteiro | `menu.css:1-211`; complementos `main.css:256-311` |
| 1 | Hero | `#hero.clv-hero` | `index.html:57-87` | `hero.js:26-100`; CSS `@keyframes clv-bob` | `main.css:313-441`; estado inicial `main.css:168-204` |
| 2 | A Rede (números) | `#rede.clv-rede` | `index.html:92-125` | `reveal.js` (data-reveal) + `number-roulette.js` (data-roulette) | `main.css:501-607` |
| 3 | Locais | `#locais.clv-locais` | `index.html:130-167` | `reveal.js` (cabeçalho); `locais-carousel.js:5-29` | `main.css:884-981` |
| 4 | Mapa | `#mapa.clv-mapa` | `index.html:172-193` | `reveal.js` (frame); `map.js:67-97` | `main.css:983-1093` |
| 5 | Sobre | `#sobre.clv-sobre` | `index.html:198-252` | `reveal.js` + roleta | `main.css:609-756` |
| 6 | Experiência | `#experiencia.clv-exp` | `index.html:257-286` | `reveal.js` | `main.css:443-499` |
| 7 | Marcas | `#marcas.marcas` `[data-marcas]` | `index.html:291-347` | `marcas.js:38-49` (marquee) + `reveal.js` (título) | `main.css:1095-1165` |
| 8 | Diferenciais | `#diferenciais.clv-dif` | `index.html:352-428` | `reveal.js` | `main.css:758-882` |
| 9 | Planos | `#planos.clv-planos` | `index.html:433-540` | `reveal.js` (card anual com `data-reveal-bleed`); CTAs abrem overlay via `menu.js` + `contato.js:40-50` | `main.css:1167-1290` |
| 10 | Contato | `#contato.clv-contato` | `index.html:545-599` | `reveal.js`; links abrem overlays | `main.css:1292-1565` |
| — | Rodapé | `footer.clv-footer` | `index.html:606-609` | — | `main.css:1637-1662` |
| — | Overlay "Quero anunciar" | `#overlay-form-anunciante` `[data-overlay="form-anunciante"]` | `index.html:616-788` (forms `#formAnunciante` 640, `#formEspacoAlt` 701) | `menu.js:129-174`; `contato.js:55-135, 139-172` | `menu.css:213-262`; `main.css:1567-1635` + campos `1455-1565` |
| — | Overlay "Tenho um espaço" | `#overlay-form-espaco` `[data-overlay="form-espaco"]` | `index.html:793-964` (forms `#formAnuncianteAlt` 817, `#formEspaco` 877) | idem; `contato.js:113-135, 176-212` | idem |

### Sobre os overlays citados no pedido (Sobre, Anuncie, Cobertura, Planos)

**Esses overlays não existem no código atual.** Os únicos overlays são os dois formulários acima. No menu, "Sobre", "Anunciantes", "A Rede" e "Planos" são botões de **scroll** (`index.html:44-48`, `data-action="scroll"`), não de overlay. O que sobrou deles são comentários e caminhos de código vestigiais:

- `menu.js:67-68` repassa `data-category` / `data-item`, mas nenhum elemento do HTML tem esses atributos.
- `menu.js:127-128` diz que `openOverlay` é exportado "para predios.js", e `menu.js:149` diz que `closeOverlay` é usado pelo "item HOME do filtro do Anuncie". Nenhum dos dois consumidores existe.
- `menu.js:154` comenta sobre o "vídeo do Sobre" (o vídeo está em `public/`, mas não é usado).
- `data/predios.js` (categorias e filtros do antigo overlay de cobertura) não é importado.
- `reveal.js:25` inclui `[data-overlay]` em `GROUP`, mas nenhum overlay tem `data-reveal`.

---

## 3. Animações

### 3.1 Inventário de tweens, timelines e ScrollTriggers

**O projeto não tem nenhum `pin` nem `scrub`.** Existe um único `ScrollTrigger.batch`; o resto roda no load ou por clique.

| # | Arquivo:linha | Função | Alvo / trigger | Tipo | Duração | Ease | Stagger / posição |
|---|---|---|---|---|---|---|---|
| 1 | `hero.js:45-63` | `initHero` | `[data-hero="title"]` — linhas via `SplitText` (`autoSplit`, `mask: "lines"`) | `gsap.from` yPercent 100 + autoAlpha, no load | `DURATIONS.md` = 1.0 | `EASE.expo` (expo.out) | `REVEAL.linesStagger` 0.2 |
| 2 | `hero.js:71-99` | `initHero` → `addStep` | subtítulo, filhos de `[data-hero="actions"]`, `[data-hero="scroll"]` | `gsap.timeline()` + `fromTo` clipPath/y/autoAlpha | `DURATIONS.sm` = 0.8 | `EASE.primary` (power3.out) | posição `step * HERO.stepGap` (0.2), começando em `lineCount` |
| 3 | `reveal.js:60-76` | `buildBox` | `[data-reveal]` e `[data-reveal="block"]` | `fromTo` pausado (clipPath/y/autoAlpha) | 0.8 | power3.out | `block` atrasa 0.2 s via `gsap.delayedCall` (`reveal.js:181-183`) quando a seção tem `lines` |
| 4 | `reveal.js:85-114` | `buildLines` | `[data-reveal="lines"]` → SplitText | `gsap.from` pausado, yPercent 100 | 1.0 | expo.out | 0.2 |
| 5 | `number-roulette.js:85-103` | `buildRoulette` | `[data-roulette]` → `.clv-roulette__strip` | `timeline({paused})` + `fromTo` yPercent | `ROULETTE.duration` = 1.2 | expo.out | `index * 0.2` por dígito |
| 6 | **`reveal.js:170-189`** | `initReveal` | **`ScrollTrigger.batch`** sobre todos os itens acima (3–5) | `start: "top 85%"`, `once: true`, sem pin/scrub | — | — | dispara `.play()` |
| 7 | `marcas.js:26-32` | `initMarquee` | `[data-marquee]` (2 trilhas) | `to` / `fromTo` xPercent 0 ↔ −50, `repeat: -1` | 22 s (esquerda) / 26 s (direita), **hardcoded** | `none` | sem ScrollTrigger |
| 8 | `menu.js:38` | `initMenu` | `[data-overlay]` | `gsap.set` clipPath `inset(0 0 100% 0)`, autoAlpha 0 | — | — | — |
| 9 | `menu.js:141-146` | `openOverlay` | overlay | `to` clipPath + autoAlpha | 0.8 (`REVEAL_DURATION` local) | `'expo.out'` (string literal) | — |
| 10 | `menu.js:159-170` | `closeOverlay` | overlay | `to` | 0.8 ou 0.3 (`immediate`) | power3.out | — |
| 11 | `menu.js:231-232` | `bindBurger` (abrir) | `[data-menu-nav]` | `set` + `to` clipPath/autoAlpha | 0.6 | power3.out | — |
| 12 | `menu.js:208-217`, `235-244` | `closeBurgerMenu` / `bindBurger` (fechar) | `[data-menu-nav]` | `to` (bloco duplicado) | 0.6 | power3.out | — |
| 13 | `menu.js:92` | `scrollToTarget` | `lenis.scrollTo` | — | 1.2 | ease do Lenis | `offset: -80`; espera de 700 ms se o burger estiver aberto (`menu.js:87`) |
| 14 | `main.css:426-432` | CSS | `.clv-hero__scroll-arrow` | `@keyframes clv-bob` translateY | 2.4 s infinito | ease-in-out | desligado em reduced-motion (`main.css:434-436`) |
| 15 | `main.css:937` | CSS | `.clv-locais__card` | `transition: transform` | 0.5 s | `cubic-bezier(.25,.46,.45,.94)` | acionado por `locais-carousel.js:22-24` |

### 3.2 Lenis × ScrollTrigger

- **Inicialização:** `smooth-scroll.js:16-51`, chamada primeiro em `main.js:22`. Não sobe com `prefers-reduced-motion` (`smooth-scroll.js:17-18`); nesse caso `getLenis()` devolve `null`.
- **Sincronização (`smooth-scroll.js:27-29`):** `lenis.on("scroll", ScrollTrigger.update)` + `gsap.ticker.add(t => lenis.raf(t*1000))` + `gsap.ticker.lagSmoothing(0)`. É o padrão recomendado.
- **Config:** `duration: 1.2`, easing exponencial inline, `smoothWheel: true`. Esses valores **não** vêm de `motion.js`.
- **Ajuste mobile:** `ScrollTrigger.config({ ignoreMobileResize: true })` (`gsap.js:17`) + listener de `visualViewport` que chama `ScrollTrigger.refresh()` com debounce de 180 ms (`smooth-scroll.js:35-48`). Os dois comentários justificam isso pelo "pin de `.produto`", **que não existe mais**. Hoje não há pin, então o mecanismo só gera refreshes desnecessários.
- **Trava de scroll:** `lenis.stop()/start()` em `menu.js:113-121`; sem Lenis, cai na classe `.clv-no-scroll` (`menu.css:264-266`).
- **`data-lenis-prevent`:** no mapa (`index.html:189`) e nos painéis dos overlays (`index.html:617, 794`).
- **`lenis/dist/lenis.css` não é importado.** Ele traz `html.lenis {height:auto}`, `.lenis-stopped {overflow:hidden}` e `[data-lenis-prevent] {overscroll-behavior: contain}` — ver P-M5.

### 3.3 Cleanup (kill / revert / clearProps)

**Existe:**
- `settleReveal` → `clearProps: "clipPath,transform"` + `.is-revealed` (`reveal.js:37-40`), chamado pelo box (`reveal.js:73`) e pelo hero (`hero.js:87-89`).
- Linhas do SplitText → `clearProps: "transform"` no `onComplete` (`reveal.js:105`, `hero.js:60`).
- Burger → `clearProps: 'opacity,visibility,clipPath'` (`menu.js:215, 242`).
- `once: true` no batch faz cada ScrollTrigger se matar após entrar (`reveal.js:172`).
- `menu.js:166` protege contra race condition no fechamento.

**Falta:**
- **Nenhum `kill()`, `revert()`, `gsap.context()` ou `gsap.matchMedia()` em todo o projeto.** Para uma página estática isso é aceitável, mas:
- Os tweens do marquee (`marcas.js:26-32`) rodam infinitamente mesmo fora da viewport. Falta pausar com ScrollTrigger (`toggleActions`) ou IntersectionObserver.
- `prefers-reduced-motion` é lido uma vez só (`smooth-scroll.js:17`, `hero.js:30`, `reveal.js:124`, `marcas.js:42`). Mudar a preferência em runtime não tem efeito; `gsap.matchMedia()` resolveria.
- As instâncias de SplitText (`hero.js:45`, `reveal.js:88`) nunca são revertidas, e o `autoSplit` mantém listeners de resize para sempre (custo baixo).
- Os overlays ignoram reduced-motion: continuam animando clip-path por 0.8 s (`menu.js:141`).
- Nenhum tween de overlay usa `overwrite: "auto"`. Fechar e reabrir rápido o mesmo overlay deixa dois tweens disputando o elemento (`menu.js:141` × `menu.js:159`).

### 3.4 Constantes de motion e valores hardcoded

`src/constants/motion.js`:
- `DURATIONS { sm: 0.8, md: 1.0, lg: 1.2 }` (l.5), `EASE { primary: "power3.out", expo: "expo.out" }` (l.6)
- `REVEAL { y: 24, clipFrom, clipTo, start: "top 85%", blockOffset: 0.2, linesStagger: 0.2, bleed: "2em" }` (l.12-24)
- `HERO { stepGap: 0.2 }` (l.30) · `ROULETTE { duration: DURATIONS.lg, digitStagger: 0.2, extraTurns: 3 }` (l.36-40)
- **Mortos:** `DIFERENCIAIS` (l.44-49) e `PRODUTO` (l.53-58) não são importados em lugar nenhum.

Valores hardcoded fora de `motion.js`:

| Local | Valor |
|---|---|
| `menu.js:16-17` | `REVEAL_DURATION = 0.8`, `EASE = 'power3.out'` — redeclara `DURATIONS.sm` e `EASE.primary` |
| `menu.js:145` | `'expo.out'` literal |
| `menu.js:162` | `0.3` (fechamento imediato) |
| `menu.js:211, 232, 238` | `0.6` (burger, 3×) |
| `menu.js:87, 92` | delay 700 ms, `duration: 1.2`, `offset: -80` (altura do menu duplicada do CSS `menu.css:133, 188`) |
| `marcas.js:23, 29, 32` | durações 22/26, `ease: "none"`, xPercent −50 |
| `smooth-scroll.js:21-22, 46` | Lenis `duration 1.2`, easing inline, debounce 180 ms |
| `main.css:174-175, 181` | `translateY(24px)`, `inset(0% 0% 100% 0%)`, `inset(-2em …)` — espelham `REVEAL.y`/`clipFrom`/`bleed` à mão (o comentário admite isso em `main.css:164`) |
| `main.css:112, 269, 937, 975, 1143`; `menu.css:92` | transições CSS de 0.2–0.5 s com eases variados |

---

## 4. CSS / Tailwind

### 4.1 Tokens

`@theme {}` (`main.css:11-17`):

| Token | Valor | Uso |
|---|---|---|
| `--color-paper` | `#f4f3f0` | **não usado** |
| `--color-ink` | `#14140f` | **não usado** (duplica `--clv-ink`) |
| `--color-accent` | `#811ec1` | **não usado** (duplica `--clv-purple`) |
| `--font-display` | Bricolage Grotesque | usado via `var()` em ~20 regras |
| `--font-body` | Inter Variable | `body`, eyebrow, botões, etc. |

`:root` (`main.css:20-34`) define a paleta efetivamente usada: `--clv-purple`, `-vivid`, `-dark`, `-light`, `-pale` (**`-pale` não é usado**), `--clv-bg-dark`, `--clv-bg-navy` (**não usado**), `--clv-bg-soft`, `--clv-ink`, `--clv-muted`, `--clv-line`.

**Nenhuma utility do Tailwind é usada no HTML.** O Tailwind entra só com o preflight e a geração das variáveis de `@theme`. Todo o CSS custom fica fora de `@layer`, então sempre vence qualquer utility que venha a ser adicionada.

**Tokens inexistentes referenciados:** `var(--clv-font-display)` (`main.css:1359, 1580`) e `var(--clv-font-body)` (`main.css:1512`). Ver P-M1.

**Cores fora dos tokens:** `#14001E` (`menu.css:23`, `main.css:1334`, igual a `--clv-bg-dark`), `#0a0a0a` / `#0a0a0af5` (`menu.css:163, 221`), `#f1faee` (`menu.css:90`, fora da paleta), `#ffffff60/50/cc` (`main.css:743, 749, 781, 785, 1659`), vários `rgba()` em contato.

### 4.2 Breakpoints

| Query | Ocorrências |
|---|---|
| `max-width: 640px` | `main.css:438, 602, 1091, 1162` |
| `max-width: 720px` | `main.css:873` (só Diferenciais — fora do padrão) |
| `max-width: 860px` | `menu.css:128`; `main.css:307, 753, 1287, 1559` |
| `min-width: 861px` | `menu.css:184`; `main.css:274` |
| `prefers-reduced-motion: reduce` | `main.css:211, 434` |

Não há breakpoint de tablet/desktop largo (≥1024). O par 860/861 deixa uma faixa de 860,0–861,0 px sem regra em telas com DPR fracionário (risco baixo).

### 4.3 Duplicações, `!important`, margens negativas, regras mortas

- **`!important`:** nenhum. **Margens negativas:** nenhuma (só `letter-spacing` negativo e `z-index: -1` em `menu.css:21`).
- **Seletores duplicados ou redefinidos:**
  - `.clv-menu__logo img` — `menu.css:38-41`, `menu.css:140-143`, `main.css:298-302`, `main.css:307-311` (o mesmo valor 44/52 px declarado 4×).
  - `.clv-menu::before { height }` — `menu.css:20`, `147`, `194`.
  - `.clv-menu__inner` repete `display/align/justify` dentro do media (`menu.css:131-138`), e o mesmo bloco tem `padding: 0` seguido de `padding-inline`.
  - `.clv-menu__burger { position: relative }` (`menu.css:76` e `172`); `.clv-menu__nav { gap: 2.5rem }` (`menu.css:46, 162, 204`).
  - `.clv-menu__logo` (`menu.css:34` + `main.css:290`).
  - Tipografia de título idêntica 4×: `.clv-heading` (`main.css:76-84`), `.clv-locais__heading` (`895-903`), `.clv-mapa__heading` (`994-1002`), `.clv-dif__heading` (`799-807`).
  - Subtítulos com o mesmo bloco `1.0625rem / 1.7 / --clv-muted / margin 1.25rem 0 0`: `main.css:454, 809, 905, 1004, 1116, 1183`.
  - `.clv-contato__switcher*` (`main.css:1424-1453`) é cópia literal de `.clv-form-overlay__switcher*` (`main.css:1602-1632`), e só a segunda é usada.
  - `.clv-contato__link:hover` e `.clv-contato__card--dark .clv-contato__link:hover` (`main.css:1392-1393`) têm o mesmo valor.
  - Declarações sobrescritas na mesma regra: `.clv-exp` padding → padding-bottom (`main.css:449-450`); `.clv-rede` padding → padding-top (`main.css:507-508`).
  - Diferenciais: o `color` base de `.clv-dif__heading/__title/__desc/__subtitle/__num` (`main.css:806, 812, 843, 854, 860`) e o `font-size` clamp de `__num` (`main.css:840`) são sempre sobrescritos por `.clv-dif .x` (`main.css:774-788`), ou seja, código morto.
- **Regras mortas (classe ausente em HTML e JS):**
  `.clv-hero__eyebrow` (`main.css:360`), `.clv-exp__tagline*` (`489-499`), `.clv-rede__stats--small` (`534`), `.marcas__dots` (`1148-1160`), `.clv-contato__forms*` (`1397-1408`), `.clv-contato__back` (`1410-1420`), `.clv-contato__switcher*` (`1424-1453`), `.clv-contato__form` / `--active` (`1457-1458`).
- **Comentários desatualizados:** `main.css:1182` ("O EYEBROW É O TÍTULO…" acima da regra do subtítulo); `menu.css:5-6` (fala em "três irmãos, CTA" e "sem transform") × `index.html:40-42` (diz que o header tem will-change/transform); `menu.css:145, 192` ("degradê" num fundo sólido).

---

## 5. Mídia

### Imagens

| Arquivo | Peso | Dimensões | Onde | Atributos |
|---|---|---|---|---|
| `images/clave/logo.webp` | 20 KB | 703×355 | `index.html:31` (menu), `:607` (rodapé) | sem `width/height`, sem `loading`; renderiza a 44–52 px de altura |
| `images/clave/sobre.webp` | 72 KB | 1200×900 | `index.html:233-238` | `loading="lazy"`, alt descritivo, sem `width/height` (o `aspect-ratio` do figure segura o CLS) |
| `images/predios/PREDIO-SAO-CRISTOVAO.webp` | **840 KB** | **4284×5712** | `index.html:149` | sem lazy, sem dimensões, alt "Residencial" |
| `images/predios/PREDIO-300.webp` | **920 KB** | **4284×5712** | `index.html:153` | idem, alt "Comercial" |
| `images/predios/HOTEL-TRIHOTEL-SAOCRISTOVAO.webp` | 424 KB | 1200×1600 | `index.html:157` | idem, alt "Hotéis" |
| `images/predios/PREDIO-LINE-TOWER.webp` | 48 KB | 248×378 | **não usada** (só em `predios.js`, que é morto) | — |
| `images/marcas/*.webp` (16) | 20–80 KB (≈ 690 KB no total) | maioria 500×500; DALE-CARNEGIE 1400×932 | `index.html:303-342`; cada logo aparece 2× (cópia com `alt=""` + `aria-hidden`) | sem lazy, sem dimensões; exibidas a 56 px (40 px no mobile) |
| `images/sobre/VIDEO-SOBRE-POSTER.jpg` | 60 KB | 720×1280 | **não usada** | — |

Imagens referenciadas em `data/predios.js` que **não existem**: `PREDIO-DIAMOND-LIFE.webp`, `PREDIO-SCARTESINI.webp`, `PREDIO-DO-PARQUE.webp`, `HOTEL-TRIHOTEL-FLORESTAL.webp` (`predios.js:63, 77, 91, 137`).
Favicons referenciados (`index.html:7-9`) **não existem** em `public/`: `favicon.ico`, `favicon.png`, `apple-touch-icon.png`.

### Vídeo

| Arquivo | Peso | Onde | Atributos |
|---|---|---|---|
| `images/sobre/VIDEO-SOBRE.mp4` | **23,1 MB** | **nenhum `<video>` no HTML** | n/a — versionado no git e copiado para o `dist/` em todo build |

Não há nenhuma tag `<video>`, então não há `autoplay/muted/playsinline/preload/poster` a auditar.

### Externos

- Leaflet CSS (render-blocking) e JS (`defer`) vindos de `unpkg.com`, sem `integrity` (`index.html:19-20`).
- Tiles do OpenStreetMap com subdomínios `{s}` (`map.js:18`).
- Fontes via fontsource: Bricolage 400/800 e Inter variable, todos os subsets (filtrados por `unicode-range`), sem `preload`.

---

## 6. Problemas encontrados

### 🔴 Alta

- **P-A1 — Pontos do mapa são placeholders em produção.** `map.js:24-29` tem "Local 1/2/3" com coordenadas fictícias e o popup leva ao WhatsApp citando esses nomes (`map.js:49-54`). Para um site "ativo e em uso real" (README), é conteúdo falso visível ao cliente.
- **P-A2 — Imagens de 4284×5712 no carrossel.** `PREDIO-SAO-CRISTOVAO.webp` (840 KB) e `PREDIO-300.webp` (920 KB) carregam sem `loading="lazy"` (`index.html:149, 153`) para uma exibição de no máximo ~950 px. Só o carrossel pesa ~2,2 MB e entra no `load`, que dispara o `ScrollTrigger.refresh` (`reveal.js:193`).
- **P-A3 — Cards do carrossel ficam gigantes no desktop.** `.clv-locais__card { min-width: 100%; aspect-ratio: 3/4 }` (`main.css:933-939`), sem limite de altura. Com o container de 1120 px menos as setas, cada card fica com ~950×1270 px, mais alto que qualquer viewport. Não há media query para isso.
- **P-A4 — Vídeo de 23 MB morto em `public/`.** `VIDEO-SOBRE.mp4` está versionado e vai para o `dist`/deploy sem ser usado. Infla o repositório e o upload.
- **P-A5 — Favicons 404.** `index.html:7-9` aponta para três arquivos inexistentes, o que gera erro em toda visita e deixa a aba sem ícone.

### 🟠 Média

- **P-M1 — Variáveis CSS inexistentes.** `var(--clv-font-display)` em `main.css:1359` (título dos cards de contato) e `main.css:1580` (título do overlay) faz esses títulos caírem em Inter em vez de Bricolage. `var(--clv-font-body)` em `main.css:1512` funciona por acaso (cai na herança). O correto é `--font-display` / `--font-body`.
- **P-M2 — Hover invisível no card claro de contato.** `.clv-contato__link:hover { color: #fff }` (`main.css:1392`) também vale para o `--light` (fundo `#F5F3FF`): contraste 1,1:1. Em repouso o link fica `#A373FF` sobre `#F5F3FF`, com 2,97:1, que reprova no AA.
- **P-M3 — Contraste insuficiente (WCAG AA 4,5:1 para texto pequeno):**
  - Labels e subtítulos dos overlays: `--clv-muted` sobre `#0a0a0a` = **3,51:1** (`main.css:1500, 1589, 1549`), texto a 0,7rem.
  - Placeholders: branco 25% sobre `#0a0a0a` = **2,14:1** (`main.css:1517`).
  - Rodapé: `#ffffff50` sobre `#14001E` = **2,68:1** (`main.css:1659`).
  - `.clv-sobre__origem-eyebrow`: `#ffffff60` = **3,4:1** (`main.css:743`).
  - `.clv-exp__item`: `#A373FF` sobre `#F5F3FF` = **2,97:1** (`main.css:475`). É texto grande, mas ainda fica abaixo de 3:1.
- **P-M4 — Scroll sem Lenis ignora a altura do menu.** Com reduced-motion, `scrollToTarget` usa `scrollIntoView` sem o offset de 80 px (`menu.js:96-102`), e o título da seção fica sob a barra fixa. Não existe `scroll-margin-top` nas seções.
- **P-M5 — `lenis.css` não importado.** Faltam `html.lenis{height:auto}`, `.lenis-stopped{overflow:hidden}` e o `overscroll-behavior: contain` em `[data-lenis-prevent]`. No iOS, com overlay aberto e `lenis.stop()`, a página por trás pode rolar ou dar bounce quando o painel interno chega ao fim.
- **P-M6 — Overlays sem semântica de diálogo.** Falta `role="dialog"`, `aria-modal`, `aria-labelledby`; o foco não vai para o overlay ao abrir nem volta ao gatilho ao fechar; não há focus trap; `<main>` não recebe `inert` (`index.html:616, 793`; `menu.js:129-174`). O mesmo vale para o painel mobile (sem `aria-controls`, e o `aria-label` "Abrir menu" nunca muda — `index.html:34`).
- **P-M7 — Leaflet bloqueia a renderização.** O CSS de `unpkg` no `<head>` (`index.html:19`) atrasa o first paint por causa de um mapa que está na 4ª seção. O JS (~40 KB) também sobe no load. Dá para carregar sob demanda (IntersectionObserver) e adicionar SRI.
- **P-M8 — Overlay sem ajuste mobile.** `.clv-overlay__panel { padding: 6rem 3rem }` (`menu.css:235`) não diminui no mobile. Em 375 px sobram ~279 px para o switcher (`.clv-form-overlay__switcher-btn` com `padding: 8px 24px`, `main.css:1617-1627`), e os dois botões ("Quero anunciar" / "Tenho um espaço") quebram linha ou espremem. O X fica em `left: 2rem` (`main.css:1595-1598`), colado no conteúdo.
- **P-M9 — Padding horizontal dobrado em Diferenciais.** `.clv-dif { padding: 5rem 1.5rem }` (`main.css:766`) + `.clv-shell { padding-inline: 24px }` resultam em 48 px por lado no mobile, diferente de todas as outras seções.
- **P-M10 — Marquee com "pulo" no loop.** `gap: 3rem` (`main.css:1132`) entre 16 itens: o `xPercent: -50` (`marcas.js:29-32`) desloca 8 itens + 7,5 gaps, então a emenda salta 1,5rem (0,75rem no mobile) a cada volta. Ou se usa `padding-right` igual ao gap em cada item, ou se anima em pixels a largura de meia trilha.
- **P-M11 — SEO técnico ausente.** Falta Open Graph/Twitter, `<link rel="canonical">`, `theme-color`, JSON-LD `LocalBusiness`, `robots.txt` e `sitemap.xml`. O `<title>` e a description (`index.html:11-15`) não citam "Lajeado" nem "elevador/condomínio", e a navegação é feita de `<button>` sem `href` (`index.html:44-48`), sem links rastreáveis.
- **P-M12 — Formulários e handlers quadruplicados.** Há 4 `<form>` (2 pares idênticos, `index.html:640, 701, 817, 877`) e 4 submits quase iguais em `contato.js:85-212`. Qualquer mudança de campo precisa ser feita em 4 lugares. O listener `clv:overlay-open` (`contato.js:26-34`) lê `e.detail.plano`, que `menu.js:68` nunca envia, ou seja, é caminho morto (a pré-seleção funciona só pelo rAF de `contato.js:45-48`).

### 🟡 Baixa

- **P-B1 — Código morto (JS):** `data/predios.js` inteiro; `motion.js:44-58` (`DIFERENCIAIS`, `PRODUTO`); `getMarcasRevealY()` sempre `null` + `MARCAS_TARGET = '.marcas__bar'` que nunca bate com `#marcas` (`marcas.js:14-16`, `menu.js:15, 77`); varredura de `[data-whatsapp-cta]` em `main.js:29-31` (nenhum elemento no HTML); `ScrollToPlugin` registrado e nunca usado (`gsap.js:9, 12`, peso extra no bundle); `gsap.set(menuEl, {y:0, clearProps})` vestigial (`menu.js:32`); atributos `data-marcas-intro/-headline/-subtitle` sem leitor (`index.html:292-295`); `[data-overlay]` em `GROUP` (`reveal.js:25`).
- **P-B2 — Mecanismo de pin sem pin.** `ignoreMobileResize` (`gsap.js:14-17`) e o refresh por `visualViewport` (`smooth-scroll.js:31-48`) existem para o pin de `.produto`, que foi removido. Hoje só disparam `refresh()` a cada toggle da toolbar do iOS.
- **P-B3 — Marquee roda fora da tela** (`marcas.js:26-32`), com dois tweens infinitos sem pausa por visibilidade.
- **P-B4 — `clip-path` animado** em todo reveal (`reveal.js:65-68`, `hero.js:79-81`, `menu.js:142, 160, 209, 232`) não é compositado na GPU e gera repaint a cada frame. Com muitos itens no mesmo batch (cards de planos, diferenciais) o custo soma. O burger anima `width/left` via `transition: 0.3s ease` em todas as propriedades (`menu.css:92, 104-109`), o que causa reflow. O `filter: grayscale` nos tiles (`main.css:1032-1034`) gera repaint ao arrastar o mapa.
- **P-B5 — Imagens sem `width`/`height`** em todos os `<img>`, risco de CLS (o logo do menu, os logos de marcas e os cards de locais não têm aspect-ratio reservado no primeiro paint).
- **P-B6 — Logos de marcas sem `loading="lazy"`** (32 `<img>`, `index.html:303-342`) numa seção abaixo da dobra.
- **P-B7 — Carrossel de locais:** sem swipe por toque, sem indicação de posição, sem `aria-live`; os botões não têm `type="button"` (`index.html:143, 162`); os alts "Residencial/Comercial/Hotéis" repetem o label visível (`index.html:149-157`).
- **P-B8 — Grupo de checkboxes sem `fieldset/legend`.** O `<label>` "Tenho interesse em" não tem `for` (`index.html:744, 920`). Inputs com `outline: none` (`main.css:1513`) deixam só a borda como indicador de foco.
- **P-B9 — Validação via `alert()`** e sem máscara de telefone (`contato.js:96, 123, 151, 190`). O `novalidate` desliga o feedback nativo.
- **P-B10 — Hierarquia/conteúdo:** a seção `#rede` não tem heading (`index.html:92-125`); números "25+ / 10+" duplicados entre Rede e Sobre (`index.html:97-101` × `207-212`); cards 03 e 04 de Diferenciais quase redundantes (`index.html:397-424`); ambientes repetidos em Rede (pílulas) e Locais (cards); `.marcas__subtitle` sem `data-reveal`, ao contrário do título (`index.html:295`).
- **P-B11 — Rodapé com "© 2025"** fixo (`index.html:608`); o README tem o link de produção vazio.
- **P-B12 — Faixa 860/861 px** (ver 4.2) e Diferenciais com breakpoint próprio de 720 px (`main.css:873`).
- **P-B13 — Comentários de seção fora de ordem** e comentários obsoletos citando overlays e pins que não existem (`menu.js:75-76, 127-128, 149, 154`; `gsap.js:14-16`; `smooth-scroll.js:31-34`).
- **P-B14 — `.clv-contato__card` com borda branca 8%** sobre fundo branco (`main.css:1327`) não aparece; `.clv-contato__col` usa bordas e fundos pensados para fundo escuro (só funciona porque o overlay é preto).

### Riscos mobile verificados sem problema

- Hero usa `100svh` (`main.css:322`); não há `100vh` no projeto.
- O texto fantasma `nowrap` do hero (`main.css:347`) é contido pelo `overflow: hidden` do hero.
- `.marcas` e as trilhas usam `overflow: hidden`, então o marquee não gera scroll horizontal.
- O header é `position: fixed` sem transform, então o painel mobile `inset: 0` cobre a tela corretamente.

---

## 7. Resumo final (contexto para colar)

```
PROJETO: Clave Mídia Indoor — LP one-page (Lajeado/RS), conversão via WhatsApp.
STACK: Vite 8 + HTML/CSS/JS vanilla + Tailwind v4 (só preflight/@theme, zero utilities)
 + GSAP 3.15 (ScrollTrigger, SplitText; ScrollToPlugin registrado sem uso) + Lenis 1.3
 + Leaflet 1.9.4 via unpkg. Fontes: Bricolage Grotesque 400/800 + Inter Variable (fontsource).
ARQUIVOS: index.html (tudo) · src/main.js (boot) · src/styles/main.css (1664 l, todas as seções)
 · src/components/menu/{menu.js,menu.css} (menu, burger, overlays, trava de scroll)
 · src/animations/{hero,reveal,number-roulette,marcas}.js · src/lib/{gsap,smooth-scroll,map,
 locais-carousel,contato,whatsapp}.js · src/constants/motion.js · src/data/predios.js (MORTO).
SEÇÕES (DOM): #hero · #rede (números/roleta) · #locais (carrossel 3 cards) · #mapa (Leaflet)
 · #sobre · #experiencia · #marcas (marquee 2 trilhas) · #diferenciais · #planos · #contato · footer.
OVERLAYS: só 2 — #overlay-form-anunciante e #overlay-form-espaco, cada um com 2 forms
 (switcher). Não existem overlays Sobre/Anuncie/Cobertura; restam comentários e código vestigiais.
MOTION: sem pin, sem scrub. Um único ScrollTrigger.batch (reveal.js, start "top 85%", once)
 dispara 4 variantes: data-reveal (clip+y+alpha 0.8 power3.out), "block" (+0.2s), "lines"
 (SplitText mask, 1.0 expo.out, stagger 0.2), data-roulette (fitas de dígitos 1.2 expo.out).
 Hero: SplitText + timeline no load. Marquee: xPercent infinito 22s/26s. Overlays/burger:
 clip-path via GSAP. Tokens em motion.js (DURATIONS sm/md/lg, EASE, REVEAL, HERO, ROULETTE);
 menu.js, marcas.js e smooth-scroll.js têm durações/eases hardcoded.
LENIS: smooth-scroll.js; lenis.on("scroll", ScrollTrigger.update) + gsap.ticker + lagSmoothing(0);
 desligado em prefers-reduced-motion; lenis.stop/start trava o scroll dos overlays; lenis.css NÃO importado.
CLEANUP: só clearProps pós-animação + once:true. Nenhum kill/revert/context/matchMedia.
CSS: paleta em :root (--clv-purple #811EC1, --clv-bg-dark #14001E, --clv-bg-soft, --clv-muted…);
 @theme tem --font-display/--font-body (usados) e --color-* (não usados). Breakpoints 640/720/860/861.
 Sem !important. Muito CSS morto (tagline, contato__switcher/forms, marcas__dots, hero__eyebrow).
PRIORIDADES:
 ALTA: pontos do mapa placeholder (map.js:24-29); imagens de locais 4284×5712 ~900KB sem lazy;
  card do carrossel 3:4 a 100% de largura (~1270px de altura no desktop); VIDEO-SOBRE.mp4 23MB
  sem uso no git/dist; favicons 404.
 MÉDIA: var(--clv-font-display) inexistente (main.css:1359,1580); hover branco no card claro de
  contato; contraste baixo (overlays 3.5:1, rodapé 2.7:1, placeholders 2.1:1); scrollIntoView sem
  offset de 80px em reduced-motion; overlays sem role=dialog/focus trap; Leaflet CSS render-blocking;
  padding do overlay não adapta ao mobile; padding duplo em Diferenciais; emenda do marquee pula
  meio gap; sem OG/canonical/JSON-LD; 4 forms + 4 submits duplicados.
 BAIXA: código morto (predios.js, motion DIFERENCIAIS/PRODUTO, getMarcasRevealY, data-whatsapp-cta,
  ScrollToPlugin), refresh de pin inexistente no iOS, marquee roda fora da tela, clip-path animado
  (repaint), imgs sem width/height, alert() na validação, © 2025.
```
