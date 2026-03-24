import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingChipsProps {
  items: string[];
  radius: number;
  className?: string;
  chipClassName?: string;
}

export function FloatingChips({
  items,
  radius,
  className,
  chipClassName,
}: FloatingChipsProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isActive, setIsActive] = useState(prefersReducedMotion);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onViewportEnter={() => setIsActive(true)}
      className={cn('pointer-events-none absolute inset-0', className)}
    >
      {items.map((item, index) => {
        const angle = (360 / items.length) * index - 90;
        const radians = (angle * Math.PI) / 180;
        const x = Math.cos(radians) * radius * 0.72;
        const y = Math.sin(radians) * radius * 0.72;
        const orbitDuration = 20 + (index % 4) * 3;
        const floatDistance = 6 + (index % 3);

        if (prefersReducedMotion) {
          return (
            <div
              key={item}
              className={cn(
                'absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/10 bg-line/5 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-foreground/90 backdrop-blur-sm',
                chipClassName,
              )}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
              }}
            >
              {item}
            </div>
          );
        }

        return (
          <motion.div
            key={item}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
            className="absolute left-1/2 top-1/2 h-0 w-0"
          >
            <motion.div
              animate={isActive ? { rotate: [angle, angle + 360] } : { rotate: angle }}
              transition={{
                duration: orbitDuration,
                ease: 'linear',
                repeat: Infinity,
              }}
              className="relative"
            >
              <motion.div
                className={cn(
                  'absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/10 bg-line/5 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-foreground/90 backdrop-blur-sm',
                  chipClassName,
                )}
                style={{ x: radius }}
                animate={
                  isActive
                    ? {
                        rotate: [-angle, -angle - 360],
                        y: [0, -floatDistance, 0, floatDistance, 0],
                      }
                    : {
                        rotate: -angle,
                        y: 0,
                      }
                }
                transition={{
                  rotate: {
                    duration: orbitDuration,
                    ease: 'linear',
                    repeat: Infinity,
                  },
                  y: {
                    duration: 3 + (index % 3),
                    ease: 'easeInOut',
                    repeat: Infinity,
                  },
                }}
              >
                {item}
              </motion.div>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
