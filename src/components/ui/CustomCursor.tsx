import { motion, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';

export function CustomCursor() {
  const { x, y, isHoveringInteractive } = useMousePosition();
  const [enabled, setEnabled] = useState(false);
  const springX = useSpring(x, { stiffness: 420, damping: 32 });
  const springY = useSpring(y, { stiffness: 420, damping: 32 });

  useEffect(() => {
    setEnabled(!window.matchMedia('(pointer: coarse)').matches);
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden mix-blend-difference md:block"
      style={{ x: springX, y: springY }}
      animate={{
        width: isHoveringInteractive ? 56 : 18,
        height: isHoveringInteractive ? 56 : 18,
        opacity: 1,
      }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
    >
      <div className="h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-white/10" />
    </motion.div>
  );
}
