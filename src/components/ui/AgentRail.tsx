import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { InlineSvg } from '@/components/ui/InlineSvg';
import { ToolChipRow } from '@/components/ui/ToolChipRow';
import type { AgentConfig } from '@/data/agents';
import { cn } from '@/lib/utils';

interface AgentRailProps {
  agents: AgentConfig[];
  className?: string;
}

const easing = [0.22, 1, 0.36, 1] as const;

export function AgentRail({ agents, className }: AgentRailProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className={cn('hide-scrollbar -mx-2 overflow-x-auto px-2 lg:mx-0 lg:overflow-visible lg:px-0', className)}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: prefersReducedMotion ? 0 : 0.05,
            },
          },
        }}
        className="flex min-w-max snap-x snap-mandatory gap-3 pb-1 sm:gap-4 lg:min-w-0 lg:gap-4 xl:gap-5"
      >
        {agents.map((agent, index) => {
          const isActive = activeId === agent.id;
          const hasActiveItem = activeId !== null;
          const isDimmed = hasActiveItem && !isActive;
          const hasChips = !!agent.chips?.length;

          return (
            <motion.button
              key={agent.id}
              type="button"
              aria-expanded={hasChips ? isActive : undefined}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.75,
                ease: easing,
                delay: prefersReducedMotion ? 0 : index * 0.05,
              }}
              onMouseEnter={() => setActiveId(agent.id)}
              onMouseLeave={() => setActiveId((current) => (current === agent.id ? null : current))}
              onFocus={() => setActiveId(agent.id)}
              onBlur={() => setActiveId((current) => (current === agent.id ? null : current))}
              onClick={() => setActiveId((current) => (current === agent.id ? null : agent.id))}
              className={cn(
                'group relative w-[11rem] snap-start text-left transition-opacity duration-300 focus:outline-none sm:w-[11.5rem] lg:min-w-0 lg:flex-1 lg:basis-0',
                isDimmed && 'opacity-50',
              )}
            >
              <motion.div
                animate={
                  prefersReducedMotion
                    ? undefined
                    : {
                        y: [0, -4, 0, 3, 0],
                      }
                }
                transition={{
                  duration: 5.4 + index * 0.35,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  delay: index * 0.18,
                }}
                className="h-full"
              >
                <div
                  className={cn(
                    'relative flex h-full min-h-[10rem] flex-col justify-between rounded-[1.65rem] border border-line/9 bg-background/12 p-4 backdrop-blur-xl transition-[border-color,background-color] duration-300 sm:min-h-[10.5rem] sm:p-4.5',
                    isActive && 'border-line/20 bg-line/[0.06]',
                  )}
                  style={{
                    boxShadow: isActive ? `0 24px 72px -40px ${agent.glowColor}` : undefined,
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-4 top-0 h-px opacity-70"
                    style={{
                      background: `linear-gradient(90deg, transparent 0%, ${agent.glowColor} 48%, transparent 100%)`,
                    }}
                  />
                    <div className="space-y-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <motion.div
                        animate={{
                          scale: isActive ? 1.12 : 1,
                        }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: easing }}
                        style={{
                          filter: isActive
                            ? `drop-shadow(0 0 16px ${agent.glowColor}) drop-shadow(0 0 34px ${agent.glowColor})`
                            : `drop-shadow(0 0 12px ${agent.glowColor})`,
                        }}
                      >
                        <InlineSvg
                          svg={agent.colorIcon}
                          className="h-9 w-9 sm:h-10 sm:w-10"
                        />
                      </motion.div>
                      <span className="rounded-full border border-line/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.26em] text-foreground/40 sm:text-[10px]">
                        {agent.role}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {agent.textIcon ? (
                        <InlineSvg
                          svg={agent.textIcon}
                          className="h-5 w-auto max-w-[8rem] text-foreground/94 sm:h-5.5 sm:max-w-[8.5rem]"
                        />
                      ) : (
                        <p className="font-display text-xl text-foreground">{agent.name}</p>
                      )}
                      <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/44">{agent.name}</p>
                    </div>
                  </div>

                  <div className="mt-3.5 border-t border-line/8 pt-3">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/36">Agent Rail</p>
                    <AnimatePresence initial={false}>
                      {hasChips && isActive ? (
                        <motion.div
                          key={`${agent.id}-chips`}
                          initial={prefersReducedMotion ? false : { height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                          exit={prefersReducedMotion ? { height: 0, opacity: 0, marginTop: 0 } : { height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: easing }}
                          className="overflow-hidden"
                        >
                          <ToolChipRow
                            items={agent.chips ?? []}
                            chipClassName="border-line/12 bg-line/[0.06] text-foreground/78"
                          />
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
