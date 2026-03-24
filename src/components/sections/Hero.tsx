import { lazy, Suspense } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { AgentRail } from '@/components/ui/AgentRail';
import { InlineSvg } from '@/components/ui/InlineSvg';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { heroAgents } from '@/data/agents';
import githubSvg from '@/assets/logos/github.svg?raw';
import xSvg from '@/assets/logos/x.svg?raw';

const HeroScene = lazy(() => import('@/components/three/HeroScene'));

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="section-shell relative min-h-[calc(100vh-7rem)] overflow-hidden py-8 lg:py-10">
      <div className="relative isolate min-h-[74vh] overflow-hidden rounded-[2.5rem] border border-line/10 bg-background/20 shadow-glow sm:min-h-[76vh] lg:min-h-[78vh]">
        <div className="absolute inset-0 bg-noise" />
        <div className="absolute inset-0 opacity-90">
          <Suspense fallback={<div className="h-full w-full bg-background/20" />}>
            <HeroScene />
          </Suspense>
        </div>
        <div className="hero-overlay absolute inset-0" />
        <div className="absolute inset-y-0 left-0 w-[78%] bg-gradient-to-r from-background/85 via-background/58 to-transparent opacity-90 light:from-background/95 light:via-background/72" />
        <div className="relative z-10 flex min-h-[74vh] flex-col justify-between p-8 sm:min-h-[76vh] sm:p-10 lg:min-h-[78vh] lg:px-16 lg:py-12">
          <div className="max-w-4xl pb-6 sm:pb-8 lg:pb-10">
            <div className="space-y-4 sm:space-y-5">
              <p className="text-[11px] uppercase tracking-[0.52em] text-accent/82 sm:text-xs">
                Portfolio / Journal / Experiments
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-base font-medium tracking-[0.03em] text-foreground/70 sm:text-lg lg:text-[1.4rem] lg:leading-none"
              >
                lifuyue / XMU / AI-Native Developer
              </motion.p>
            </div>
            <motion.p
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="mt-7 max-w-[44rem] sm:mt-8 lg:mt-9 lg:max-w-[56rem]"
            >
              <AnimatedText
                text="I build immersive interfaces that feel editorial, kinetic, and precise."
                className="font-display text-5xl leading-[0.94] text-foreground sm:text-[4.6rem] lg:text-[5rem] xl:text-[5.5rem]"
              />
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35 }}
              className="mt-7 max-w-2xl text-base leading-8 text-foreground/70 sm:mt-8 sm:text-lg lg:mt-9"
            >
              我是 lifuyue，XMU SWE 在读，专注 AI Agent & Coding。这个站点是作品集、博客和视觉实验的合体，
              把前端工程、交互编排和内容呈现组织成一个连续的空间体验。
            </motion.p>
            <div className="mt-7 flex flex-wrap gap-3 sm:mt-8 sm:gap-4 lg:mt-9">
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
          <div className="border-t border-line/8 pt-7 sm:pt-8 lg:pt-10">
            <p className="mb-3 text-[10px] uppercase tracking-[0.32em] text-foreground/38 sm:mb-4 sm:text-[11px]">
              AI Toolkit
            </p>
            <AgentRail agents={heroAgents} className="opacity-95" />
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
