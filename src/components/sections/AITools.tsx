import { useEffect, useLayoutEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FloatingChips } from '@/components/ui/FloatingChips';
import { cn } from '@/lib/utils';
import claudeColorSvg from '@/assets/logos/claude-color.svg?raw';
import claudeTextSvg from '@/assets/logos/claude-text.svg?raw';
import codexColorSvg from '@/assets/logos/codex-color.svg?raw';
import codexTextSvg from '@/assets/logos/codex-text.svg?raw';

const claudeChips = ['/model opus', 'plan', 'sonnet', 'code', 'haiku', 'artifacts'];
const codexChips = ['diff', 'refactor', 'build', 'verify'];

interface InlineSvgProps {
  svg: string;
  className?: string;
}

function InlineSvg({ svg, className }: InlineSvgProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('block shrink-0 [&_svg]:block [&_svg]:h-full [&_svg]:w-full', className)}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

interface DraggableToolProps {
  constraintRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
  id: string;
  anchor: { x: number; y: number };
  offset?: { x: number; y: number };
  initialVelocity?: { x: number; y: number };
  gravity?: number;
  bounce?: number;
  children: React.ReactNode;
  prefersReducedMotion: boolean;
}

function DraggableTool({
  constraintRef,
  className,
  id,
  anchor,
  offset = { x: 0, y: 0 },
  initialVelocity = { x: 0, y: 0 },
  gravity = 0,
  bounce = 0.965,
  children,
  prefersReducedMotion,
}: DraggableToolProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const physicsRef = useRef({
    velocityX: initialVelocity.x,
    velocityY: initialVelocity.y,
    width: 0,
    height: 0,
    maxX: 0,
    maxY: 0,
    initialized: false,
    dragging: false,
  });

  useLayoutEffect(() => {
    let resizeObserver: ResizeObserver | null = null;
    let frameId = 0;

    const measure = () => {
      const container = constraintRef.current;
      const body = bodyRef.current;

      if (!container || !body) {
        return false;
      }

      const nextWidth = body.offsetWidth;
      const nextHeight = body.offsetHeight;
      const maxX = Math.max(container.clientWidth - nextWidth, 0);
      const maxY = Math.max(container.clientHeight - nextHeight, 0);

      physicsRef.current.width = nextWidth;
      physicsRef.current.height = nextHeight;
      physicsRef.current.maxX = maxX;
      physicsRef.current.maxY = maxY;

      if (!physicsRef.current.initialized) {
        x.set(Math.min(Math.max(anchor.x * maxX + offset.x, 0), maxX));
        y.set(Math.min(Math.max(anchor.y * maxY + offset.y, 0), maxY));
        physicsRef.current.initialized = true;
        return true;
      }

      x.set(Math.min(Math.max(x.get(), 0), maxX));
      y.set(Math.min(Math.max(y.get(), 0), maxY));
      return true;
    };

    const setup = () => {
      const container = constraintRef.current;
      const body = bodyRef.current;

      if (!container || !body) {
        frameId = requestAnimationFrame(setup);
        return;
      }

      measure();

      resizeObserver = new ResizeObserver(() => {
        measure();
      });

      resizeObserver.observe(container);
      resizeObserver.observe(body);
    };

    setup();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
    };
  }, [anchor.x, anchor.y, constraintRef, offset.x, offset.y, x, y]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    let frameId = 0;
    let lastTime = performance.now();

    const step = (now: number) => {
      const state = physicsRef.current;

      if (!state.initialized || state.dragging) {
        lastTime = now;
        frameId = requestAnimationFrame(step);
        return;
      }

      const dt = Math.min(now - lastTime, 32) / 1000;
      lastTime = now;

      const minHorizontalKick = 18;
      const minVerticalKick = 18;

      state.velocityY += gravity * dt;
      state.velocityX *= 0.9988;
      state.velocityY *= 0.9988;

      let nextX = x.get() + state.velocityX * dt;
      let nextY = y.get() + state.velocityY * dt;

      if (nextX <= 0) {
        nextX = 0;
        state.velocityX = Math.abs(state.velocityX) * bounce;
        if (state.velocityX < minHorizontalKick) {
          state.velocityX = minHorizontalKick;
        }
      } else if (nextX >= state.maxX) {
        nextX = state.maxX;
        state.velocityX = -Math.abs(state.velocityX) * bounce;
        if (Math.abs(state.velocityX) < minHorizontalKick) {
          state.velocityX = -minHorizontalKick;
        }
      }

      if (nextY <= 0) {
        nextY = 0;
        state.velocityY = Math.abs(state.velocityY) * bounce;
      } else if (nextY >= state.maxY) {
        nextY = state.maxY;
        state.velocityY = -Math.abs(state.velocityY) * bounce;
        if (Math.abs(state.velocityY) < minVerticalKick) {
          state.velocityY = -minVerticalKick;
        }
      }

      x.set(nextX);
      y.set(nextY);

      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [bounce, gravity, prefersReducedMotion, x, y]);

  return (
    <motion.div
      ref={bodyRef}
      data-tool-float={id}
      drag
      dragConstraints={constraintRef}
      dragElastic={0}
      dragMomentum={false}
      onDragStart={() => {
        physicsRef.current.dragging = true;
      }}
      onDrag={(_, info) => {
        physicsRef.current.velocityX = info.velocity.x * 0.24;
        physicsRef.current.velocityY = info.velocity.y * 0.24;
      }}
      onDragEnd={(_, info) => {
        physicsRef.current.dragging = false;
        physicsRef.current.velocityX = info.velocity.x * 0.28;
        physicsRef.current.velocityY = info.velocity.y * 0.28;
      }}
      whileTap={{ scale: 0.98 }}
      whileDrag={{ scale: 1.02 }}
      className={cn(
        'pointer-events-auto absolute left-0 top-0 z-20 touch-none cursor-grab active:cursor-grabbing will-change-transform',
        className,
      )}
      style={{ x, y }}
    >
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                rotate: [0, -1.5, 0, 1.5, 0],
              }
        }
        transition={{
          duration: 7.5,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function AITools() {
  const prefersReducedMotion = !!useReducedMotion();
  const easing = [0.22, 1, 0.36, 1] as const;
  const playgroundRef = useRef<HTMLDivElement>(null);

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

      <div
        ref={playgroundRef}
        className="relative mb-6 min-h-[16rem] overflow-hidden sm:mb-8 sm:min-h-[20rem] lg:min-h-[24rem]"
      >
        <DraggableTool
          id="claude"
          constraintRef={playgroundRef}
          prefersReducedMotion={prefersReducedMotion}
          className="w-[16rem] sm:w-[20rem] lg:w-[24rem]"
          anchor={{ x: 0.08, y: 0.04 }}
          offset={{ x: 18, y: 12 }}
          initialVelocity={{ x: 54, y: -8 }}
        >
          <div className="relative h-[15rem] w-[15rem] sm:h-[18rem] sm:w-[18rem] lg:h-[21rem] lg:w-[21rem]">
            <FloatingChips
              items={claudeChips}
              radius={96}
              className="scale-[0.86] sm:scale-100 lg:scale-[1.1]"
              chipClassName="border-amber-200/20 bg-[#17120a]/45 text-amber-50 shadow-[0_10px_30px_rgba(245,158,11,0.18)]"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <InlineSvg svg={claudeColorSvg} className="h-16 w-16 drop-shadow-[0_18px_40px_rgba(245,158,11,0.35)] sm:h-20 sm:w-20 lg:h-24 lg:w-24" />
              <InlineSvg
                svg={claudeTextSvg}
                className="h-7 w-[7.5rem] text-white/95 drop-shadow-[0_10px_28px_rgba(245,158,11,0.16)] sm:h-8 sm:w-[8.5rem] lg:h-9 lg:w-[9.5rem]"
              />
            </div>
          </div>
        </DraggableTool>

        <DraggableTool
          id="codex"
          constraintRef={playgroundRef}
          prefersReducedMotion={prefersReducedMotion}
          className="w-[12rem] sm:w-[15rem] lg:w-[18rem]"
          anchor={{ x: 0.64, y: 0.08 }}
          offset={{ x: -12, y: 26 }}
          initialVelocity={{ x: -48, y: 6 }}
          gravity={0}
        >
          <div className="flex flex-col items-center gap-4">
            <InlineSvg
              svg={codexColorSvg}
              className="h-16 w-16 drop-shadow-[0_18px_40px_rgba(45,212,191,0.32)] sm:h-20 sm:w-20 lg:h-24 lg:w-24"
            />
            <InlineSvg
              svg={codexTextSvg}
              className="h-7 w-[7.5rem] text-white/95 drop-shadow-[0_10px_28px_rgba(45,212,191,0.16)] sm:h-8 sm:w-[8.75rem] lg:h-9 lg:w-[10rem]"
            />
            <div className="flex flex-wrap justify-center gap-2">
              {codexChips.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-zinc-100"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </DraggableTool>
      </div>

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
          <GlassCard className="min-h-[320px] border-amber-300/15 bg-[radial-gradient(circle_at_14%_16%,rgba(251,191,36,0.14),transparent_30%),radial-gradient(circle_at_88%_84%,rgba(45,212,191,0.06),transparent_28%)] p-0 md:min-h-[360px]">
            <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(251,191,36,0.06),transparent_34%,rgba(255,255,255,0.02)_68%,rgba(45,212,191,0.08))]" />
            <div className="relative flex h-full flex-col p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-amber-300/85">Primary Tool</p>
                  <div className="mt-3">
                    <h3 className="sr-only">Claude</h3>
                    <InlineSvg
                      svg={claudeTextSvg}
                      className="h-7 w-[7.25rem] text-white/95 sm:h-9 sm:w-[9.25rem]"
                    />
                  </div>
                </div>
                <div className="rounded-full border border-amber-300/15 bg-amber-300/10 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-amber-100/90">
                  Reasoning Layer
                </div>
              </div>

              <div className="mt-8 grid gap-4 text-sm leading-7 text-zinc-300">
                <p>
                  适合处理方向比较、任务拆解、长链路讨论和较重的上下文阅读，让复杂前端问题先有
                  一个稳定的结构。
                </p>
                <div className="flex flex-wrap gap-2">
                  {claudeChips.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-zinc-100"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto grid gap-3 border-t border-white/10 pt-6 text-sm leading-7 text-zinc-300">
                <p className="text-sm uppercase tracking-[0.32em] text-zinc-500">
                  Long-context planning / editorial reasoning
                </p>
                <p>拖拽上方实体时，Claude 会带着模型标签一起漂浮，保持更强的上下文感。</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={cardVariants}>
          <GlassCard className="min-h-[320px] border-teal-300/15 bg-[radial-gradient(circle_at_86%_16%,rgba(45,212,191,0.16),transparent_30%),radial-gradient(circle_at_16%_84%,rgba(245,158,11,0.06),transparent_28%)] p-0 md:min-h-[360px]">
            <div className="absolute inset-0 bg-[linear-gradient(150deg,rgba(45,212,191,0.08),transparent_30%,rgba(255,255,255,0.03)_62%,rgba(15,23,42,0.2))]" />
            <div className="relative flex h-full flex-col p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-teal-200/80">Execution Tool</p>
                  <div className="mt-3">
                    <h3 className="sr-only">Codex</h3>
                    <InlineSvg
                      svg={codexTextSvg}
                      className="h-8 w-[7.5rem] text-white/95 sm:h-10 sm:w-[9.75rem]"
                    />
                  </div>
                </div>
                <div className="rounded-full border border-teal-300/15 bg-teal-300/10 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-teal-50/90">
                  Shipping Layer
                </div>
              </div>

              <div className="mt-8 grid gap-4 text-sm leading-7 text-zinc-300">
                <p>
                  更适合贴着代码库执行具体改动、跑构建和补验证，让抽象判断尽快落到可以交付的实现
                  上。
                </p>
                <div className="flex flex-wrap gap-2">
                  {codexChips.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-zinc-100"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto grid gap-3 border-t border-white/10 pt-6 text-sm leading-7 text-zinc-300">
                <p className="text-sm uppercase tracking-[0.32em] text-zinc-500">
                  Focused implementation / fast verification
                </p>
                <p>Codex 实体不再被包进面板里，会和页面里的其他元素保持更轻、更直接的关系。</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </section>
  );
}
