# lifuyue.github.io

一个结合作品集、博客与视觉实验的个人网站，强调 editorial 叙事、动态编排和可维护的前端实现。

## 项目概览

这个仓库承载一个基于 React 19 + TypeScript 的单页应用。站点把项目展示、工作记录和交互实验放在同一套视觉系统里：作品页负责呈现案例与过程，博客使用 MDX 管理内容，首页与局部页面则通过 motion 和 3D 场景建立统一的空间感。

## 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- GSAP
- Lenis
- Three.js / React Three Fiber / Drei
- MDX
- GitHub Pages + GitHub Actions

## 页面与能力概览

- `Home`：站点入口，集中展示定位、视觉语言和核心信息。
- `Works` / `Work Detail`：项目列表与案例详情，内容来自 `src/data/projects.ts`。
- `Blog` / `Blog Post`：博客列表与文章详情，文章内容来自 `content/blog/*.mdx`。
- `NotFound`：未命中路由时的兜底页面。

## 本地开发

项目默认使用 `npm`。

```bash
npm ci
npm run dev
```

常用命令：

```bash
npm run dev
npm run build
npm run preview
```

说明：

- 首次开发或依赖缺失时先执行 `npm ci`。
- 当前仓库未配置 `lint` 或自动化测试脚本。
- `npm run build` 会执行 `tsc -b` 和 `vite build`，产物输出到 `dist/`。

## 内容维护

- 作品数据维护在 `src/data/projects.ts`。
- 博客文章维护在 `content/blog/*.mdx`。
- MDX 内容由 `src/lib/mdx.ts` 在构建时通过 `import.meta.glob` 加载。
- 博客 frontmatter 需要包含：
  - `title`
  - `date`
  - `description`
  - `tags`
  - `coverImage`

## 部署说明

- `.github/workflows/deploy.yml` 配置了 GitHub Pages 部署流程。
- push 到 `main` 分支时会自动触发构建和发布。
- workflow 使用 Node 22，构建成功后上传 `dist/` 作为 Pages artifact。
- `public/404.html` 用于 GitHub Pages 下的 SPA fallback，通过重定向把未知路径送回根路由。

## 目录速览

```text
src/
  components/   可复用 UI、布局、博客组件和 Three 场景
  data/         作品、技能、社交链接等静态数据
  hooks/        主题、滚动、鼠标位置等交互 hooks
  lib/          MDX 加载与通用工具
  pages/        路由级页面组件
  styles/       全局样式与主题 token
  types/        TypeScript 类型定义
content/
  blog/         MDX 博客文章
public/
  404.html      GitHub Pages SPA fallback
.github/
  workflows/    部署工作流
```

## 维护提示

- 新增项目时，优先保持现有作品数据结构和页面叙事节奏一致。
- 新增博客时，优先遵守既有 frontmatter 字段和 MDX 内容组织方式。
- 涉及路由、博客渲染或部署的修改，建议同步核对 `src/App.tsx`、`src/lib/mdx.ts` 和 `.github/workflows/deploy.yml`。
