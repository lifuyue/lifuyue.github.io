import { lazy, Suspense } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { MagneticButton } from '@/components/ui/MagneticButton';
import githubSvg from '@/assets/logos/github.svg?raw';
import xSvg from '@/assets/logos/x.svg?raw';
import { cn } from '@/lib/utils';

const HeroScene = lazy(() => import('@/components/three/HeroScene'));

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

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="section-shell relative min-h-[calc(100vh-7rem)] overflow-hidden py-10">
      <div className="relative isolate min-h-[82vh] overflow-hidden rounded-[2.5rem] border border-line/10 bg-background/20 shadow-glow">
        <div className="absolute inset-0 bg-noise" />
        <div className="absolute inset-0 opacity-90">
          <Suspense fallback={<div className="h-full w-full bg-background/20" />}>
            <HeroScene />
          </Suspense>
        </div>
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 flex min-h-[82vh] flex-col justify-between p-8 sm:p-10 lg:p-16">
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
              className="font-display text-5xl leading-[0.95] text-foreground sm:text-6xl lg:text-8xl"
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
          <div className="grid gap-6 border-t border-line/10 pt-8 text-sm text-foreground/70 sm:grid-cols-3">
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
          className="absolute bottom-6 right-6 rounded-full border border-line/15 px-4 py-2 text-xs uppercase tracking-[0.35em] text-foreground/70"
        >
          Scroll
        </motion.div>
      </div>
    </section>
  );
}
