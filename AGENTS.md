# AGENTS.md

本文件面向在此仓库内工作的代码代理与协作者，目标是让改动尽快对齐当前项目的结构、风格与交付方式。

## 仓库简介

这是一个基于 React 19 + TypeScript + Vite 的个人 portfolio / blog 单页应用，部署目标是 GitHub Pages。站点把作品集、博客和视觉实验组织在一套统一的 editorial 视觉语言里，重点不是通用模板，而是有节奏的内容呈现、动效编排和适度的 3D 表达。

## 开发命令

项目默认使用 `npm`。

```bash
npm ci
npm run dev
npm run build
npm run preview
```

约定：

- 首次进入仓库或依赖缺失时，先运行 `npm ci`。
- `npm run build` 会执行 `tsc -b && vite build`，产物输出到 `dist/`。
- 当前仓库未配置 lint 命令，也未配置自动化测试命令。

## 架构与目录

- `src/App.tsx`：路由定义入口，包含首页、作品、博客和兜底页。
- `src/pages`：路由级页面组件，如 `Home`、`Works`、`WorkDetail`、`Blog`、`BlogPost`、`NotFound`。
- `src/components/ui`：通用 UI 组件，如按钮、卡片、标题、加载与光标效果。
- `src/components/layout`：导航、页脚、滚动包装器、页面转场等布局能力。
- `src/components/blog`：博客列表、卡片、MDX 渲染相关组件。
- `src/components/three`：R3F / Drei 场景与视觉实验组件。
- `src/data`：静态内容数据，项目、技能、社交链接等通常在这里维护。
- `content/blog`：MDX 博客文章目录。
- `src/lib/mdx.ts`：构建时加载博客文章并生成文章索引。
- `src/styles/globals.css`：全局样式、主题 token 和基础视觉规则入口。
- `.github/workflows/deploy.yml`：GitHub Pages 部署工作流。

## 视觉与实现约束

- 保持现有 `editorial`、`kinetic`、`precise` 的整体方向，不要把页面改成常见 SaaS 模板风格。
- 保持深色主基调、定制字体、较强的排版层级和节奏化留白。
- 动效优先复用现有 Framer Motion、GSAP、Lenis 和 Three/R3F 组合，不为小改动引入新的动画依赖。
- UI 结构优先复用已有组件和模式，例如 `GlassCard`、`SectionHeading`、`MagneticButton`、布局壳层和现有 hooks。
- 只有在现有模式明显不够用时才扩展新抽象，避免为了“更通用”而做不必要重构。

## 内容维护约定

- 新项目优先修改 `src/data/projects.ts`。
- 新博客文章放在 `content/blog/<slug>.mdx`。
- 博客 frontmatter 至少包含以下字段：
  - `title`
  - `date`
  - `description`
  - `tags`
  - `coverImage`
- 这些 frontmatter 约束以 `src/types/blog.ts` 和 `src/lib/mdx.ts` 的当前实现为准。

## 变更前后检查

- 涉及路由或页面入口时，同步核对 `src/App.tsx`。
- 涉及博客加载、frontmatter 或文章渲染时，同步核对 `src/lib/mdx.ts` 和 `src/types/blog.ts`。
- 涉及主题、颜色或字体时，同步核对 `src/styles/globals.css` 与 `tailwind.config.ts`。
- 涉及 GitHub Pages 行为时，同步核对 `.github/workflows/deploy.yml` 和 `public/404.html`。
- 提交前至少运行一次 `npm run build`；若本地没有依赖，先执行 `npm ci`。

## 工作边界

- 这是一个前端展示型站点，优先最小化改动范围，不要顺手引入与任务无关的结构性重写。
- 当前仓库没有测试框架；验证以构建通过、主要页面路径可访问、内容约定未被破坏为主。
- 如果发现 `CLAUDE.md`、`README.md` 或本文件之间存在重复说明，优先保持事实一致，再做最小必要更新。
