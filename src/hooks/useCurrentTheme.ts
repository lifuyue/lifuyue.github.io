import { useEffect, useState } from 'react';
import type { Theme } from '@/hooks/useTheme';

function readCurrentTheme(): Theme {
  if (typeof document === 'undefined') {
    return 'dark';
  }

  return document.documentElement.classList.contains('light') ? 'light' : 'dark';
}

export function useCurrentTheme() {
  const [theme, setTheme] = useState<Theme>(() => readCurrentTheme());

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setTheme(readCurrentTheme());
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return theme;
}
