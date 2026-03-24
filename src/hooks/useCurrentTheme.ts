import { useEffect, useState } from 'react';
import type { ResolvedTheme } from '@/hooks/useTheme';

function readCurrentTheme(): ResolvedTheme {
  if (typeof document === 'undefined') {
    return 'dark';
  }

  return document.documentElement.classList.contains('light') ? 'light' : 'dark';
}

export function useCurrentTheme() {
  const [theme, setTheme] = useState<ResolvedTheme>(() => readCurrentTheme());

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
