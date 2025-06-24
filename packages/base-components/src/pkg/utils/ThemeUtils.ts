export const toggleDarkTheme = async ({className , cacheHelper} :{className: string ,   cacheHelper: { setIsDark(isDark: boolean): Promise<void> }}) => {
  document.documentElement.classList.toggle(className);
  const isDark = document.documentElement.classList.contains(className);
  await cacheHelper.setIsDark(isDark)
  return {isDark}
}

