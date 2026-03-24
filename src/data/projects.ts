import type { Project, ProjectCategory } from '@/types/project';

export const projectCategories: ProjectCategory[] = [
  'All',
  'Experience',
  'Creative Coding',
  'Frontend',
  'Writing',
];

export const projects: Project[] = [
  {
    slug: 'tmo',
    title: 'TMO',
    category: 'Experience',
    year: '2026',
    description:
      '面向工业采购场景的一体化系统，把商品目录、意向下单、业务员归属与售后协作收束到同一条业务链路。',
    longDescription: [
      'TMO 不是把工业采购简单地翻译成“电商前台”，而是围绕真实成交流程重组交互：客户先浏览目录、搜索商品、提交意向订单；找不到货时可以发起需求收集；业务员通过二维码绑定客户归属，售后入口则把问题反馈与后续跟进继续留在系统里。',
      '在架构上，我把它组织成一个多端一致、服务边界清晰的平台。前端是基于 Taro + React 的小程序应用，覆盖 WeChat 与 Alipay；后端通过 gateway-bff 对外暴露单一入口，再把 commerce、identity、payment 与 AI 服务编排在同一套联调路径上，让目录、鉴权、支付和 AI 售后建议可以按域独立演进。',
      '我也把大量运营型工作流直接纳入交付范围，包括 Excel 商品导入、需求清单导出、运单与批量处理能力，以及本地 Docker 栈、HTTP smoke 和 miniapp E2E 组成的协作验证链路。这样它既是一个可演示的产品系统，也是一个能持续推进的工程工作台。',
    ],
    tags: ['Taro', 'React', 'TypeScript', 'Go', 'OpenAPI', 'AI'],
    cover:
      'linear-gradient(135deg, rgba(100,116,139,0.9), rgba(15,23,42,0.96) 48%, rgba(8,145,178,0.42))',
    accent: 'slate',
    metrics: [
      { label: 'Client Surface', value: 'WeChat + Alipay' },
      { label: 'Runtime Services', value: '5 services' },
      { label: 'API Entry', value: '1 gateway' },
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/teamdsb/tmo' }],
  },
  {
    slug: 'signal-room',
    title: 'Signal Room',
    category: 'Experience',
    year: '2026',
    description: '为产品叙事打造的沉浸式发布体验，结合滚动编排、空间声像与实时数据层。',
    longDescription: [
      'Signal Room 是一个将品牌叙事、实时产品信号与沉浸式视觉语言融合在一起的 web experience。整个信息结构围绕“波形”展开，从首页的粒子脉冲，到详情页的时间轴和数据卡片，都用统一的运动语法来组织。',
      '我重点处理了滚动节奏、页面切换与内容密度之间的平衡，确保它既有展览感，又不会牺牲信息可读性。',
    ],
    tags: ['React', 'Framer Motion', 'R3F', 'GSAP'],
    cover: 'linear-gradient(135deg, rgba(245,158,11,0.85), rgba(15,23,42,0.92))',
    accent: 'amber',
    metrics: [
      { label: 'Build Window', value: '4 weeks' },
      { label: 'Motion States', value: '28+' },
      { label: 'Perf Budget', value: '92 Lighthouse' },
    ],
    links: [{ label: 'Case Study', href: '#' }],
  },
  {
    slug: 'tidal-notes',
    title: 'Tidal Notes',
    category: 'Frontend',
    year: '2025',
    description: '面向知识工作者的 editorial dashboard，用模块化布局表现碎片信息的秩序感。',
    longDescription: [
      '这个项目聚焦于阅读与记录的过渡体验：信息卡片像贴在墙上的便签，但交互逻辑保持极简。',
      '视觉上我用浅暖金属色和清晰的排版层级，让工具感与内容感同时成立。',
    ],
    tags: ['TypeScript', 'Tailwind', 'MDX'],
    cover: 'linear-gradient(135deg, rgba(45,212,191,0.78), rgba(8,47,73,0.94))',
    accent: 'teal',
    metrics: [
      { label: 'Components', value: '42' },
      { label: 'Content Blocks', value: '12 types' },
      { label: 'Release', value: 'v1 shipped' },
    ],
    links: [{ label: 'Live Preview', href: '#' }],
  },
  {
    slug: 'after-image',
    title: 'After Image',
    category: 'Creative Coding',
    year: '2025',
    description: '一个基于粒子和几何失真的视觉实验，把指针轨迹变成可积累的空间残影。',
    longDescription: [
      'After Image 起点是一段简单的鼠标轨迹采样，最终演化成一个粒子场系统。它使用低成本几何体和材质扭曲，制造出“延迟反馈”的感受。',
      '这个实验直接影响了本站首页 Hero 的视觉语言。',
    ],
    tags: ['Three.js', 'Shaders', 'Interaction'],
    cover: 'linear-gradient(135deg, rgba(59,130,246,0.8), rgba(17,24,39,0.95))',
    accent: 'blue',
    metrics: [
      { label: 'Particles', value: '3.5k' },
      { label: 'FPS', value: '60 target' },
      { label: 'Input Modes', value: 'Mouse + Touch' },
    ],
    links: [{ label: 'Prototype', href: '#' }],
  },
  {
    slug: 'field-notes',
    title: 'Field Notes',
    category: 'Writing',
    year: '2024',
    description: '把产品观察、视觉拆解和工程实践整理成一套可持续更新的公开写作系统。',
    longDescription: [
      'Field Notes 是一套写作与发布机制。我把前端实现、内容模板和标签检索整合在一起，让写作与站点本身形成反馈循环。',
      '本站博客区域就是基于这套结构重新构建的。',
    ],
    tags: ['MDX', 'Content System', 'Editorial Design'],
    cover: 'linear-gradient(135deg, rgba(251,191,36,0.7), rgba(63,63,70,0.92))',
    accent: 'gold',
    metrics: [
      { label: 'Posts', value: '20+' },
      { label: 'Tags', value: '9 clusters' },
      { label: 'Workflow', value: 'Git-based' },
    ],
    links: [{ label: 'Read Articles', href: '/blog' }],
  },
];
