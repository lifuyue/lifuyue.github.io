# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # tsc + vite build → dist/
npm run preview   # Preview production build locally
```

No linting or test commands are configured.

## Architecture

This is a **React 19 + TypeScript SPA** (personal portfolio + blog) deployed to GitHub Pages via a manually dispatched GitHub Actions workflow (`workflow_dispatch`, not on push).

### Key tech
- **Routing**: React Router DOM v7, routes defined in `src/App.tsx`
- **Styling**: Tailwind CSS v3 with custom CSS variable–based color tokens (see `src/styles/globals.css`) and custom fonts (Fraunces display, Manrope sans)
- **Animation**: Framer Motion (page transitions, UI), GSAP, Lenis (smooth scroll via `src/hooks/useLenis.ts`)
- **3D**: Three.js + React Three Fiber + Drei (`src/components/three/`)
- **Content**: MDX blog posts in `content/blog/`, processed by `@mdx-js/rollup` with remark frontmatter; utilities in `src/lib/mdx.ts`
- **Path alias**: `@/` → `src/`

### Directory layout

```
src/
  components/
    ui/        # Reusable UI (cursor, buttons, cards…)
    layout/    # Navbar, Footer, SmoothScroll wrapper
    sections/  # Page sections (Hero, About, Skills, Contact)
    blog/      # Blog list/card/MDX renderer components
    three/     # R3F scenes (HeroScene, FloatingGeometry, ParticleField)
  pages/       # Route-level components (Home, Works, Blog, BlogPost, WorkDetail, NotFound)
  hooks/       # useMousePosition, useLenis, useScrollAnimation, useTheme
  lib/         # mdx.ts (content loading), utils.ts (clsx wrapper)
  data/        # Static content: projects.ts, skills.ts, socials.ts
  types/       # TypeScript interfaces (project.ts, blog.ts, mdx.d.ts)
  styles/      # globals.css — Tailwind base + CSS variable theme tokens
content/
  blog/        # *.mdx posts with YAML frontmatter
public/
  404.html     # SPA fallback (sessionStorage redirect for GitHub Pages)
```

### Theme system
Colors are defined as CSS custom properties (`--color-background`, `--color-foreground`, `--color-surface`, `--color-accent`, `--color-teal`) in `src/styles/globals.css`. Dark/light mode toggled via CSS class on `<html>`, managed by `useTheme` hook. Tailwind references these via `rgb(var(--color-*) / <alpha>)` syntax in `tailwind.config.ts`.

### Blog content
Add new posts as `content/blog/<slug>.mdx` with frontmatter fields defined in `src/types/blog.ts`. The MDX loader in `src/lib/mdx.ts` reads and processes these at build time via Vite's import.meta.glob.

## Conventions

Non-obvious patterns that require reading multiple files to discover:

- **Class merging**: Use `cn()` from `src/lib/utils.ts` (wraps `clsx` + `tailwind-merge`) for all conditional class composition. The same file exports `formatDate()` using `zh-CN` locale.
- **CSS color tokens**: Defined as raw RGB triplets (e.g., `--background: 7 8 14`, not `rgb()`), enabling Tailwind's `rgb(var(--color-*) / <alpha>)` alpha syntax. Adding new colors requires updating both `globals.css` and `tailwind.config.ts`.
- **Two theme hooks**: `useTheme` (`src/hooks/useTheme.ts`) for full read/write/persist management; `useCurrentTheme` (`src/hooks/useCurrentTheme.ts`) for read-only MutationObserver-based observation. Three.js components use the latter to avoid coupling to theme state management.
- **SVG imports**: SVGs are imported as raw strings via Vite's `?raw` suffix and rendered via `InlineSvg` component — not as React components.
- **Exports**: All components use named exports except `HeroScene`, which uses `export default` because it is lazy-loaded via `React.lazy`.
- **Page transitions**: `AnimatePresence mode="wait"` in `src/App.tsx` with a `clipPath` reveal in `PageTransition`; shared easing `[0.22, 1, 0.36, 1]`, 0.8s. Both `PageTransition` and `useScrollAnimation` respect `prefers-reduced-motion`.
- **Hero animation**: The draggable agent cards in the Hero section use a canvas-based physics simulation (`requestAnimationFrame` + custom spring/repulsion) — distinct from Framer Motion used elsewhere on the page.
- **Three.js is lazy-loaded**: `HeroScene` is wrapped in `React.lazy` + `<Suspense fallback={null}>` to keep it out of the initial bundle.
- **Resume route**: `/resume` disables all chrome (navbar, footer, cursor, smooth scroll, loading screen) and applies a `resume-mode` CSS class on `<html>` for a clean printable layout.
- **Loading screen**: Shown once per session via `sessionStorage` key `lifuyue-loading-screen`; uses a GSAP timeline (not Framer Motion).
- **Project covers**: The `cover` field in `src/data/projects.ts` is a CSS `background` value (gradient string or CSS variable reference), not an image URL.
- **SPA routing on GitHub Pages**: `public/404.html` saves the original path to `sessionStorage.redirect`; an inline script in `index.html` restores it via `history.replaceState`.
