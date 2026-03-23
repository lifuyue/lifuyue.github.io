import { useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'lifuyue-theme';

function applyTheme(theme: Theme) {
  document.documentElement.classList.remove('dark', 'light');
  document.documentElement.classList.add(theme);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    const nextTheme =
      saved ??
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }, []);

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return {
    theme,
    setTheme,
    toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
  };
}
