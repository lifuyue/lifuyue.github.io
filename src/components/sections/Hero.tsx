import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { InlineSvg } from '@/components/ui/InlineSvg';
import { MagneticButton } from '@/components/ui/MagneticButton';
import githubSvg from '@/assets/logos/github.svg?raw';
import xSvg from '@/assets/logos/x.svg?raw';
import { cn } from '@/lib/utils';

const headlineLines = ['Hi, I build things', 'with AI agents', 'and ship them.'];

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  const artPointerX = useMotionValue(0);
  const artPointerY = useMotionValue(0);
  const smoothArtPointerX = useSpring(artPointerX, { stiffness: 80, damping: 24, mass: 0.5 });
  const smoothArtPointerY = useSpring(artPointerY, { stiffness: 80, damping: 24, mass: 0.5 });
  const detailPointerX = useTransform(smoothArtPointerX, (value) => value * -0.55);
  const detailPointerY = useTransform(smoothArtPointerY, (value) => value * -0.7);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.3 });
  const sceneScale = useTransform(progress, [0, 1], [1.015, 1.1]);
  const sceneX = useTransform(progress, [0, 1], ['0%', '4%']);
  const sceneY = useTransform(progress, [0, 1], ['0%', '-2.5%']);
  const copyY = useTransform(progress, [0, 0.68, 1], [0, -8, -90]);
  const copyScale = useTransform(progress, [0, 0.72, 1], [1, 1.01, 1.08]);
  const copyOpacity = useTransform(progress, [0, 0.72, 1], [1, 1, 0]);
  const frameScale = useTransform(progress, [0, 1], [1, 0.94]);
  const frameOpacity = useTransform(progress, [0, 0.8, 1], [0.42, 0.3, 0]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = () => setIsDesktop(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleHeroPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion || !isDesktop) return;

    const rect = event.currentTarget.getBoundingClientRect();
    artPointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 18);
    artPointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 12);
  };

  const resetHeroPointer = () => {
    artPointerX.set(0);
    artPointerY.set(0);
  };

  return (
    <section
      ref={heroRef}
      onPointerMove={handleHeroPointerMove}
      onPointerLeave={resetHeroPointer}
      className="relative -mt-24 min-h-screen overflow-hidden lg:h-[160vh] lg:overflow-visible"
    >
      <div className="hero-editorial-stage relative min-h-screen overflow-hidden pt-24 lg:sticky lg:top-0 lg:h-screen">
        <div aria-hidden="true" className="absolute inset-0 bg-noise" />
        <motion.div
          aria-hidden="true"
          style={
            prefersReducedMotion || !isDesktop
              ? { scale: 1, x: 0, y: 0 }
              : { scale: sceneScale, x: sceneX, y: sceneY }
          }
          className="absolute inset-0 will-change-transform"
        >
          <motion.div
            style={
              prefersReducedMotion || !isDesktop
                ? { x: 0, y: 0 }
                : { x: smoothArtPointerX, y: smoothArtPointerY }
            }
            className="absolute -inset-5 will-change-transform"
          >
            <div className="hero-editorial-image h-full w-full" />
          </motion.div>
        </motion.div>
        <motion.div
          aria-hidden="true"
          style={
            prefersReducedMotion || !isDesktop
              ? { x: 0, y: 0 }
              : { x: detailPointerX, y: detailPointerY }
          }
          className="hero-paper-details absolute inset-0 will-change-transform"
        >
          <span className="hero-paper-orbit" />
          <span className="hero-paper-chip hero-paper-chip--ivory" />
          <span className="hero-paper-chip hero-paper-chip--sage" />
          <span className="hero-paper-mark" />
        </motion.div>
        <div aria-hidden="true" className="hero-cinematic-bloom absolute inset-0" />
        <div aria-hidden="true" className="cinematic-grid absolute inset-0 opacity-30" />
        <div aria-hidden="true" className="hero-overlay absolute inset-0" />
        <div aria-hidden="true" className="hero-vignette absolute inset-0" />

        <motion.div
          aria-hidden="true"
          style={
            prefersReducedMotion || !isDesktop
              ? { scale: 1, opacity: 0.42 }
              : { scale: frameScale, opacity: frameOpacity }
          }
          className="pointer-events-none absolute inset-5 z-10 rounded-[2rem] border border-line/10 sm:inset-7 lg:inset-10"
        >
          <span className="absolute -left-px -top-px h-16 w-16 border-l border-t border-accent/45" />
          <span className="absolute -bottom-px -right-px h-16 w-16 border-b border-r border-teal/40" />
        </motion.div>

        <div aria-hidden="true" className="pointer-events-none absolute right-4 top-28 z-10 hidden font-display text-[15vw] leading-none text-foreground/[0.025] lg:block">
          01
        </div>

        <div className="section-shell relative z-20 min-h-[calc(100vh-6rem)]">
          <div className="relative z-20 flex min-h-[calc(100vh-6rem)] flex-col justify-between py-10 sm:py-14 lg:py-16">
            <motion.div
              style={
                prefersReducedMotion || !isDesktop
                  ? { y: 0, scale: 1, opacity: 1, transformOrigin: '0% 42%' }
                  : { y: copyY, scale: copyScale, opacity: copyOpacity, transformOrigin: '0% 42%' }
              }
              className="max-w-[68rem] space-y-5 will-change-transform sm:space-y-6 lg:space-y-7"
            >
              <div className="flex items-center gap-4">
                <span className="h-px w-12 bg-accent/70" />
                <p className="text-[10px] uppercase tracking-[0.5em] text-accent/[0.85] sm:text-xs">
                  Projects / Notes / Playground
                </p>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className="text-xs tracking-wide text-foreground/55 sm:text-sm"
              >
                lifuyue / XMU Software Engineering / AI-Native Developer
              </motion.p>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.55 }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: prefersReducedMotion ? 0 : 0.075,
                    },
                  },
                }}
                className="font-display text-[3.35rem] leading-[0.9] tracking-[-0.045em] text-foreground sm:text-7xl lg:text-[clamp(5rem,7.7vw,8.15rem)]"
              >
                {headlineLines.map((line) => (
                  <span key={line} className="block overflow-hidden pb-[0.18em] -mb-[0.18em]">
                    <motion.span
                      className={cn('block', line === 'with AI agents' && 'text-gradient')}
                      variants={{
                        hidden: { y: prefersReducedMotion ? 0 : '112%', opacity: prefersReducedMotion ? 1 : 0 },
                        visible: { y: 0, opacity: 1 },
                      }}
                      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.3 }}
                className="max-w-3xl text-sm leading-7 text-foreground/70 sm:text-base sm:leading-8 lg:text-lg"
              >
                我是 李富悦，厦大软件工程在读。日常做的事情是用 Coding Agent 搭建产品——从想法到可以交付的东西，
                前端、后端、工作流我都自己来。这个站点是我的作品集，也是我边做边想的记录。
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.46 }}
                className="flex flex-wrap gap-3 sm:gap-4"
              >
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
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.6 }}
              className="mt-10 grid gap-5 border-t border-line/10 pt-6 text-sm text-foreground/[0.68] sm:grid-cols-3 lg:mt-4 lg:max-w-[61rem]"
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/[0.42]">Focus</p>
                <p className="mt-2 text-foreground">Full-stack · AI Agent workflows · Idea to shipped product</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/[0.42]">Toolkit</p>
                <p className="mt-2 text-foreground">Claude Code · Codex · Cursor · Gemini & Stitch</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/[0.42]">Current Mode</p>
                <p className="mt-2 text-foreground">Studying · Vibe Coding · Exploring the Edge</p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="absolute bottom-7 right-7 z-30 hidden items-center gap-3 rounded-full border border-line/[0.15] bg-background/20 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-foreground/[0.65] backdrop-blur-md sm:flex lg:bottom-10 lg:right-10"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Scroll to enter
        </motion.div>
      </div>
    </section>
  );
}
