import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

const themeOptions = [
  {
    value: 'system',
    label: 'System',
    description: 'Follow OS appearance',
    icon: '◐',
  },
  {
    value: 'light',
    label: 'Light',
    description: 'Always use light mode',
    icon: '☀',
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Always use dark mode',
    icon: '☾',
  },
] as const;

export function ThemeToggle() {
  const { themePreference, resolvedTheme, setThemePreference } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const activeOption = themeOptions.find((option) => option.value === themePreference) ?? themeOptions[0];

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={`Theme: ${activeOption.label}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={panelId}
        className="glass-panel relative inline-flex h-11 w-11 items-center justify-center rounded-full"
        data-cursor="large"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={themePreference}
            initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
            transition={{ duration: 0.28 }}
            className="text-lg text-foreground"
          >
            {activeOption.icon}
          </motion.span>
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={panelId}
            role="menu"
            aria-label="Theme options"
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel absolute right-0 top-[calc(100%+0.75rem)] z-50 w-48 rounded-[1.5rem] p-2 shadow-glow"
          >
            <div className="mb-2 px-3 pt-2">
              <p className="text-[11px] uppercase tracking-[0.28em] text-foreground/45">Theme</p>
              <p className="mt-1 text-xs text-foreground/55">
                {themePreference === 'system'
                  ? `Following ${resolvedTheme} mode`
                  : `Locked to ${themePreference} mode`}
              </p>
            </div>
            <div className="space-y-1">
              {themeOptions.map((option) => {
                const isActive = option.value === themePreference;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="menuitemradio"
                    aria-checked={isActive}
                    onClick={() => {
                      setThemePreference(option.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-[1rem] px-3 py-2.5 text-left ${
                      isActive
                        ? 'bg-line/10 text-foreground'
                        : 'text-foreground/70 hover:bg-line/8 hover:text-foreground'
                    }`}
                    data-cursor="large"
                  >
                    <span className="text-base">{option.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold uppercase tracking-[0.16em]">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-xs normal-case tracking-normal text-foreground/55">
                        {option.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
