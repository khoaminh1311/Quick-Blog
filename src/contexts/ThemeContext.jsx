import { createContext, useEffect, useState } from 'react';
import { storage } from '../utils/storage';

export const ThemeContext = createContext(); // eslint-disable-line react-refresh/only-export-components

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = storage.getTheme();
    if (savedTheme === 'dark') return true;
    if (savedTheme === 'light') return false;
    // Fallback to system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      storage.setTheme('dark');
    } else {
      root.classList.remove('dark');
      storage.setTheme('light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
