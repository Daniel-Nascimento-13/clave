---
name: nextjs-lp-architecture
description: >-
  The Pixel Code standard architecture for building Next.js landing pages and
  websites. Use this whenever creating a NEW landing page or site, scaffolding a
  project, adding a section/component, deciding where a file goes, or wiring up
  the stack (Tailwind v4, GSAP, Lenis, content). Trigger this for ANY Next.js LP
  work even if the user doesn't name the skill — e.g. "cria uma LP de captura",
  "monta a estrutura do projeto", "adiciona uma seção de pricing", "onde coloco
  esse hook", "configura o smooth scroll". This skill defines folder conventions,
  naming, the cn() utility, the GSAP+Lenis providers, typed content in /data, and
  the App Router patterns so every project comes out consistent and production-ready.
---

# Pixel Code — Next.js Landing Page Architecture

The standard for all Pixel Code LPs and sites. Mirror it so every project is
consistent and production-ready. Keep brand values (copy, specific tokens) as
placeholders — never bake one project's content into the convention.

## READ FIRST — before writing any code

1. **This Next.js has breaking changes vs. training data.** If the project ships
   `docs/AGENTS.md` / `docs/CLAUDE.md`, read them first — they are the source of
   truth. The starter explicitly instructs: consult the bundled guides in
   `node_modules/next/dist/docs/` before writing App Router code, and heed
   deprecation notices. Do not assume APIs from memory.
2. **Map the project before scaffolding.** List `src/`, read the existing
   primitives (`lib/utils.ts`, `providers/`, `components/ui/`, `globals.css`,
   `types/index.ts`). Adapt to what exists; never blindly copy assets over files
   that already define the convention.

## Pinned stack

| Tool | Version | Role |
|------|---------|------|
| Next.js | 16.x (App Router) | Framework, routing, metadata, SSR/SSG |
| React | 19.x | UI |
| TypeScript | 5.x | Types |
| Tailwind | v4 (CSS-first) | Styling — config in `globals.css` via `@theme`, **no `tailwind.config.js`** |
| GSAP | 3.15 | Animation (ScrollTrigger + all plugins free in 3.13+) |
| Lenis | 1.3 | Smooth scroll, synced to GSAP ScrollTrigger |
| clsx + tailwind-merge | — | The `cn()` helper |

Path alias: `@/*` → `./src/*`. Always import with `@/`.

## Folder map (`src/`)

```
src/
├── app/                  # Routes, layout, page, metadata, globals.css (App Router)
├── components/
│   ├── sections/         # Page bands: Hero, Services, Benefits, CTA, FAQ, Footer…
│   └── ui/               # Primitives: Button, Container, Section…
├── animations/           # Pure GSAP functions (no JSX): reveal, parallax, hero…
├── constants/            # Fixed values: site.ts (name/url/nav), z-index, eases
├── data/                 # Typed page CONTENT (hero, services, faq…) — named exports
├── hooks/                # useGsap, useLenis, useMediaQuery…
├── lib/                  # utils.ts (cn), fonts.ts, analytics… (framework-agnostic)
├── providers/            # SmoothScroll (Lenis + context), ThemeProvider…
└── types/                # index.ts barrel — Service, FaqItem, NavLink, HeroContent…
```

Deep dive + "where does it go?" table: `references/folder-conventions.md`.

## Naming conventions

- **Sections / UI / providers**: `PascalCase.tsx`, **default export** (`Button.tsx` →
  `export default function Button`). Sections that animate split into a Server
  component (`Hero.tsx`) + a client child (`HeroClient.tsx`).
- **Hooks**: `useThing.ts` — `useGsap.ts`, `useLenis.ts`.
- **utils / data / types / constants / animations**: lowercase/kebab — `utils.ts`,
  `hero.ts`, `index.ts`, `reveal.ts`. Data/animation files use **named exports**.

## Design tokens (real starter)

Defined in `globals.css` `@theme`. Dark theme by default:

- Colors: `--color-bg #0a0a0f`, `--color-fg #ededed`, `--color-amber #f59e0b`,
  `--color-violet #7c3aed` → utilities `bg-bg text-fg bg-amber text-violet`, plus
  alpha like `text-fg/60`, `border-fg/20`.
- Fonts: `--font-display` (Space Grotesk), `--font-mono` (JetBrains Mono), loaded
  via `lib/fonts.ts` (`next/font/google`) and applied on `<html>` in `layout.tsx`.
- Brand gradient: utilities `.gradient-brand` (bg) and `.text-gradient-brand`
  (clipped text), amber→violet. Use these for highlighted words in headlines.

When starting a fresh project, replace token values; keep the token *names* so
components stay portable.

## Core building blocks

Ready files live in `assets/` mirroring `src/`. Copy any that are missing; if a
file already exists in the project, keep the project's version.

- `lib/utils.ts` — `cn()` (clsx + tailwind-merge). Compose all classes with it.
- `lib/fonts.ts` — Space Grotesk + JetBrains Mono as CSS-variable fonts.
- `providers/SmoothScroll.tsx` — Lenis (`{ duration: 1.2, smoothWheel: true }`),
  drives `gsap.ticker`, syncs `ScrollTrigger.update`, and exposes the instance via
  `LenisContext`. Mount once in `layout.tsx`.
- `hooks/useLenis.ts` — reads `LenisContext` to access the Lenis instance.
- `hooks/useGsap.ts` — scoped `gsap.context()` with cleanup, run through an
  **isomorphic layout effect** (prevents FOUC above the fold; SSR-safe).
- `components/ui/` — `Button` (`primary` / `ghost`, `rounded-full`), `Container`
  (`max-w-6xl px-6 md:px-12`), `Section` (`py-24 md:py-32`, `id` for anchors,
  and **accepts `ref`** so animated sections scope GSAP directly on `<section>`
  without a wrapper `<div>` — React 19 treats `ref` as a normal prop).

## App Router patterns

- `app/layout.tsx`: `<html lang="pt-BR">` with `cn(fontDisplay.variable,
  fontMono.variable)`, `<body className="bg-bg text-fg antialiased">`, wrap children
  in `<SmoothScroll>`, export root `metadata`. Import `./globals.css`.
- `app/page.tsx`: composes sections only.
- **Metadata**: every route exports a typed `Metadata` (title, description,
  `openGraph`, canonical). Never hand-write `<meta>` tags.
- **Server by default**: sections are Server Components. Add `"use client"` only
  when a file uses hooks, GSAP, or browser APIs. Animated sections use the
  Server (`X.tsx`) + Client (`XClient.tsx`) split so most of the tree stays
  server-rendered — better SEO/TTFB.

## Content convention — typed `/data`

Copy is data, not hardcoded JSX. Shape in `/types` (barrel `index.ts`), values in
`/data` (named export), render by mapping.

```ts
// src/types/index.ts
export interface Service { title: string; description: string; icon?: string }
// src/data/services.ts
import type { Service } from "@/types";
export const services: Service[] = [{ title: "Performance", description: "…" }];
```

## Animation convention — `/animations`

Pure functions, no JSX. There are **two entrance patterns** — pick by position:

| Function | Signature | Trigger | Use for |
|----------|-----------|---------|---------|
| `heroReveal` | `(scope: HTMLElement)` | Immediate on mount | Above-the-fold (hero) — already visible on load |
| `reveal` | `(targets, trigger?)` | ScrollTrigger `top 85%` | Any section below the fold — animates on scroll-in |
| `parallax` | `(target, speed = 0.3)` | ScrollTrigger `scrub` | Parallax layers |

Mark animated elements with `data-reveal`. Run animations through `useGsap`, with
the ref on the `<section>` (or `Section`, which accepts `ref`).

```tsx
// Above the fold (hero): immediate
const scope = useGsap<HTMLElement>(() => heroReveal(scope.current!));
return <section ref={scope}>…<h1 data-reveal>…</h1></section>;
```

```tsx
// Below the fold (e.g. Pricing): on-scroll via ScrollTrigger
const scope = useGsap<HTMLElement>(() => {
  const el = scope.current!;
  reveal(Array.from(el.querySelectorAll("[data-reveal]")), el);
});
return (
  <Section id="pricing" ref={scope}>
    <div data-reveal>…</div>
  </Section>
);
```

**Accessibility note**: `heroReveal` already guards with
`gsap.matchMedia("(prefers-reduced-motion: no-preference)")`. `reveal` and
`parallax` currently don't — for reduced-motion users, prefer wrapping their
calls (or the animation body) in the same `matchMedia` guard so motion-sensitive
visitors get the static, visible state.

See `assets/components/sections/Hero.tsx` + `HeroClient.tsx` for the full pattern.

## Scaffolding a NEW landing page

1. Read `docs/AGENTS.md`/`CLAUDE.md` and the Next docs in `node_modules/next/dist/docs/`.
2. Map `src/`; ensure primitives exist (`utils`, `fonts`, `SmoothScroll`,
   `useLenis`, `useGsap`, `ui/*`, `globals.css`). Copy missing ones from `assets/`.
3. Set brand tokens in `globals.css` `@theme`.
4. Define content types in `types/index.ts`; fill `/data` (named exports).
5. Build sections in `components/sections/` (Server, with `XClient.tsx` only where
   animation/interactivity is needed), reading `/data`, styling with `cn()`.
6. Compose in `app/page.tsx`; export page-level `metadata`.
7. Add reusable motion in `/animations` (scoped + matchMedia), wire via `useGsap`.
