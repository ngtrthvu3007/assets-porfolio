import { APP_THEMES, DEFAULT_THEME, THEME_OPTIONS, type AppTheme } from "@/constants/themes"

const THEME_COOKIE_KEY = "ap-theme"
const THEME_ATTRIBUTE = "data-theme"

export function useTheme() {
  const currentTheme = useCookie<AppTheme>(THEME_COOKIE_KEY, {
    default: () => DEFAULT_THEME,
    sameSite: "lax",
  })

  const applyTheme = (theme: AppTheme): void => {
    if (import.meta.client) {
      document.documentElement.setAttribute(THEME_ATTRIBUTE, theme)
    }
  }

  const setTheme = (theme: AppTheme): void => {
    if (!APP_THEMES.includes(theme)) return
    currentTheme.value = theme
    applyTheme(theme)
  }

  return {
    currentTheme,
    setTheme,
    applyTheme,
    themes: THEME_OPTIONS,
  }
}
