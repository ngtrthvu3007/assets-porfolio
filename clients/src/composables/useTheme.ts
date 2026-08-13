import { ref } from "vue";
import {
  APP_THEMES,
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  type AppTheme,
} from "../constants/themes";

const currentTheme = ref<AppTheme>(getInitialTheme());

export const useTheme = () => {
  const setTheme = (theme: AppTheme): void => {
    currentTheme.value = theme;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  };

  setTheme(currentTheme.value);

  return {
    currentTheme,
    setTheme,
    themes: APP_THEMES,
  };
};

function getInitialTheme(): AppTheme {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const migratedTheme = migrateLegacyTheme(savedTheme);

  if (migratedTheme) return migratedTheme;
  if (isAppTheme(savedTheme)) return savedTheme;

  return DEFAULT_THEME;
}

function isAppTheme(value: string | null): value is AppTheme {
  return APP_THEMES.some((theme) => theme.value === value);
}

function migrateLegacyTheme(value: string | null): AppTheme | null {
  if (value === "darcula") return "dracula";
  if (value === "caramellate") return "caramellatte";

  return null;
}
