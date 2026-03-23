import { motion, useReducedMotion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FloatingChips } from '@/components/ui/FloatingChips';
import { LogoClaude } from '@/components/ui/LogoClaude';
import { LogoCodex } from '@/components/ui/LogoCodex';

const claudeChips = ['/model opus', 'plan', 'sonnet', 'code', 'haiku', 'artifacts'];

export function AITools() {
  const prefersReducedMotion = useReducedMotion();
  const easing = [0.22, 1, 0.36, 1] as const;

  const cardVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0 },
      }
    : {
        hidden: { opacity: 0, y: 32 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.85, ease: easing },
        },
      };

  return (
    <section className="section-shell section-space relative">
      <SectionHeading
        eyebrow="AI Tools"
        title="Planning depth and execution speed in one loop."
        description="Claude 帮我处理长上下文里的计划、比较和结构判断，Codex 负责把判断压成可执行的改动、构建与交付。两者一起工作，节奏更完整。"
      />

      <motion.div
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: prefersReducedMotion ? 0 : 0.08,
            },
          },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <motion.div variants={cardVariants}>
          <GlassCard className="min-h-[360px] border-amber-300/15 bg-[radial-gradient(circle_at_50%_18%,rgba(251,191,36,0.14),transparent_36%),radial-gradient(circle_at_50%_72%,rgba(45,212,191,0.08),transparent_42%)] p-0 md:min-h-[420px]">
            <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(251,191,36,0.06),transparent_34%,rgba(255,255,255,0.02)_68%,rgba(45,212,191,0.08))]" />
            <div className="relative flex h-full flex-col p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-amber-300/85">Primary Tool</p>
                  <p className="mt-3 font-display text-3xl text-white sm:text-4xl">Claude</p>
                </div>
                <div className="rounded-full border border-amber-300/15 bg-amber-300/10 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-amber-100/90">
                  Reasoning Layer
                </div>
              </div>

              <div className="relative flex flex-1 items-center justify-center py-10 sm:py-14">
                <div className="relative flex h-[16rem] w-full max-w-[19rem] items-center justify-center sm:h-[18rem] sm:max-w-[22rem]">
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.18),transparent_54%)] blur-3xl" />
                  <div className="absolute inset-[16%] rounded-full border border-amber-300/20 bg-white/[0.03]" />
                  <div className="absolute inset-[30%] rounded-full border border-white/10 bg-black/20 backdrop-blur-md" />
                  <FloatingChips
                    items={claudeChips}
                    radius={120}
                    className="scale-[0.72] sm:scale-[0.86] lg:scale-100"
                    chipClassName="border-amber-200/15 bg-[#17120a]/65 text-amber-50 shadow-[0_12px_30px_rgba(245,158,11,0.12)]"
                  />
                  <motion.div
                    animate={prefersReducedMotion ? undefined : { y: [0, -6, 0, 4, 0] }}
                    transition={{ duration: 5.5, ease: 'easeInOut', repeat: Infinity }}
                    className="relative z-10 flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-amber-200/15 bg-[#19140d]/85 shadow-[0_20px_60px_rgba(245,158,11,0.22)] backdrop-blur-xl sm:h-28 sm:w-28"
                  >
                    <LogoClaude className="h-16 w-16 text-amber-200 sm:h-24 sm:w-24" />
                  </motion.div>
                </div>
              </div>

              <div className="grid gap-3 border-t border-white/10 pt-6 text-sm leading-7 text-zinc-300">
                <p className="text-sm uppercase tracking-[0.32em] text-zinc-500">
                  Long-context planning / editorial reasoning
                </p>
                <p>
                  适合处理方向比较、任务拆解、长链路讨论和较重的上下文阅读，让复杂前端问题先有
                  一个稳定的结构。
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={cardVariants}>
          <GlassCard className="min-h-[360px] border-teal-300/15 bg-[radial-gradient(circle_at_52%_20%,rgba(45,212,191,0.16),transparent_36%),radial-gradient(circle_at_20%_80%,rgba(245,158,11,0.06),transparent_30%)] p-0 md:min-h-[420px]">
            <div className="absolute inset-0 bg-[linear-gradient(150deg,rgba(45,212,191,0.08),transparent_30%,rgba(255,255,255,0.03)_62%,rgba(15,23,42,0.2))]" />
            <div className="relative flex h-full flex-col p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-teal-200/80">Execution Tool</p>
                  <p className="mt-3 font-display text-3xl text-white sm:text-4xl">Codex</p>
                </div>
                <div className="rounded-full border border-teal-300/15 bg-teal-300/10 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-teal-50/90">
                  Shipping Layer
                </div>
              </div>

              <div className="relative flex flex-1 items-center justify-center py-10 sm:py-14">
                <div className="absolute h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.2),transparent_58%)] blur-3xl sm:h-56 sm:w-56" />
                <div className="absolute h-[12rem] w-[12rem] rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] backdrop-blur-sm sm:h-[15rem] sm:w-[15rem]" />
                <motion.div
                  animate={prefersReducedMotion ? undefined : { rotate: [0, 6, 0, -6, 0] }}
                  transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity }}
                  className="absolute h-[10rem] w-[10rem] rounded-[2rem] border border-teal-300/15 bg-[linear-gradient(135deg,rgba(45,212,191,0.08),transparent)] sm:h-[12rem] sm:w-[12rem]"
                />
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-teal-200/15 bg-[#0c1717]/85 shadow-[0_20px_60px_rgba(45,212,191,0.18)] backdrop-blur-xl sm:h-28 sm:w-28">
                    <LogoCodex className="h-16 w-16 text-teal-200 sm:h-24 sm:w-24" />
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['diff', 'refactor', 'build', 'verify'].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-zinc-100"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 border-t border-white/10 pt-6 text-sm leading-7 text-zinc-300">
                <p className="text-sm uppercase tracking-[0.32em] text-zinc-500">
                  Focused implementation / fast verification
                </p>
                <p>
                  更适合贴着代码库执行具体改动、跑构建和补验证，让抽象判断尽快落到可以交付的实现
                  上。
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </section>
  );
}
