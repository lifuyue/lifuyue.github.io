import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  return (
    <motion.div
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
        const y = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
        setRotate({ x, y });
      }}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={cn(
        'glass-panel relative overflow-hidden rounded-[2rem] p-6 shadow-glow',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-transparent opacity-70" />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
}
