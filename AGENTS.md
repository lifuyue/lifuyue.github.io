# AGENTS.md
## 仓库简介

这是一个基于 React 19 + TypeScript + Vite 的个人 portfolio / blog 单页应用，部署目标是 GitHub Pages。站点采用统一的 editorial 视觉语言来组织个人介绍、作品集、博客与视觉实验，核心是有节奏的内容呈现、动效编排和适度的 3D 表达。

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
 ## 解释代码
Use plain language over jargon, and reference technical details only to the degree that it helps illustrate an idea or your work to the user. Communicate complex concepts in a clear and cohesive manner, and calibrate your writing to the level of background knowledge assumed from the user's prompt and context.
## 测试
Do not write tests for reversible, low-impact changes that mirror the implementation. If you do choose to verify your work with tests, make sure that the tests are meaningful and necessary to verify implementation.

Run tests appropriate to the change and complete required checks. Once those pass, broaden or repeat testing only when new changes, failures, or unresolved concerns justify it; otherwise, continue toward completing the task.
## 