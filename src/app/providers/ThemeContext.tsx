// ============================================================
// FitFolk Theme Context – Dark / Light mode management
// ============================================================

import React, {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';

import { useDemoContext } from './DemoContext';

interface ThemeContextValue {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { state, toggleTheme } = useDemoContext();
  const theme = state.theme;

  // Keep `document.documentElement` class in sync with the current theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Access the current theme and toggle function.
 * Must be used within a ThemeProvider (which itself must be inside DemoProvider).
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a <ThemeProvider>');
  }
  return ctx;
}

export default ThemeProvider;
