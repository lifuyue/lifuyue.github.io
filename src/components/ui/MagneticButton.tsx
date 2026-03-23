import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  to?: string;
  onClick?: () => void;
}

export function MagneticButton({
  children,
  className,
  href,
  to,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((event.clientX - rect.left) / rect.width - 0.5) * rect.width * 0.3;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * rect.height * 0.3;

    setOffset({ x, y });
  };

  const handleLeave = () => setOffset({ x: 0, y: 0 });

  const sharedClassName = cn(
    'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-5 py-3 text-sm font-semibold tracking-[0.18em] text-white uppercase backdrop-blur-xl hover:border-amber-300/50 hover:bg-white/12',
    className,
  );

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 180, damping: 14, mass: 0.3 }}
      data-cursor="large"
    >
      {to ? (
        <Link to={to} className={sharedClassName}>
          {children}
        </Link>
      ) : href ? (
        <a href={href} className={sharedClassName} target="_blank" rel="noreferrer">
          {children}
        </a>
      ) : (
        <button type="button" onClick={onClick} className={sharedClassName}>
          {children}
        </button>
      )}
    </motion.div>
  );

  return content;
}
