import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export function CustomCursor() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const x = useSpring(rawX, { stiffness: 350, damping: 35 });
  const y = useSpring(rawY, { stiffness: 350, damping: 35 });
  useEffect(() => {
    if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const move = (event: PointerEvent) => {
      rawX.set(event.clientX); rawY.set(event.clientY); setVisible(true);
      setActive(event.target instanceof Element && !!event.target.closest('a,button,select'));
    };
    const leave = () => setVisible(false);
    window.addEventListener('pointermove', move);
    document.addEventListener('pointerleave', leave);
    return () => { window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); };
  }, [rawX, rawY, reduced]);
  if (reduced) return null;
  return <motion.div aria-hidden="true" className="reset-cursor" style={{ x, y }} animate={{ opacity: visible ? 1 : 0, scale: active ? 2.4 : 1 }}><span /></motion.div>;
}
