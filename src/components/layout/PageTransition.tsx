import { motion, useReducedMotion } from 'framer-motion';
import { useLayoutEffect, type PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';

export function PageTransition({ children }: PropsWithChildren) {
  const reduced = useReducedMotion();
  const { pathname, hash } = useLocation();
  useLayoutEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    const top = target ? target.getBoundingClientRect().top + window.scrollY : 0;
    window.scrollTo({ top, behavior: 'instant' });
  }, [pathname, hash]);
  return <motion.div initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.2 }}>{children}</motion.div>;
}
