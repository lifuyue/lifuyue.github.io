import { motion, useScroll, useTransform } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function About() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [50, -60]);
  const animation = useScrollAnimation(0.1);

  return (
    <section className="section-shell section-space relative">
      <SectionHeading
        eyebrow="About"
        title="Engineering the atmosphere around content."
        description="我偏好把页面当成一套舞台系统来设计。内容、运动、层次和材质不该彼此抢戏，而应该形成一种可感知的秩序。"
      />
      <div className="grid gap-8 lg:grid-cols-[1fr,1.4fr]">
        <motion.div style={{ y }} className="relative">
          <div className="glass-panel relative overflow-hidden rounded-[2rem] p-6">
            <div className="aspect-[4/5] rounded-[1.75rem] bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.35),transparent_30%),linear-gradient(160deg,#111827,#0f172a_55%,#0b1120)]" />
            <div className="absolute bottom-10 left-10 rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-zinc-300">
              Shanghai / Remote
            </div>
          </div>
        </motion.div>
        <motion.div
          {...animation}
          className="glass-panel grid gap-6 rounded-[2rem] p-8 text-base leading-8 text-zinc-300 sm:p-10"
        >
          <p>
            我关注的不只是页面“好看”，而是它如何通过速度、对比、空间留白和内容节奏建立
            记忆点。很多网站把动画当装饰，我更倾向把动画视为信息架构的一部分。
          </p>
          <p>
            这意味着我会同时处理设计语言和工程细节：组件边界、状态切换、内容系统、性能预算，
            以及在移动端如何做取舍。强视觉不等于高噪音，复杂体验也不该靠堆砌实现。
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Approach</p>
              <p className="mt-3 text-white">Editorial layout, controlled motion, practical systems.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Bias</p>
              <p className="mt-3 text-white">Prefer memorable structure over default SaaS sameness.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
