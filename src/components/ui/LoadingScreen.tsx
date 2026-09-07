import { SymbolIcon } from '@/components/ui/SymbolIcon';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function LoadingScreen() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(() => {
    try { return !sessionStorage.getItem('lifuyue-intro-v3'); } catch { return false; }
  });
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false);
      try { sessionStorage.setItem('lifuyue-intro-v3', '1'); } catch { /* Intro still dismisses without storage. */ }
    }, reduced ? 0 : 600);
    return () => window.clearTimeout(timer);
  }, [reduced]);
  return <AnimatePresence>{visible && !reduced && <motion.div aria-hidden="true" className="reset-intro" initial={{ y: 0 }} exit={{ y: '-100%', borderRadius: '0 0 35% 35%' }} transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}><span><SymbolIcon name="asterisk" /></span><p>Hello, world.</p><small>LIFUYUE / PORTFOLIO</small></motion.div>}</AnimatePresence>;
}
