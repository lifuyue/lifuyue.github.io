import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';

export function useScrollAnimation(delay = 0) {
  const prefersReducedMotion = useReducedMotion();
  const easing = [0.22, 1, 0.36, 1] as const;

  return useMemo(
    () =>
      prefersReducedMotion
        ? {
            initial: { opacity: 1, y: 0 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.2 },
          }
        : {
            initial: { opacity: 0, y: 36 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.2 },
            transition: { duration: 0.9, ease: easing, delay },
          },
    [delay, easing, prefersReducedMotion],
  );
}
