
export type LocaleValues = {
  dir: 'ltr' | 'rtl',
  language: 'en' | 'ar'
}
export type I18nInstnce = {
  locale: { value: string },
}
export type ToggleLocaleParams = {
  i18n: I18nInstnce,
  cacheHelper: { setLocale: (language: string) => Promise<void> }
}

export const getTargetValues = (currentLocale: string): LocaleValues => {
  if (currentLocale == 'en') {
    return { dir: 'rtl', language: 'ar' }
  }
  return { dir: 'ltr', language: 'en' }
}
export const toggleLocale = async ({ i18n, cacheHelper }: ToggleLocaleParams) => {
  const { dir, language } = getTargetValues(i18n.locale.value)

  console.log("toggle", dir, language)
  document.documentElement.setAttribute("dir", dir);
  i18n.locale.value = language
  await cacheHelper.setLocale(language)
}

