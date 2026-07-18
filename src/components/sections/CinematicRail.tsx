import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '@/data/projects';
import type { Project } from '@/types/project';

function RailProjectCard({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <Link
      to={`/works/${project.slug}`}
      className={
        compact
          ? 'rail-project-card group relative block h-[32rem] min-w-[82vw] snap-center overflow-hidden rounded-[1.75rem] border border-line/10 bg-surface/[0.35] sm:min-w-[70vw]'
          : 'rail-project-card group relative block h-[68vh] w-[74vw] shrink-0 overflow-hidden rounded-[2.4rem] border border-line/10 bg-surface/[0.35]'
      }
    >
      <div
        className="absolute inset-0 scale-[1.04] transition-transform duration-700 ease-out group-hover:scale-[1.08]"
        style={{ background: project.cover }}
      />
      <div className="rail-project-scrim absolute inset-0" />
      <div className="rail-project-highlight absolute inset-0" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-line/10 bg-background/10 px-6 py-5 text-[10px] uppercase tracking-[0.34em] text-foreground/[0.55] backdrop-blur-[2px] sm:px-8">
        <span>{project.category}</span>
        <span>{project.year}</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10 lg:p-12">
        <p className="text-xs uppercase tracking-[0.4em] text-accentSoft/70">Selected Work</p>
        <h3 className="mt-4 font-display text-5xl leading-none text-foreground sm:text-6xl lg:text-8xl">
          {project.title}
        </h3>
        <p className="mt-5 max-w-xl text-sm leading-7 text-foreground/[0.68] sm:text-base">
          {project.description}
        </p>
        <div className="mt-7 flex flex-wrap gap-2">
          {project.tags.slice(0, compact ? 3 : 5).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line/[0.14] bg-background/[0.16] px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-foreground/75 backdrop-blur-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute bottom-8 right-8 hidden h-14 w-14 items-center justify-center rounded-full border border-line/20 bg-background/[0.16] text-xl text-foreground backdrop-blur-md transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110 sm:flex">
        ↗
      </div>
    </Link>
  );
}

function NativeRail() {
  return (
    <section className="section-shell section-space overflow-hidden">
      <div className="mb-10 flex items-end justify-between gap-5">
        <div>
          <p className="text-xs uppercase tracking-[0.42em] text-accent/75">Horizontal Study</p>
          <h2 className="mt-4 max-w-3xl font-display text-5xl leading-[0.96] text-foreground sm:text-6xl">
            A wider way through the work.
          </h2>
        </div>
        <p className="hidden text-xs uppercase tracking-[0.32em] text-foreground/40 sm:block">
          Swipe to explore
        </p>
      </div>
      <div
        className="hide-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8"
      >
        {projects.map((project) => (
          <RailProjectCard key={project.slug} project={project} compact />
        ))}
      </div>
    </section>
  );
}

function DesktopCinematicRail() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const { scrollY, scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 95, damping: 28, mass: 0.28 });
  const x = useTransform(progress, [0, 1], [0, -travel]);
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { stiffness: 90, damping: 32, mass: 0.4 });
  const skewX = useTransform(smoothVelocity, [-1800, 0, 1800], [-1.8, 0, 1.8]);
  const progressScale = useTransform(progress, [0, 1], [0, 1]);
  const ambientX = useTransform(progress, [0, 1], ['0%', '-18%']);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      setTravel(Math.max(track.scrollWidth - window.innerWidth, 0));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
      <section
        ref={sectionRef}
        aria-label="Selected work horizontal gallery"
        className="relative h-[360vh]"
      >
        <div className="sticky top-0 h-screen overflow-hidden border-y border-line/[0.08] bg-background">
          <motion.div
            aria-hidden="true"
            style={{ x: ambientX }}
            className="absolute inset-y-0 left-0 w-[140%] bg-[radial-gradient(circle_at_38%_45%,rgba(210,106,69,0.12),transparent_24%),radial-gradient(circle_at_76%_35%,rgba(132,144,120,0.1),transparent_22%)]"
          />
          <div aria-hidden="true" className="cinematic-grid absolute inset-0 opacity-45" />
          <div aria-hidden="true" className="rail-edge-fade absolute inset-0" />

          <div className="absolute inset-x-8 top-24 z-20 flex items-center justify-between text-[10px] uppercase tracking-[0.42em] text-foreground/40 lg:inset-x-12">
            <span>02 / Spatial Index</span>
            <span>Scroll to move sideways</span>
          </div>

          <motion.div
            ref={trackRef}
            style={{ x, skewX, transformOrigin: '50% 50%' }}
            className="absolute inset-y-0 left-0 flex w-max items-center gap-[4vw] px-[8vw] pt-10 will-change-transform"
          >
            <div className="flex h-[68vh] w-[52vw] shrink-0 flex-col justify-between py-7">
              <div>
                <p className="text-xs uppercase tracking-[0.46em] text-accent/75">Horizontal Study</p>
                <h2 className="mt-7 max-w-3xl font-display text-[clamp(4.5rem,7vw,8rem)] leading-[0.88] tracking-[-0.045em] text-foreground">
                  Move through a wider frame.
                </h2>
              </div>
              <div className="flex items-end justify-between gap-8 border-t border-line/10 pt-6">
                <p className="max-w-sm text-sm leading-7 text-foreground/[0.58]">
                  Vertical input becomes horizontal momentum. The next frame always stays in sight.
                </p>
                <span className="font-display text-7xl text-foreground/10">→</span>
              </div>
            </div>

            {projects.map((project) => (
              <RailProjectCard key={project.slug} project={project} />
            ))}

            <div className="flex h-[68vh] w-[50vw] shrink-0 flex-col items-start justify-between rounded-[2.4rem] border border-line/10 bg-line/[0.03] p-10 lg:p-14">
              <p className="text-xs uppercase tracking-[0.42em] text-teal/70">End of track</p>
              <div>
                <p className="font-display text-7xl leading-none text-foreground/[0.12] lg:text-9xl">03</p>
                <h3 className="mt-6 max-w-lg font-display text-5xl leading-[0.95] text-foreground lg:text-7xl">
                  Back to the vertical rhythm.
                </h3>
              </div>
              <Link
                to="/works"
                className="rounded-full border border-line/15 bg-line/5 px-6 py-3 text-xs uppercase tracking-[0.28em] text-foreground/80 hover:border-accent/45 hover:text-foreground"
              >
                View all works ↗
              </Link>
            </div>
          </motion.div>

          <div className="absolute inset-x-8 bottom-8 z-20 h-px overflow-hidden bg-line/10 lg:inset-x-12">
            <motion.div
              style={{ scaleX: progressScale, transformOrigin: '0% 50%' }}
              className="h-full w-full bg-gradient-to-r from-accent via-accentSoft to-teal"
            />
          </div>
        </div>
      </section>
  );
}

export function CinematicRail() {
  const prefersReducedMotion = !!useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 1024px)').matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = () => setIsDesktop(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (prefersReducedMotion || !isDesktop) {
    return <NativeRail />;
  }

  return <DesktopCinematicRail />;
}
