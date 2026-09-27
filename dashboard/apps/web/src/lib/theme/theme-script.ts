import { THEME_STORAGE_KEY } from './theme-store';

export const themeInitScript = `(function() {
  try {
    var raw = localStorage.getItem('${THEME_STORAGE_KEY}');
    var theme = 'system';
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.state && parsed.state.theme) {
          theme = parsed.state.theme;
        } else if (typeof parsed === 'string') {
          theme = parsed;
        }
      } catch (e) {
        theme = raw;
      }
    }
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = theme === 'dark' || (theme === 'system' && prefersDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch (e) {}
})();`;
