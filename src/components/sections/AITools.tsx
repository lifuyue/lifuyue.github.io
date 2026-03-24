import { useEffect, useLayoutEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/utils';
import claudeColorSvg from '@/assets/logos/claude-color.svg?raw';
import claudeTextSvg from '@/assets/logos/claude-text.svg?raw';
import claudecodeColorSvg from '@/assets/logos/claudecode-color.svg?raw';
import claudecodeTextSvg from '@/assets/logos/claudecode-text.svg?raw';
import codexColorSvg from '@/assets/logos/codex-color.svg?raw';
import codexTextSvg from '@/assets/logos/codex-text.svg?raw';
import geminiColorSvg from '@/assets/logos/gemini-color.svg?raw';
import geminiTextSvg from '@/assets/logos/gemini-text.svg?raw';
import openaiSvg from '@/assets/logos/openai.svg?raw';

const claudecodeChips = ['/model opus', 'plan'];
const codexChips = ['code', 'review', 'implement'];

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

interface ToolChipRowProps {
  items: string[];
  className?: string;
  chipClassName?: string;
}

function ToolChipRow({ items, className, chipClassName }: ToolChipRowProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {items.map((item) => (
        <span
          key={item}
          className={cn(
            'rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] backdrop-blur-sm sm:text-[11px]',
            chipClassName,
          )}
        >
          {item}
        </span>
      ))}
    </div>
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
  const playgroundRef = useRef<HTMLDivElement>(null);

  return (
    <section className="section-shell section-space relative">
      <SectionHeading
        eyebrow="AI Tools"
        title="A working stage for planning, code, review, and model switching."
        description="第二屏改成一个更大的交互舞台，把 Claude AI、Claude Code、Codex、Gemini 和 OpenAI 放进同一条工作回路里。推理、实现、切换和验证一起发生。"
      />

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden bg-transparent"
      >
        <div className="relative z-10 flex items-start justify-between gap-4 pb-4 pt-3 sm:pb-6 sm:pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.42em] text-foreground/45 sm:text-xs">
              Interactive Rail
            </p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-foreground/62 sm:text-[15px]">
              拖拽这些工具实体，观察它们在同一块舞台里重新分工。
            </p>
          </div>
          <div className="hidden rounded-full border border-line/10 bg-transparent px-4 py-2 text-[10px] uppercase tracking-[0.32em] text-foreground/45 sm:block">
            Drag to rearrange
          </div>
        </div>

        <div
          ref={playgroundRef}
          className="relative min-h-[24rem] overflow-hidden bg-transparent pt-2 sm:min-h-[30rem] lg:min-h-[36rem]"
        >
          <DraggableTool
            id="claude"
            constraintRef={playgroundRef}
            prefersReducedMotion={prefersReducedMotion}
            className="w-[9.75rem] sm:w-[11.5rem] lg:w-[13rem]"
            anchor={{ x: 0.06, y: 0.06 }}
            offset={{ x: 8, y: 8 }}
            initialVelocity={{ x: 52, y: -6 }}
          >
            <div className="relative flex flex-col items-center gap-3 rounded-[1.75rem] border border-amber-300/10 bg-transparent px-4 py-5">
              <InlineSvg
                svg={claudeColorSvg}
                className="h-14 w-14 drop-shadow-[0_18px_36px_rgba(245,158,11,0.34)] sm:h-16 sm:w-16 lg:h-20 lg:w-20"
              />
              <InlineSvg
                svg={claudeTextSvg}
                className="h-6 w-[6.75rem] text-foreground/95 sm:h-7 sm:w-[7.75rem] lg:h-8 lg:w-[8.75rem]"
              />
              <span className="text-[10px] uppercase tracking-[0.28em] text-foreground/40 sm:text-[11px]">
                Claude AI
              </span>
            </div>
          </DraggableTool>

          <DraggableTool
            id="claude-code"
            constraintRef={playgroundRef}
            prefersReducedMotion={prefersReducedMotion}
            className="w-[15.5rem] sm:w-[18rem] lg:w-[21rem]"
            anchor={{ x: 0.34, y: 0.09 }}
            offset={{ x: 10, y: 18 }}
            initialVelocity={{ x: -44, y: 8 }}
          >
            <div className="rounded-[2rem] border border-amber-300/12 bg-transparent px-4 py-4 sm:px-5 sm:py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-3">
                  <InlineSvg
                    svg={claudecodeColorSvg}
                    className="h-11 w-11 drop-shadow-[0_18px_36px_rgba(245,158,11,0.22)] sm:h-12 sm:w-12 lg:h-14 lg:w-14"
                  />
                  <InlineSvg
                    svg={claudecodeTextSvg}
                    className="h-5 w-[8.5rem] text-foreground/94 sm:h-6 sm:w-[9.5rem] lg:h-7 lg:w-[11rem]"
                  />
                </div>

                <ToolChipRow
                  items={claudecodeChips}
                  className="max-w-[10rem] sm:max-w-[9.5rem] sm:justify-end"
                  chipClassName="border-amber-300/15 bg-amber-300/8 text-foreground/88 shadow-[0_10px_30px_rgba(245,158,11,0.12)]"
                />
              </div>
            </div>
          </DraggableTool>

          <DraggableTool
            id="codex"
            constraintRef={playgroundRef}
            prefersReducedMotion={prefersReducedMotion}
            className="w-[15rem] sm:w-[18rem] lg:w-[22rem]"
            anchor={{ x: 0.48, y: 0.5 }}
            offset={{ x: 0, y: -4 }}
            initialVelocity={{ x: 46, y: -6 }}
          >
            <div className="rounded-[2rem] border border-teal-300/12 bg-transparent px-4 py-4 sm:px-5 sm:py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-3">
                  <InlineSvg
                    svg={codexColorSvg}
                    className="h-12 w-12 drop-shadow-[0_18px_40px_rgba(45,212,191,0.3)] sm:h-14 sm:w-14 lg:h-16 lg:w-16"
                  />
                  <InlineSvg
                    svg={codexTextSvg}
                    className="h-6 w-[6.75rem] text-foreground/95 sm:h-7 sm:w-[8.5rem] lg:h-8 lg:w-[9.5rem]"
                  />
                </div>

                <ToolChipRow
                  items={codexChips}
                  className="max-w-[11rem] sm:max-w-[10.5rem] sm:justify-end"
                  chipClassName="border-teal-300/15 bg-teal-300/8 text-foreground/88 shadow-[0_10px_30px_rgba(45,212,191,0.12)]"
                />
              </div>
            </div>
          </DraggableTool>

          <DraggableTool
            id="gemini"
            constraintRef={playgroundRef}
            prefersReducedMotion={prefersReducedMotion}
            className="w-[9.75rem] sm:w-[11rem] lg:w-[12.5rem]"
            anchor={{ x: 0.8, y: 0.08 }}
            offset={{ x: -4, y: 2 }}
            initialVelocity={{ x: -34, y: 7 }}
          >
            <div className="rounded-[1.75rem] border border-sky-300/12 bg-transparent px-4 py-5">
              <div className="flex flex-col items-center gap-3">
                <InlineSvg
                  svg={geminiColorSvg}
                  className="h-12 w-12 drop-shadow-[0_18px_42px_rgba(96,165,250,0.28)] sm:h-14 sm:w-14 lg:h-16 lg:w-16"
                />
                <InlineSvg
                  svg={geminiTextSvg}
                  className="h-6 w-[6.5rem] text-foreground/95 sm:h-7 sm:w-[7.75rem] lg:h-8 lg:w-[9rem]"
                />
              </div>
            </div>
          </DraggableTool>

          <DraggableTool
            id="openai"
            constraintRef={playgroundRef}
            prefersReducedMotion={prefersReducedMotion}
            className="w-[5.75rem] sm:w-[6.75rem] lg:w-[7.75rem]"
            anchor={{ x: 0.16, y: 0.66 }}
            offset={{ x: 10, y: 0 }}
            initialVelocity={{ x: 38, y: -10 }}
          >
            <div className="flex items-center justify-center rounded-[1.5rem] border border-white/10 bg-transparent px-4 py-4 sm:px-5 sm:py-5">
              <InlineSvg
                svg={openaiSvg}
                className="h-8 w-8 text-foreground/92 drop-shadow-[0_16px_36px_rgba(255,255,255,0.16)] sm:h-10 sm:w-10 lg:h-12 lg:w-12"
              />
            </div>
          </DraggableTool>
        </div>
      </motion.div>
    </section>
  );
}
