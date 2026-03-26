import { lazy, Suspense, useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { InlineSvg } from '@/components/ui/InlineSvg';
import { MagneticButton } from '@/components/ui/MagneticButton';
import type { AgentConfig } from '@/data/agents';
import { heroAgents } from '@/data/agents';
import githubSvg from '@/assets/logos/github.svg?raw';
import xSvg from '@/assets/logos/x.svg?raw';
import { cn } from '@/lib/utils';

const HeroScene = lazy(() => import('@/components/three/HeroScene'));
const headlineLines = ['Hi, I build things', 'with AI agents', 'and ship them.'];

interface ObstacleRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AgentPhysicsState {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  scale: number;
  opacity: number;
  glowAlpha: number;
  width: number;
  height: number;
  initialized: boolean;
  dragging: boolean;
  pointerId: number | null;
  pointerOffsetX: number;
  pointerOffsetY: number;
  lastPointerX: number;
  lastPointerY: number;
  lastPointerTime: number;
}

interface HeroAgentLayout {
  className: string;
  anchor: { x: number; y: number };
  offset?: { x: number; y: number };
  initialVelocity?: { x: number; y: number };
  cardClassName: string;
  iconClassName: string;
  textIconClassName: string;
  springStiffness: number;
  springDamping: number;
  noiseAmplitude: number;
  noiseSeed: number;
  friction: number;
  repelStrength: number;
}

const MAX_AGENT_ROTATION = 8;
const MAX_AGENT_SCALE_BOOST = 0.06;
const MOUSE_REPEL_RADIUS = 120;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const noise = (time: number, seed: number) =>
  Math.sin(time * 0.7 + seed) * 0.5 +
  Math.sin(time * 1.3 + seed * 2.1) * 0.3 +
  Math.sin(time * 2.1 + seed * 0.7) * 0.2;

const withAlpha = (color: string, alpha: number) => {
  const match = color.match(/rgba?\(([^)]+)\)/);
  if (!match) {
    return color;
  }

  const channels = match[1].split(',').map((part) => part.trim());
  return `rgba(${channels[0]}, ${channels[1]}, ${channels[2]}, ${alpha.toFixed(3)})`;
};

const heroAgentsById = Object.fromEntries(heroAgents.map((agent) => [agent.id, agent])) as Record<
  string,
  AgentConfig
>;

const heroAgentLayouts: Record<
  string,
  HeroAgentLayout
> = {
  'claude-code': {
    className: 'w-[7.5rem] sm:w-[8.5rem] lg:w-[9rem] xl:w-[9.5rem]',
    anchor: { x: 0.72, y: 0.18 },
    offset: { x: 8, y: 0 },
    initialVelocity: { x: 42, y: 18 },
    cardClassName:
      'ring-1 ring-inset ring-amber-300/12 bg-[linear-gradient(145deg,rgba(245,158,11,0.05),rgba(255,255,255,0.012))]',
    iconClassName:
      'h-8 w-8 drop-shadow-[0_14px_30px_rgba(245,158,11,0.22)] sm:h-9 sm:w-9 lg:h-10 lg:w-10',
    textIconClassName: 'h-4 w-[5.8rem] text-foreground/94 sm:h-[1.05rem] sm:w-[6.4rem] lg:h-[1.15rem] lg:w-[6.9rem]',
    springStiffness: 0.6,
    springDamping: 0.16,
    noiseAmplitude: 12,
    noiseSeed: 0.9,
    friction: 0.997,
    repelStrength: 135,
  },
  codex: {
    className: 'w-[7.5rem] sm:w-[8.5rem] lg:w-[9rem] xl:w-[9.5rem]',
    anchor: { x: 0.82, y: 0.56 },
    offset: { x: 0, y: 0 },
    initialVelocity: { x: -40, y: 24 },
    cardClassName:
      'ring-1 ring-inset ring-teal-300/12 bg-[linear-gradient(145deg,rgba(45,212,191,0.05),rgba(255,255,255,0.012))]',
    iconClassName:
      'h-[2.125rem] w-[2.125rem] drop-shadow-[0_14px_32px_rgba(45,212,191,0.22)] sm:h-[2.375rem] sm:w-[2.375rem] lg:h-[2.625rem] lg:w-[2.625rem]',
    textIconClassName:
      'h-[1.125rem] w-[5rem] text-foreground/95 sm:h-5 sm:w-[5.8rem] lg:h-[1.35rem] lg:w-[6.2rem]',
    springStiffness: 1.8,
    springDamping: 0.12,
    noiseAmplitude: 24,
    noiseSeed: 2.4,
    friction: 0.994,
    repelStrength: 195,
  },
  gemini: {
    className: 'w-[7.5rem] sm:w-[8.5rem] lg:w-[9rem] xl:w-[9.5rem]',
    anchor: { x: 0.58, y: 0.34 },
    offset: { x: 0, y: 0 },
    initialVelocity: { x: 34, y: -30 },
    cardClassName:
      'ring-1 ring-inset ring-sky-300/12 bg-[linear-gradient(145deg,rgba(96,165,250,0.05),rgba(255,255,255,0.012))]',
    iconClassName:
      'h-[2.125rem] w-[2.125rem] drop-shadow-[0_16px_34px_rgba(96,165,250,0.22)] sm:h-[2.375rem] sm:w-[2.375rem] lg:h-[2.625rem] lg:w-[2.625rem]',
    textIconClassName: 'h-[1.125rem] w-[4.8rem] text-foreground/95 sm:h-5 sm:w-[5.5rem] lg:h-[1.35rem] lg:w-[6rem]',
    springStiffness: 1.0,
    springDamping: 0.14,
    noiseAmplitude: 18,
    noiseSeed: 4.2,
    friction: 0.996,
    repelStrength: 165,
  },
};

function HeroAgentCard({
  agent,
  surfaceRef,
}: {
  agent: AgentConfig;
  surfaceRef?: (element: HTMLDivElement | null) => void;
}) {
  const layout = heroAgentLayouts[agent.id];

  return (
    <div
      ref={surfaceRef}
      className={cn(
        'relative aspect-square overflow-hidden rounded-[1.3rem] p-3 backdrop-blur-sm sm:p-3.5',
        layout.cardClassName,
      )}
      style={{
        boxShadow: `0 20px 48px -36px ${withAlpha(agent.glowColor, 0.22)}`,
      }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-4 top-0 h-px opacity-75"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${agent.glowColor} 48%, transparent 100%)`,
        }}
      />
      <div className="relative flex h-full flex-col items-center justify-center gap-3 text-center sm:gap-3.5">
        <div className="flex flex-col items-center gap-2.5 sm:gap-3">
          <InlineSvg svg={agent.colorIcon} className={layout.iconClassName} />
          {agent.textIcon ? (
            <InlineSvg svg={agent.textIcon} className={layout.textIconClassName} />
          ) : (
            <p className="font-display text-xl text-foreground">{agent.name}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function FloatingAgentCluster({
  className,
  obstacleRefs,
}: {
  className?: string;
  obstacleRefs: RefObject<HTMLElement | null>[];
}) {
  const prefersReducedMotion = !!useReducedMotion();
  const playgroundRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const surfaceRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const statesRef = useRef<AgentPhysicsState[]>(
    heroAgents.map((agent) => ({
      id: agent.id,
      x: 0,
      y: 0,
      vx: heroAgentLayouts[agent.id].initialVelocity?.x ?? 0,
      vy: heroAgentLayouts[agent.id].initialVelocity?.y ?? 0,
      rotation: 0,
      scale: 1,
      opacity: 1,
      glowAlpha: 0.22,
      width: 0,
      height: 0,
      initialized: false,
      dragging: false,
      pointerId: null,
      pointerOffsetX: 0,
      pointerOffsetY: 0,
      lastPointerX: 0,
      lastPointerY: 0,
      lastPointerTime: 0,
    })),
  );

  const applyStateStyles = (state: AgentPhysicsState) => {
    const element = cardRefs.current[state.id];
    if (!element) {
      return;
    }

    const surface = surfaceRefs.current[state.id];
    const agent = heroAgentsById[state.id];

    element.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) rotate(${(
      prefersReducedMotion ? 0 : state.rotation
    ).toFixed(2)}deg) scale(${(prefersReducedMotion ? 1 : state.scale).toFixed(3)})`;
    element.style.opacity = `${prefersReducedMotion ? 1 : state.opacity}`;

    if (surface) {
      surface.style.boxShadow = `0 20px 50px -34px ${withAlpha(
        agent.glowColor,
        prefersReducedMotion ? 0.22 : state.glowAlpha,
      )}`;
    }
  };

  const syncVisualEnergy = (state: AgentPhysicsState, easing = 0.12) => {
    const speed = Math.hypot(state.vx, state.vy);
    const targetRotation = clamp(state.vx / 28, -MAX_AGENT_ROTATION, MAX_AGENT_ROTATION);
    const targetScale = 1 + Math.min(speed / 600, MAX_AGENT_SCALE_BOOST);
    const targetGlowAlpha = clamp(0.15 + speed / 1700, 0.15, 0.5);

    state.rotation += (targetRotation - state.rotation) * easing;
    state.scale += (targetScale - state.scale) * easing;
    state.glowAlpha += (targetGlowAlpha - state.glowAlpha) * easing;
  };

  useLayoutEffect(() => {
    const playground = playgroundRef.current;
    if (!playground) {
      return;
    }

    let frameId = 0;
    let resizeObserver: ResizeObserver | null = null;
    let containerWidth = 0;
    let containerHeight = 0;
    let obstacles: ObstacleRect[] = [];
    const timeoutIds: number[] = [];

    const applyTransforms = () => {
      statesRef.current.forEach((state) => {
        applyStateStyles(state);
      });
    };

    const clampToBounds = (state: AgentPhysicsState) => {
      const maxX = Math.max(containerWidth - state.width, 0);
      const maxY = Math.max(containerHeight - state.height, 0);
      state.x = Math.min(Math.max(state.x, 0), maxX);
      state.y = Math.min(Math.max(state.y, 0), maxY);
    };

    const getAnchorPosition = (state: AgentPhysicsState) => {
      const layout = heroAgentLayouts[state.id];
      return {
        x: clamp(
          layout.anchor.x * Math.max(containerWidth - state.width, 0) + (layout.offset?.x ?? 0),
          0,
          Math.max(containerWidth - state.width, 0),
        ),
        y: clamp(
          layout.anchor.y * Math.max(containerHeight - state.height, 0) + (layout.offset?.y ?? 0),
          0,
          Math.max(containerHeight - state.height, 0),
        ),
      };
    };

    const getObstacles = () =>
      obstacleRefs
        .map((ref) => {
          const element = ref.current;
          if (!element) {
            return null;
          }

          const containerRect = playground.getBoundingClientRect();
          const rect = element.getBoundingClientRect();

          return {
            x: rect.left - containerRect.left,
            y: rect.top - containerRect.top,
            width: rect.width,
            height: rect.height,
          };
        })
        .filter((item): item is ObstacleRect => item !== null);

    const resolveObstacleCollision = (state: AgentPhysicsState, obstacle: ObstacleRect) => {
      const overlapX =
        Math.min(state.x + state.width, obstacle.x + obstacle.width) - Math.max(state.x, obstacle.x);
      const overlapY =
        Math.min(state.y + state.height, obstacle.y + obstacle.height) - Math.max(state.y, obstacle.y);

      if (overlapX <= 0 || overlapY <= 0) {
        return;
      }

      const stateCenterX = state.x + state.width / 2;
      const stateCenterY = state.y + state.height / 2;
      const obstacleCenterX = obstacle.x + obstacle.width / 2;
      const obstacleCenterY = obstacle.y + obstacle.height / 2;

      if (overlapX < overlapY) {
        if (stateCenterX < obstacleCenterX) {
          state.x -= overlapX;
          state.vx = -Math.abs(state.vx) * 0.94;
        } else {
          state.x += overlapX;
          state.vx = Math.abs(state.vx) * 0.94;
        }
      } else {
        if (stateCenterY < obstacleCenterY) {
          state.y -= overlapY;
          state.vy = -Math.abs(state.vy) * 0.94;
        } else {
          state.y += overlapY;
          state.vy = Math.abs(state.vy) * 0.94;
        }
      }

      clampToBounds(state);
    };

    const resolveBoundaryCollision = (state: AgentPhysicsState) => {
      const maxX = Math.max(containerWidth - state.width, 0);
      const maxY = Math.max(containerHeight - state.height, 0);

      if (state.x <= 0) {
        state.x = 0;
        state.vx = Math.abs(state.vx) * 0.96;
      } else if (state.x >= maxX) {
        state.x = maxX;
        state.vx = -Math.abs(state.vx) * 0.96;
      }

      if (state.y <= 0) {
        state.y = 0;
        state.vy = Math.abs(state.vy) * 0.96;
      } else if (state.y >= maxY) {
        state.y = maxY;
        state.vy = -Math.abs(state.vy) * 0.96;
      }
    };

    const resolveAgentCollision = (first: AgentPhysicsState, second: AgentPhysicsState) => {
      const overlapX =
        Math.min(first.x + first.width, second.x + second.width) - Math.max(first.x, second.x);
      const overlapY =
        Math.min(first.y + first.height, second.y + second.height) - Math.max(first.y, second.y);

      if (overlapX <= 0 || overlapY <= 0) {
        return;
      }

      if (overlapX < overlapY) {
        const direction = first.x + first.width / 2 < second.x + second.width / 2 ? -1 : 1;
        const separation = overlapX / (first.dragging || second.dragging ? 1 : 2);
        const impulse = (first.dragging || second.dragging ? 82 : 48) + overlapX * 0.45;

        if (!first.dragging) {
          first.x += direction * separation;
        }
        if (!second.dragging) {
          second.x -= direction * separation;
        }

        if (!first.dragging) {
          first.vx = first.vx * 0.68 + direction * impulse;
        }
        if (!second.dragging) {
          second.vx = second.vx * 0.68 - direction * impulse;
        }
      } else {
        const direction = first.y + first.height / 2 < second.y + second.height / 2 ? -1 : 1;
        const separation = overlapY / (first.dragging || second.dragging ? 1 : 2);
        const impulse = (first.dragging || second.dragging ? 76 : 42) + overlapY * 0.45;

        if (!first.dragging) {
          first.y += direction * separation;
        }
        if (!second.dragging) {
          second.y -= direction * separation;
        }

        if (!first.dragging) {
          first.vy = first.vy * 0.68 + direction * impulse;
        }
        if (!second.dragging) {
          second.vy = second.vy * 0.68 - direction * impulse;
        }
      }

      clampToBounds(first);
      clampToBounds(second);
    };

    const measure = () => {
      containerWidth = playground.clientWidth;
      containerHeight = playground.clientHeight;
      obstacles = getObstacles();

      if (labelRef.current) {
        const labelRect = labelRef.current.getBoundingClientRect();
        const containerRect = playground.getBoundingClientRect();
        obstacles.push({
          x: labelRect.left - containerRect.left - 10,
          y: labelRect.top - containerRect.top - 8,
          width: labelRect.width + 20,
          height: labelRect.height + 16,
        });
      }

      statesRef.current.forEach((state) => {
        const element = cardRefs.current[state.id];
        if (!element) {
          return;
        }

        state.width = element.offsetWidth;
        state.height = element.offsetHeight;
        const anchor = getAnchorPosition(state);

        if (!state.initialized || prefersReducedMotion) {
          state.x = anchor.x;
          state.y = anchor.y;
          state.vx = prefersReducedMotion ? 0 : state.vx;
          state.vy = prefersReducedMotion ? 0 : state.vy;
          state.rotation = 0;
          state.scale = 1;
          state.opacity = 1;
          state.glowAlpha = 0.22;
          state.initialized = true;
        }

        clampToBounds(state);
        obstacles.forEach((obstacle) => resolveObstacleCollision(state, obstacle));
      });

      applyTransforms();
    };

    const startEntrance = () => {
      heroAgents.forEach((agent, index) => {
        const state = statesRef.current.find((item) => item.id === agent.id);
        const element = cardRefs.current[agent.id];
        if (!state || !element) {
          return;
        }

        state.scale = 0.7;
        state.opacity = 0;
        state.rotation = 0;
        applyStateStyles(state);

        const enterDelay = index * 150;
        timeoutIds.push(
          window.setTimeout(() => {
            element.style.transition =
              'transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 600ms cubic-bezier(0.22, 1, 0.36, 1)';
            state.scale = 1;
            state.opacity = 1;
            applyStateStyles(state);
          }, enterDelay),
        );
      });

      timeoutIds.push(
        window.setTimeout(() => {
          statesRef.current.forEach((state) => {
            const element = cardRefs.current[state.id];
            if (!element) {
              return;
            }

            element.style.transition = '';
          });

          frameId = requestAnimationFrame(step);
        }, 960),
      );
    };

    const step = (now: number) => {
      const delta =
        Math.min(
          (step as typeof step & { lastTime?: number }).lastTime
            ? now - ((step as typeof step & { lastTime?: number }).lastTime as number)
            : 16,
          32,
        ) / 1000;
      (step as typeof step & { lastTime?: number }).lastTime = now;
      const time = now / 1000;

      statesRef.current.forEach((state) => {
        if (state.dragging) {
          syncVisualEnergy(state, 0.18);
          return;
        }

        const layout = heroAgentLayouts[state.id];
        const anchor = getAnchorPosition(state);
        const centerX = state.x + state.width / 2;
        const centerY = state.y + state.height / 2;
        const driftX = noise(time, layout.noiseSeed) * layout.noiseAmplitude;
        const driftY = noise(time + 11.8, layout.noiseSeed + 7.4) * layout.noiseAmplitude;

        state.vx += (anchor.x - state.x) * layout.springStiffness * delta;
        state.vy += (anchor.y - state.y) * layout.springStiffness * delta;
        state.vx += driftX * delta;
        state.vy += driftY * delta;

        if (mouseRef.current.active) {
          const dx = centerX - mouseRef.current.x;
          const dy = centerY - mouseRef.current.y;
          const distance = Math.hypot(dx, dy);

          if (distance > 0 && distance < MOUSE_REPEL_RADIUS) {
            const force = (1 - distance / MOUSE_REPEL_RADIUS) * layout.repelStrength;
            state.vx += (dx / distance) * force * delta;
            state.vy += (dy / distance) * force * delta;
          }
        }

        const dampingFactor = Math.max(0, 1 - layout.springDamping * delta);
        state.vx *= layout.friction * dampingFactor;
        state.vy *= layout.friction * dampingFactor;
        state.x += state.vx * delta;
        state.y += state.vy * delta;
        resolveBoundaryCollision(state);
        syncVisualEnergy(state);
      });

      statesRef.current.forEach((state) => {
        obstacles.forEach((obstacle) => resolveObstacleCollision(state, obstacle));
      });

      for (let index = 0; index < statesRef.current.length; index += 1) {
        for (let pairIndex = index + 1; pairIndex < statesRef.current.length; pairIndex += 1) {
          resolveAgentCollision(statesRef.current[index], statesRef.current[pairIndex]);
        }
      }

      applyTransforms();
      frameId = requestAnimationFrame(step);
    };

    const handleWindowPointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') {
        mouseRef.current.active = false;
        return;
      }

      const rect = playground.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!inside) {
        mouseRef.current.active = false;
        return;
      }

      mouseRef.current.x = event.clientX - rect.left;
      mouseRef.current.y = event.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleWindowPointerLeave = () => {
      mouseRef.current.active = false;
    };

    measure();

    resizeObserver = new ResizeObserver(() => {
      measure();
    });

    resizeObserver.observe(playground);
    if (labelRef.current) {
      resizeObserver.observe(labelRef.current);
    }
    obstacleRefs.forEach((ref) => {
      if (ref.current) {
        resizeObserver?.observe(ref.current);
      }
    });
    statesRef.current.forEach((state) => {
      const element = cardRefs.current[state.id];
      if (element) {
        resizeObserver?.observe(element);
      }
    });

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerleave', handleWindowPointerLeave);

    if (prefersReducedMotion) {
      applyTransforms();
    } else {
      startEntrance();
    }

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerleave', handleWindowPointerLeave);
    };
  }, [obstacleRefs, prefersReducedMotion]);

  const handlePointerDown = (agentId: string, event: React.PointerEvent<HTMLDivElement>) => {
    const playground = playgroundRef.current;
    const target = event.currentTarget;
    const state = statesRef.current.find((item) => item.id === agentId);

    if (!playground || !state) {
      return;
    }

    const containerRect = playground.getBoundingClientRect();
    state.dragging = true;
    state.pointerId = event.pointerId;
    state.pointerOffsetX = event.clientX - containerRect.left - state.x;
    state.pointerOffsetY = event.clientY - containerRect.top - state.y;
    state.lastPointerX = event.clientX;
    state.lastPointerY = event.clientY;
    state.lastPointerTime = performance.now();
    target.style.zIndex = '30';
    target.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (agentId: string, event: React.PointerEvent<HTMLDivElement>) => {
    const playground = playgroundRef.current;
    const state = statesRef.current.find((item) => item.id === agentId);

    if (!playground || !state || !state.dragging || state.pointerId !== event.pointerId) {
      return;
    }

    const containerRect = playground.getBoundingClientRect();
    const now = performance.now();
    const dt = Math.max((now - state.lastPointerTime) / 1000, 0.016);

    state.x = event.clientX - containerRect.left - state.pointerOffsetX;
    state.y = event.clientY - containerRect.top - state.pointerOffsetY;
    state.vx = ((event.clientX - state.lastPointerX) / dt) * 0.14;
    state.vy = ((event.clientY - state.lastPointerY) / dt) * 0.14;
    state.lastPointerX = event.clientX;
    state.lastPointerY = event.clientY;
    state.lastPointerTime = now;

    const maxX = Math.max(playground.clientWidth - state.width, 0);
    const maxY = Math.max(playground.clientHeight - state.height, 0);
    state.x = Math.min(Math.max(state.x, 0), maxX);
    state.y = Math.min(Math.max(state.y, 0), maxY);
    syncVisualEnergy(state, 0.22);
    applyStateStyles(state);
  };

  const handlePointerUp = (agentId: string, event: React.PointerEvent<HTMLDivElement>) => {
    const state = statesRef.current.find((item) => item.id === agentId);

    if (!state || state.pointerId !== event.pointerId) {
      return;
    }

    state.dragging = false;
    state.pointerId = null;
    event.currentTarget.style.zIndex = '20';
  };

  return (
    <motion.div
      ref={playgroundRef}
      className={cn(
        'pointer-events-none absolute inset-0 hidden overflow-hidden lg:block',
        className,
      )}
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.2 }}
    >
      <p
        ref={labelRef}
        className="absolute right-4 top-28 z-10 text-[10px] uppercase tracking-[0.28em] text-foreground/35 xl:right-6"
      >
        Agents In Motion
      </p>
      {heroAgents.map((agent) => {
        const layout = heroAgentLayouts[agent.id];

        return (
          <div
            key={agent.id}
            ref={(element) => {
              cardRefs.current[agent.id] = element;
            }}
            onPointerDown={(event) => handlePointerDown(agent.id, event)}
            onPointerMove={(event) => handlePointerMove(agent.id, event)}
            onPointerUp={(event) => handlePointerUp(agent.id, event)}
            onPointerCancel={(event) => handlePointerUp(agent.id, event)}
            style={{ transform: 'translate3d(0, 0, 0)', opacity: 1 }}
            className={cn(
              'pointer-events-auto absolute left-0 top-0 z-20 touch-none cursor-grab will-change-transform active:cursor-grabbing',
              layout.className,
            )}
          >
            <HeroAgentCard
              agent={agent}
              surfaceRef={(element) => {
                surfaceRefs.current[agent.id] = element;
              }}
            />
          </div>
        );
      })}
    </motion.div>
  );
}

function MobileAgentGrid() {
  return (
    <div className="grid max-w-[20rem] grid-cols-3 gap-3 pt-6 lg:hidden">
      {heroAgents.map((agent) => {
        const layout = heroAgentLayouts[agent.id];

        return (
          <div key={agent.id} className={layout.className}>
            <HeroAgentCard agent={agent} />
          </div>
        );
      })}
    </div>
  );
}

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const copyRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative min-h-[calc(100vh-7rem)] overflow-hidden">
      <div className="absolute inset-0 bg-noise" />
      <div className="absolute inset-0 opacity-90">
        <Suspense fallback={<div className="h-full w-full bg-background/20" />}>
          <HeroScene />
        </Suspense>
      </div>
      <div className="hero-overlay absolute inset-0" />
      <div className="section-shell relative z-10 min-h-[calc(100vh-7rem)]">
        <FloatingAgentCluster obstacleRefs={[copyRef, statsRef]} />
        <div className="relative z-20 flex min-h-[calc(100vh-7rem)] flex-col justify-between py-14 sm:py-16 lg:py-20">
          <div ref={copyRef} className="max-w-[56rem] space-y-6 lg:space-y-7">
            <p className="text-xs uppercase tracking-[0.5em] text-accent/80">
              Projects / Notes / Playground
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-sm tracking-wide text-foreground/55"
            >
              lifuyue / XMU Software Engineering / AI-Native Developer
            </motion.p>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: prefersReducedMotion ? 0 : 0.08,
                  },
                },
              }}
              className="font-display text-5xl leading-[1.02] text-foreground sm:text-6xl lg:text-[4.7rem] xl:text-[5.25rem]"
            >
              {headlineLines.map((line) => (
                <span key={line} className="block overflow-hidden pb-[0.18em] -mb-[0.18em]">
                  <motion.span
                    className="block"
                    variants={{
                      hidden: { y: prefersReducedMotion ? 0 : '110%', opacity: prefersReducedMotion ? 1 : 0 },
                      visible: { y: 0, opacity: 1 },
                    }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35 }}
              className="max-w-3xl text-base leading-8 text-foreground/70 sm:text-lg"
            >
              我是 李富悦，厦大软件工程在读。日常做的事情是用 Coding Agent 搭建产品——从想法到可以交付的东西，
              前端、后端、工作流我都自己来。这个站点是我的作品集，也是我边做边想的记录。
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
            <MobileAgentGrid />
          </div>
          <div
            ref={statsRef}
            className="grid gap-6 pt-8 text-sm text-foreground/70 sm:grid-cols-3 lg:max-w-[56rem]"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-foreground/45">Focus</p>
              <p className="mt-2 text-foreground">Full-stack · AI Agent workflows · Idea to shipped product</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-foreground/45">Toolkit</p>
              <p className="mt-2 text-foreground">Claude Code · Codex · Cursor · Gemini & Stitch</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-foreground/45">Current Mode</p>
              <p className="mt-2 text-foreground">Studying · Vibe Coding · Exploring the Edge</p>
            </div>
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
