import { useEffect, useState } from 'react';

export type ThemePreference = 'system' | 'dark' | 'light';
export type ResolvedTheme = 'dark' | 'light';

const STORAGE_KEY = 'lifuyue-theme';
const THEME_EVENT = 'lifuyue-theme-change';
const THEME_TRANSITION_CLASS = 'theme-transition';
const THEME_TRANSITION_DURATION_MS = 160;

function applyTheme(theme: ResolvedTheme) {
  const root = document.documentElement;
  const shouldAnimate =
    typeof window !== 'undefined' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (shouldAnimate) {
    root.classList.add(THEME_TRANSITION_CLASS);
    window.clearTimeout((window as Window & { __themeTransitionTimer?: number }).__themeTransitionTimer);
  }

  root.classList.remove('dark', 'light');
  root.classList.add(theme);

  if (shouldAnimate) {
    (window as Window & { __themeTransitionTimer?: number }).__themeTransitionTimer =
      window.setTimeout(() => {
        root.classList.remove(THEME_TRANSITION_CLASS);
      }, THEME_TRANSITION_DURATION_MS);
  }
}

function readSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function readThemePreference(): ThemePreference {
  if (typeof window === 'undefined') {
    return 'system';
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);

  if (saved === 'system' || saved === 'light' || saved === 'dark') {
    return saved;
  }

  return 'system';
}

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  return preference === 'system' ? readSystemTheme() : preference;
}

function dispatchThemeChange(themePreference: ThemePreference, resolvedTheme: ResolvedTheme) {
  window.dispatchEvent(
    new CustomEvent(THEME_EVENT, {
      detail: {
        themePreference,
        resolvedTheme,
      },
    }),
  );
}

function syncTheme(themePreference: ThemePreference) {
  const resolvedTheme = resolveTheme(themePreference);

  applyTheme(resolvedTheme);

  try {
    window.localStorage.setItem(STORAGE_KEY, themePreference);
  } catch {
    // Ignore storage write failures and keep the theme applied in-memory.
  }

  dispatchThemeChange(themePreference, resolvedTheme);
  return resolvedTheme;
}

export function useTheme() {
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>(() =>
    readThemePreference(),
  );
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(readThemePreference()),
  );

  useEffect(() => {
    const nextPreference = readThemePreference();
    const nextResolvedTheme = resolveTheme(nextPreference);

    applyTheme(nextResolvedTheme);
    setThemePreferenceState(nextPreference);
    setResolvedTheme(nextResolvedTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

    const handleMediaChange = () => {
      if (readThemePreference() !== 'system') {
        return;
      }

      const nextSystemTheme = resolveTheme('system');
      applyTheme(nextSystemTheme);
      setThemePreferenceState('system');
      setResolvedTheme(nextSystemTheme);
      dispatchThemeChange('system', nextSystemTheme);
    };

    const handleThemeChange = (
      event: Event,
    ) => {
      const customEvent = event as CustomEvent<{
        themePreference: ThemePreference;
        resolvedTheme: ResolvedTheme;
      }>;

      setThemePreferenceState(customEvent.detail.themePreference);
      setResolvedTheme(customEvent.detail.resolvedTheme);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) {
        return;
      }

      const nextStoredPreference = readThemePreference();
      const nextStoredResolvedTheme = resolveTheme(nextStoredPreference);

      applyTheme(nextStoredResolvedTheme);
      setThemePreferenceState(nextStoredPreference);
      setResolvedTheme(nextStoredResolvedTheme);
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    window.addEventListener(THEME_EVENT, handleThemeChange as EventListener);
    window.addEventListener('storage', handleStorage);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener(THEME_EVENT, handleThemeChange as EventListener);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const setThemePreference = (nextThemePreference: ThemePreference) => {
    const nextResolvedTheme = syncTheme(nextThemePreference);

    setThemePreferenceState(nextThemePreference);
    setResolvedTheme(nextResolvedTheme);
  };

  return {
    themePreference,
    resolvedTheme,
    setThemePreference,
  };
}
