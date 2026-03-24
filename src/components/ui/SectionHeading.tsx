import { motion } from 'framer-motion';
import { AnimatedText } from '@/components/ui/AnimatedText';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-accent/80">
        {eyebrow}
      </p>
      <AnimatedText
        text={title}
        className="font-display text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl"
      />
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: '9rem', opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="mt-5 h-px rounded-full bg-gradient-to-r from-amber-300 via-teal-300 to-transparent"
      />
      <p className="mt-6 max-w-2xl text-base leading-8 text-foreground/70 sm:text-lg">
        {description}
      </p>
    </div>
  );
}
