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
        description="写代码之外，我喜欢拆解好产品的交互细节，偶尔写点东西记录自己的判断过程。相信好的页面应该让人觉得舒服，而不是觉得厉害。"
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
            我是那种会为了一个过渡动画的节奏调半天参数的人。但我也很在意工程侧的事情——组件怎么拆、
            状态怎么管、移动端性能怎么控制。两边我都不想将就。
          </p>
          <p>
            最近的兴趣集中在 AI agent 工作流上：怎么让 Claude Code、Codex 这些工具真正融入开发过程，
            而不只是拿来生成代码片段。这个站点本身就大量使用了 agent 辅助开发。
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.25rem] border border-line/8 bg-line/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-foreground/45">Approach</p>
              <p className="mt-3 text-foreground">Idea → prototype → ship. Repeat.</p>
            </div>
            <div className="rounded-[1.25rem] border border-line/8 bg-line/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-foreground/45">Bias</p>
              <p className="mt-3 text-foreground">Would rather build weird and memorable than safe and forgettable.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
