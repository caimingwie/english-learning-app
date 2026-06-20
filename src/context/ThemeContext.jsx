import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { useAppContext } from './AppContext';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const { state, updateSetting } = useAppContext();
  const theme = state.settings?.theme || 'auto';

  // Apply theme to <html> element
  const applyTheme = useCallback((resolvedTheme) => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    // Update meta theme-color
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.content = resolvedTheme === 'dark' ? '#000000' : '#f0f2f5';
    }
  }, []);

  // Resolve 'auto' theme based on system preference
  useEffect(() => {
    if (theme === 'auto') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e) => applyTheme(e.matches ? 'dark' : 'light');
      handler(mq);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      applyTheme(theme);
    }
  }, [theme, applyTheme]);

  const setTheme = useCallback((newTheme) => {
    updateSetting('theme', newTheme);
  }, [updateSetting]);

  const value = { theme, setTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
