import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from 'react';
import type { ReactNode, RefObject } from 'react';
import { motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { InlineSvg } from '@/components/ui/InlineSvg';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { ToolChipRow } from '@/components/ui/ToolChipRow';
import type { AgentConfig } from '@/data/agents';
import { heroAgents } from '@/data/agents';
import githubSvg from '@/assets/logos/github.svg?raw';
import xSvg from '@/assets/logos/x.svg?raw';
import { cn } from '@/lib/utils';

const HeroScene = lazy(() => import('@/components/three/HeroScene'));

interface FloatingAgentProps {
  constraintRef: RefObject<HTMLDivElement | null>;
  className?: string;
  id: string;
  anchor: { x: number; y: number };
  offset?: { x: number; y: number };
  initialVelocity?: { x: number; y: number };
  children: ReactNode;
  prefersReducedMotion: boolean;
}

function FloatingAgent({
  constraintRef,
  className,
  id,
  anchor,
  offset = { x: 0, y: 0 },
  initialVelocity = { x: 0, y: 0 },
  children,
  prefersReducedMotion,
}: FloatingAgentProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const physicsRef = useRef({
    velocityX: initialVelocity.x,
    velocityY: initialVelocity.y,
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

      const maxX = Math.max(container.clientWidth - body.offsetWidth, 0);
      const maxY = Math.max(container.clientHeight - body.offsetHeight, 0);

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

      state.velocityX *= 0.9986;
      state.velocityY *= 0.9986;

      let nextX = x.get() + state.velocityX * dt;
      let nextY = y.get() + state.velocityY * dt;

      if (nextX <= 0) {
        nextX = 0;
        state.velocityX = Math.max(Math.abs(state.velocityX) * 0.968, 18);
      } else if (nextX >= state.maxX) {
        nextX = state.maxX;
        state.velocityX = -Math.max(Math.abs(state.velocityX) * 0.968, 18);
      }

      if (nextY <= 0) {
        nextY = 0;
        state.velocityY = Math.max(Math.abs(state.velocityY) * 0.968, 18);
      } else if (nextY >= state.maxY) {
        nextY = state.maxY;
        state.velocityY = -Math.max(Math.abs(state.velocityY) * 0.968, 18);
      }

      x.set(nextX);
      y.set(nextY);

      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [prefersReducedMotion, x, y]);

  return (
    <motion.div
      ref={bodyRef}
      data-agent-float={id}
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
      whileTap={{ scale: 0.985 }}
      whileDrag={{ scale: 1.015 }}
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
                rotate: [0, -1.25, 0, 1.25, 0],
              }
        }
        transition={{
          duration: 8,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

const heroAgentLayouts: Record<
  string,
  {
    className: string;
    anchor: { x: number; y: number };
    offset?: { x: number; y: number };
    initialVelocity?: { x: number; y: number };
    cardClassName: string;
    iconClassName: string;
    textIconClassName: string;
    compact?: boolean;
    chipClassName?: string;
  }
> = {
  'claude-code': {
    className: 'w-[14rem] sm:w-[16rem] lg:w-[17.5rem] xl:w-[19rem]',
    anchor: { x: 0.04, y: 0.08 },
    offset: { x: 8, y: 8 },
    initialVelocity: { x: 28, y: 18 },
    cardClassName:
      'border-amber-300/14 bg-[linear-gradient(145deg,rgba(245,158,11,0.08),rgba(255,255,255,0.015))]',
    iconClassName:
      'h-10 w-10 drop-shadow-[0_16px_34px_rgba(245,158,11,0.26)] sm:h-11 sm:w-11 lg:h-12 lg:w-12',
    textIconClassName: 'h-5 w-[8rem] text-foreground/94 sm:h-5.5 sm:w-[9rem] lg:h-6 lg:w-[10rem]',
    chipClassName: 'border-amber-300/14 bg-amber-300/[0.08] text-foreground/82',
  },
  codex: {
    className: 'w-[13.5rem] sm:w-[16rem] lg:w-[18rem] xl:w-[19.5rem]',
    anchor: { x: 0.46, y: 0.48 },
    offset: { x: 2, y: -2 },
    initialVelocity: { x: -26, y: 16 },
    cardClassName:
      'border-teal-300/14 bg-[linear-gradient(145deg,rgba(45,212,191,0.08),rgba(255,255,255,0.015))]',
    iconClassName:
      'h-11 w-11 drop-shadow-[0_16px_36px_rgba(45,212,191,0.28)] sm:h-12 sm:w-12 lg:h-[3.25rem] lg:w-[3.25rem]',
    textIconClassName:
      'h-5.5 w-[6.5rem] text-foreground/95 sm:h-6 sm:w-[7.5rem] lg:h-6.5 lg:w-[8.5rem]',
    chipClassName: 'border-teal-300/14 bg-teal-300/[0.08] text-foreground/82',
  },
  gemini: {
    className: 'w-[9.5rem] sm:w-[10.5rem] lg:w-[11.5rem] xl:w-[12rem]',
    anchor: { x: 0.62, y: 0.06 },
    offset: { x: 0, y: 6 },
    initialVelocity: { x: -18, y: 14 },
    cardClassName:
      'border-sky-300/14 bg-[linear-gradient(145deg,rgba(96,165,250,0.08),rgba(255,255,255,0.015))]',
    iconClassName:
      'h-12 w-12 drop-shadow-[0_18px_40px_rgba(96,165,250,0.24)] sm:h-[3.25rem] sm:w-[3.25rem] lg:h-14 lg:w-14',
    textIconClassName: 'h-6 w-[6rem] text-foreground/95 sm:h-6.5 sm:w-[7rem] lg:h-7 lg:w-[8rem]',
    compact: true,
  },
};

function HeroAgentCard({ agent }: { agent: AgentConfig }) {
  const layout = heroAgentLayouts[agent.id];

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[1.75rem] border p-4 backdrop-blur-md sm:p-5',
        layout.cardClassName,
      )}
      style={{
        boxShadow: `0 24px 56px -40px ${agent.glowColor}`,
      }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-4 top-0 h-px opacity-75"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${agent.glowColor} 48%, transparent 100%)`,
        }}
      />
      <div
        className={cn(
          'relative flex gap-4',
          layout.compact
            ? 'flex-col items-center text-center'
            : 'flex-col sm:flex-row sm:items-center sm:justify-between',
        )}
      >
        <div className={cn('flex flex-col gap-3', layout.compact && 'items-center')}>
          <InlineSvg svg={agent.colorIcon} className={layout.iconClassName} />
          {agent.textIcon ? (
            <InlineSvg svg={agent.textIcon} className={layout.textIconClassName} />
          ) : (
            <p className="font-display text-xl text-foreground">{agent.name}</p>
          )}
        </div>
        <div className={cn('flex flex-col gap-3', layout.compact ? 'items-center' : 'sm:items-end')}>
          <span className="rounded-full border border-line/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.28em] text-foreground/44">
            {agent.role}
          </span>
          {agent.chips?.length ? (
            <ToolChipRow
              items={agent.chips}
              className={cn('max-w-[10.5rem]', layout.compact ? 'justify-center' : 'sm:justify-end')}
              chipClassName={cn(
                'border-line/10 px-2.5 py-1 text-[9px] tracking-[0.2em] backdrop-blur-sm sm:text-[10px]',
                layout.chipClassName,
              )}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function FloatingAgentCluster({ className }: { className?: string }) {
  const prefersReducedMotion = !!useReducedMotion();
  const playgroundRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={playgroundRef}
      className={cn(
        'pointer-events-none relative isolate min-h-[18rem] overflow-hidden sm:min-h-[21rem] lg:min-h-[27rem] xl:min-h-[31rem]',
        className,
      )}
    >
      {heroAgents.map((agent) => {
        const layout = heroAgentLayouts[agent.id];

        return (
          <FloatingAgent
            key={agent.id}
            id={agent.id}
            constraintRef={playgroundRef}
            prefersReducedMotion={prefersReducedMotion}
            className={layout.className}
            anchor={layout.anchor}
            offset={layout.offset}
            initialVelocity={layout.initialVelocity}
          >
            <HeroAgentCard agent={agent} />
          </FloatingAgent>
        );
      })}
    </div>
  );
}

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-[calc(100vh-7rem)] overflow-hidden">
      <div className="absolute inset-0 bg-noise" />
      <div className="absolute inset-0 opacity-90">
        <Suspense fallback={<div className="h-full w-full bg-background/20" />}>
          <HeroScene />
        </Suspense>
      </div>
      <div className="hero-overlay absolute inset-0" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,rgba(7,8,14,0.28)_0%,rgba(7,8,14,0.16)_36%,transparent_72%)] light:bg-[linear-gradient(90deg,rgba(255,255,255,0.34)_0%,rgba(255,255,255,0.16)_34%,transparent_74%)]" />
      <div className="section-shell relative z-10 flex min-h-[calc(100vh-7rem)] flex-col justify-between py-16 sm:py-20 lg:py-24">
        <div className="grid flex-1 items-center gap-10 lg:grid-cols-[minmax(0,1.06fr)_minmax(19rem,0.84fr)] lg:gap-14 xl:gap-16">
          <div className="max-w-4xl space-y-8">
            <p className="text-xs uppercase tracking-[0.5em] text-accent/80">
              Portfolio / Journal / Experiments
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-sm tracking-wide text-foreground/55"
            >
              lifuyue / XMU / AI - Native Developer
            </motion.p>
            <AnimatedText
              text="I build immersive interfaces that feel editorial, kinetic, and precise."
              className="font-display text-5xl leading-[0.95] text-foreground sm:text-6xl lg:text-7xl xl:text-8xl"
            />
            <motion.p
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35 }}
              className="max-w-2xl text-base leading-8 text-foreground/70 sm:text-lg"
            >
              我是 lifuyue，XMU SWE 在读，专注 AI Agent & Coding。这个站点是作品集、博客和视觉实验的合体，
              把前端工程、交互编排和内容呈现组织成一个连续的空间体验。
            </motion.p>
            <div className="flex flex-wrap gap-4">
              <MagneticButton to="/works">View Works</MagneticButton>
              <MagneticButton to="/blog" className="border-teal/20 text-teal/80 hover:border-teal/40">
                Read Notes
              </MagneticButton>
              <MagneticButton
                href="https://github.com/lifuyue"
                className="border-line/20 text-foreground/80 hover:border-line/20"
              >
                <InlineSvg svg={githubSvg} className="h-4 w-4" />
                <span>GitHub ↗</span>
              </MagneticButton>
              <MagneticButton
                href="https://x.com/L1fuyue"
                className="border-line/20 text-foreground/80 hover:border-line/20"
              >
                <InlineSvg svg={xSvg} className="h-3.5 w-3.5" />
                <span>X.COM ↗</span>
              </MagneticButton>
            </div>
          </div>
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.85, delay: prefersReducedMotion ? 0 : 0.25 }}
            className="relative w-full"
          >
            <p className="mb-4 text-[10px] uppercase tracking-[0.34em] text-foreground/38 sm:mb-5 sm:text-[11px]">
              Three Agents, One Right-Side Orbit
            </p>
            <FloatingAgentCluster />
          </motion.div>
        </div>
        <div className="grid gap-6 pt-10 text-sm text-foreground/70 sm:grid-cols-3 lg:max-w-4xl">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-foreground/45">Focus</p>
            <p className="mt-2 text-foreground">Motion systems with readable information density.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-foreground/45">Toolkit</p>
            <p className="mt-2 text-foreground">React, TypeScript, R3F, MDX, Framer Motion, GSAP.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-foreground/45">Current Mode</p>
            <p className="mt-2 text-foreground">Designing for depth, shipping for performance.</p>
          </div>
        </div>
      </div>
      <motion.div
        animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="absolute bottom-8 right-8 rounded-full border border-line/15 px-4 py-2 text-xs uppercase tracking-[0.35em] text-foreground/70"
      >
        Scroll
      </motion.div>
    </section>
  );
}
