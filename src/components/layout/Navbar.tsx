import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Works', to: '/works' },
  { label: 'Blog', to: '/blog' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="section-shell">
        <div className="glass-panel flex items-center justify-between rounded-full px-4 py-3 sm:px-6">
          <Link to="/" className="font-display text-xl text-white">
            Lifuyue
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'rounded-full px-4 py-2 text-sm uppercase tracking-[0.24em] text-zinc-300 hover:text-white',
                  pathname === link.to && 'bg-white/10 text-white',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <MagneticButton to="/blog" className="px-4 py-2 text-xs">
              Journal
            </MagneticButton>
            <ThemeToggle />
          </div>
          <button
            type="button"
            className="md:hidden"
            onClick={() => setOpen((current) => !current)}
            aria-label="Toggle navigation"
          >
            <span className="block h-0.5 w-6 bg-white" />
            <span className="mt-1.5 block h-0.5 w-6 bg-white" />
          </button>
        </div>
        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="glass-panel mt-3 rounded-[1.75rem] p-4 md:hidden"
            >
              <div className="flex flex-col gap-3">
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl border border-white/10 px-4 py-3 text-sm uppercase tracking-[0.2em] text-zinc-200"
                  >
                    {link.label}
                  </Link>
                ))}
                <ThemeToggle />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}
