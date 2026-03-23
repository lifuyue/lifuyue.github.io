import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="glass-panel relative inline-flex h-11 w-11 items-center justify-center rounded-full"
      data-cursor="large"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
          transition={{ duration: 0.28 }}
          className="text-lg"
        >
          {theme === 'dark' ? '☀' : '☾'}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
