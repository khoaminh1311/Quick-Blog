const THEME_KEY = 'miniblog_theme';

export const storage = {
  getTheme: () => {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  },
  setTheme: (theme) => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Ignore write errors (e.g., in private mode)
    }
  },
};
