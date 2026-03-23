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

This is a **React 19 + TypeScript SPA** (personal portfolio + blog) deployed to GitHub Pages via GitHub Actions on push to `main`.

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
