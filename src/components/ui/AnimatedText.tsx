import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export function AnimatedText({ text, className }: AnimatedTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(' ');

  return (
    <motion.span
      className={cn('block', className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: prefersReducedMotion ? 0 : 0.05,
          },
        },
      }}
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="mr-[0.3em] inline-block overflow-hidden pb-[0.18em] -mb-[0.18em]"
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: prefersReducedMotion ? 0 : '110%', opacity: prefersReducedMotion ? 1 : 0 },
              visible: { y: 0, opacity: 1 },
            }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
