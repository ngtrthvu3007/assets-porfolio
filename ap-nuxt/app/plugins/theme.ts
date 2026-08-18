export default defineNuxtPlugin(() => {
  const { currentTheme } = useTheme()

  useHead({
    htmlAttrs: {
      "data-theme": currentTheme,
    },
  })
})
