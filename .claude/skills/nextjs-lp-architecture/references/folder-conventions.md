# Folder conventions — deep dive

Read this when deciding where a file goes or when a section grows complex.

## `app/`
App Router only: `layout.tsx`, `page.tsx`, route folders, `globals.css`,
`route.ts`, `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`. Pages compose
sections; per-route `metadata` lives in that route's `page.tsx`/`layout.tsx`.
Remember: this Next version has breaking changes — verify APIs against
`node_modules/next/dist/docs/` rather than memory.

## `components/sections/`
Page bands: `Hero`, `Services`, `Benefits`, `About`, `Testimonials`, `CTA`,
`FAQ`, `Footer`. Default export, PascalCase. If a section animates or needs
browser APIs, split it: `Hero.tsx` (Server, reads `/data`) + `HeroClient.tsx`
(`"use client"`, owns the ref + `useGsap`). Keeps the server tree large.

## `components/ui/`
Reusable primitives, default export, styled with `cn()` and accepting `className`:
- `Button` — variants `primary` (`bg-amber text-bg`) / `ghost` (`border-fg/20`), `rounded-full`.
- `Container` — `mx-auto max-w-6xl px-6 md:px-12`.
- `Section` — `py-24 md:py-32`, takes `id` for anchor nav and `ref` (React 19) so
  animated sections scope GSAP directly on `<section>`, no wrapper div.

## `animations/`
Pure GSAP functions, no JSX/React. Two entrance patterns:
- `heroReveal(scope)` — immediate, above-the-fold, reduced-motion guarded.
- `reveal(targets, trigger?)` — on-scroll via ScrollTrigger (`top 85%`).
- `parallax(target, speed)` — scrubbed parallax.
Mark targets with `data-reveal`; run from a component via `useGsap`.

## `constants/`
Runtime-fixed, non-content values: `site.ts` (name, url, default OG, nav links),
z-index scale, animation eases/durations. No secrets (use env vars).

## `data/`
Editable page **content**, typed against `/types`, named exports (`export const
services`). Render by mapping. CMS later → only these files change; components keep
consuming the same types.

## `hooks/`
Reusable client logic, `useX.ts`: `useGsap` (scoped GSAP via isomorphic layout
effect), `useLenis` (reads `LenisContext`), `useMediaQuery`, etc.

## `lib/`
Framework-agnostic: `utils.ts` (`cn`), `fonts.ts` (next/font), `analytics.ts`,
`fetcher.ts`. No React components.

## `providers/`
Client context providers wrapping the tree in `layout.tsx`. `SmoothScroll.tsx`
sets up Lenis, syncs GSAP ScrollTrigger, and exposes the instance via
`LenisContext` (consumed by `useLenis`).

## `types/`
`index.ts` barrel — content shapes (`Service`, `FaqItem`, `NavLink`,
`HeroContent`, `Plan`, `Testimonial`) and shared prop contracts. Import from
`@/types`. Keep truly local prop types inside their component file.

## Server vs client
Default to Server Component. Add `"use client"` only when the file uses a hook,
GSAP/Lenis, `window`/`document`, or event handlers. Keep client components small
and at the leaves (the `XClient.tsx` pattern).

## Quick "where does it go?" table
| Thing | Folder |
|-------|--------|
| A page band (hero, pricing) | `components/sections/` |
| A reusable button/container | `components/ui/` |
| The text/list shown in a section | `data/` (+ shape in `types/index.ts`) |
| A reusable GSAP timeline | `animations/` |
| `cn`, fonts, analytics | `lib/` |
| Smooth-scroll wrapper | `providers/SmoothScroll.tsx` |
| `useGsap`, `useLenis` | `hooks/` |
| Nav links, site name/url | `constants/site.ts` |
| A shared TS interface | `types/index.ts` |
