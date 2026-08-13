export const THEME_STORAGE_KEY = "assets-portfolio-theme";

export const APP_THEMES = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "Darcula", value: "dracula" },
  { label: "Caramellate", value: "caramellatte" },
] as const;

export type AppTheme = (typeof APP_THEMES)[number]["value"];

export const DEFAULT_THEME: AppTheme = "light";
