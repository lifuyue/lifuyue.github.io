import { lazy, Suspense } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { MagneticButton } from '@/components/ui/MagneticButton';

const HeroScene = lazy(() => import('@/components/three/HeroScene'));

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="section-shell relative min-h-[calc(100vh-7rem)] overflow-hidden py-10">
      <div className="relative isolate min-h-[82vh] overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/20 shadow-glow">
        <div className="absolute inset-0 bg-noise" />
        <div className="absolute inset-0 opacity-90">
          <Suspense fallback={<div className="h-full w-full bg-black/20" />}>
            <HeroScene />
          </Suspense>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#090c14] via-[#090c14]/78 to-transparent" />
        <div className="relative z-10 flex min-h-[82vh] flex-col justify-between p-8 sm:p-10 lg:p-16">
          <div className="max-w-4xl space-y-8">
            <p className="text-xs uppercase tracking-[0.5em] text-amber-300/80">
              Portfolio / Journal / Experiments
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-sm tracking-wide text-zinc-400"
            >
              lifuyue / XMU / AI - Native Developer
            </motion.p>
            <AnimatedText
              text="I build immersive interfaces that feel editorial, kinetic, and precise."
              className="font-display text-5xl leading-[0.95] text-white sm:text-6xl lg:text-8xl"
            />
            <motion.p
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35 }}
              className="max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg"
            >
              我是 lifuyue，XMU SWE 在读，专注 AI Agent & Coding。这个站点是作品集、博客和视觉实验的合体，
              把前端工程、交互编排和内容呈现组织成一个连续的空间体验。
            </motion.p>
            <div className="flex flex-wrap gap-4">
              <MagneticButton to="/works">View Works</MagneticButton>
              <MagneticButton to="/blog" className="border-teal-300/20 text-teal-100">
                Read Notes
              </MagneticButton>
              <MagneticButton
                href="https://github.com/lifuyue"
                className="border-zinc-500/20 text-zinc-200"
              >
                GitHub ↗
              </MagneticButton>
            </div>
          </div>
          <div className="grid gap-6 border-t border-white/10 pt-8 text-sm text-zinc-300 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Focus</p>
              <p className="mt-2 text-white">Motion systems with readable information density.</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Toolkit</p>
              <p className="mt-2 text-white">React, TypeScript, R3F, MDX, Framer Motion, GSAP.</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Current Mode</p>
              <p className="mt-2 text-white">Designing for depth, shipping for performance.</p>
            </div>
          </div>
        </div>
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="absolute bottom-6 right-6 rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.35em] text-zinc-300"
        >
          Scroll
        </motion.div>
      </div>
    </section>
  );
}
