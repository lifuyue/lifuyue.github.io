import type { Project, ProjectCategory } from '@/types/project';

export const projectCategories: ProjectCategory[] = [
  'All',
  'Experience',
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
    cover: 'var(--tmo-cover-background)',
    accent: 'slate',
    metrics: [
      { label: 'Client Surface', value: 'WeChat + Alipay' },
      { label: 'Runtime Services', value: '5 services' },
      { label: 'API Entry', value: '1 gateway' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/teamdsb/tmo' },
      { label: 'Blog 复盘', href: '/blog/tmo-retrospective' },
    ],
  },
  {
    slug: 'suanxian',
    title: 'SUANXIAN',
    category: 'Experience',
    year: '2026',
    description:
      '面向生鲜配送的 B2B/B2C 业务中台，两周内独立交付微信小程序、管理后台与后端 API，覆盖报价→下单→备货→配送→结算全链路。',
    longDescription: [
      'FreshFlow 是一套面向 B2B/B2C 生鲜订货、采购、库存与配送的业务中台。核心目标是把"报价 → 下单 → 备货 → 出库 → 配送 → 结算/对账"的业务闭环落地在一个统一的领域模型里，涵盖管理端（运营、客服、采购、仓储、财务）、微信小程序（客户下单、供应商协同、司机配送）与 Django 后端三个子系统。',
      '采用 SDD（规格驱动开发），以 Markdown 规格文档预先锁定接口契约与模块边界，约束 Coding Agent 在既定规格内实现功能、防止生成跑偏。引入 Celery 异步任务队列处理订单超时取消与库存回滚，将耗时操作从主线程剥离，Django 主服务与 Celery Worker 分离部署，消除阻塞与超卖风险。',
      '以可视化数据看板替代人工 Excel 对账，客户原需三名财务专职处理的日常统计工作实现全自动化。项目最终在两周内完成交付，页面规模达数十屏，涵盖多角色权限体系。',
    ],
    tags: ['Django', 'Celery', 'UniApp', 'Vue3', 'MySQL', 'Docker'],
    cover: 'var(--suanxian-cover-background)',
    accent: 'teal',
    metrics: [
      { label: 'Delivery', value: '2 weeks' },
      { label: 'Surfaces', value: '小程序 + 管理后台 + API' },
      { label: 'Scale', value: '数十屏 · 多角色权限' },
    ],
    links: [{ label: 'Blog 复盘', href: '/blog/suanxian-retrospective' }],
  },
];
