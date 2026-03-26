import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function About() {
  const [isPortraitAvailable, setIsPortraitAvailable] = useState(true);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [50, -60]);
  const animation = useScrollAnimation(0.1);

  return (
    <section className="section-shell section-space relative">
      <SectionHeading
        eyebrow="About"
        title="Who I am, briefly."
        description="我是一名软件工程师，专注于 web 全栈开发和 AI Agent 设计。"
      />
      <div className="grid gap-8 lg:grid-cols-[1fr,1.4fr]">
        <motion.div style={{ y }} className="relative">
          <div className="relative overflow-hidden rounded-[1.5rem]">
            <div className="about-image-gradient aspect-[4/5]" />
            {isPortraitAvailable ? (
              <img
                src="/images/about-portrait.jpg"
                alt="Li Fuyue"
                className="absolute inset-0 h-full w-full object-cover"
                onError={() => setIsPortraitAvailable(false)}
              />
            ) : null}
            <div className="absolute bottom-10 left-10 rounded-full border border-line/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-foreground/70">
              Xiamen / Remote
            </div>
          </div>
        </motion.div>
        <motion.div {...animation} className="grid gap-6 pt-2 text-base leading-8 text-foreground/70 lg:pt-0">
          <p>
            我的工作和兴趣横跨全栈开发、AI Agent 工作流、产品原型与交互设计。我喜欢研究系统在约束下如何运转、Agent 怎样才能可靠地交付、以及界面怎样做到让人觉得"本该如此"——而不只是"能用"。
          </p>
          <p>
            最近持续在做一件事：把 AI agent 真正压进开发链路——harness 怎么搭、context 怎么管、prompt 怎么约束边界。从 vibe coding 开始探索，最终想搞清楚的是：人和 agent 协同开发的边界在哪里，以及怎么把这条边界往外推。
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.25rem] border border-line/8 bg-line/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-foreground/45">Approach</p>
              <p className="mt-3 text-foreground">Spec → Implement → Ship. Repeat.</p>
            </div>
            <div className="rounded-[1.25rem] border border-line/8 bg-line/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-foreground/45">Bias</p>
              <p className="mt-3 text-foreground">Would rather go deep into how things truly cook.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
