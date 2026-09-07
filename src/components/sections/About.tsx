import { motion, useReducedMotion } from 'framer-motion';

export function About() {
  const reduced = useReducedMotion();
  return (
    <section id="about" className="reset-section about-section">
      <div className="section-meta"><span>01 / A little about me</span><span>厦门大学 · 软件工程</span></div>
      <div className="about-intro">
        <motion.h2 initial={reduced ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>Curiosity first.<br /><span>Then, make it real.</span></motion.h2>
        <p>我是 李富悦，厦大软件工程在读。日常做的事情是用 Coding Agent 搭建产品——从想法到可以交付的东西，前端、后端、工作流我都自己来。这个站点是我的作品集，也是我边做边想的记录。</p>
      </div>
      <div className="about-grid">
        <figure className="portrait-frame"><img src="/images/about-portrait.jpg" alt="李富悦" loading="lazy" /><figcaption><span>Life outside the editor.</span><span>↗</span></figcaption></figure>
        <div className="about-copy">
          <p className="about-lead">我是一名软件工程师，<br />专注于 web 全栈开发和 AI Agent 设计。</p>
          <p>我的工作和兴趣横跨全栈开发、AI Agent 工作流、产品原型与交互设计。我喜欢研究系统在约束下如何运转、Agent 怎样才能可靠地交付、以及界面怎样做到让人觉得“本该如此”——而不只是“能用”。</p>
          <p>最近持续在做一件事：把 AI agent 真正压进开发链路——harness 怎么搭、context 怎么管、prompt 怎么约束边界。从 vibe coding 开始探索，最终想搞清楚的是：人和 agent 协同开发的边界在哪里，以及怎么把这条边界往外推。</p>
          <div className="about-principles"><div><span className="index-label">Approach</span><p>Spec → Implement → Ship.<br />Repeat.</p></div><div><span className="index-label">Bias</span><p>Would rather go deep into<br />how things truly cook.</p></div></div>
        </div>
      </div>
      <p className="current-mode"><span className="index-label">Current mode</span> Studying · Vibe Coding · Exploring the Edge</p>

    </section>
  );
}
