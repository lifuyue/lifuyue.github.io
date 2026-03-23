import { motion, useReducedMotion } from 'framer-motion';
import type { PropsWithChildren } from 'react';

export function PageTransition({ children }: PropsWithChildren) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        prefersReducedMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 28, clipPath: 'inset(0 0 20% 0 round 2rem)' }
      }
      animate={
        prefersReducedMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0 round 2rem)' }
      }
      exit={
        prefersReducedMotion
          ? { opacity: 0 }
          : { opacity: 0, y: -18, clipPath: 'inset(0 0 100% 0 round 2rem)' }
      }
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
