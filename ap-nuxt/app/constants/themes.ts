export const APP_THEMES = ["light", "dark", "dracula", "lemonade"] as const

export type AppTheme = (typeof APP_THEMES)[number]

export const DEFAULT_THEME: AppTheme = "light"

export const THEME_OPTIONS: { value: AppTheme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "dracula", label: "Dracula" },
  { value: "lemonade", label: "Lemonade" },
]
