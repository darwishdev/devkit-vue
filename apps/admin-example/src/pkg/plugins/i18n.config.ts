import type { TranslationFindLocaleResponse } from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/public_translation_pb";
import { apiClient } from "../api/apiClient";
import { createI18n } from "vue-i18n";
import { cacheHelper } from "@devkitvue/base-components";
export type SUPPORTE_LOCALES_TYPE = "en" | "ar";
export const SUPPORT_LOCALES: SUPPORTE_LOCALES_TYPE[] = ["en", "ar"];
const translationListApi = (locale: SUPPORTE_LOCALES_TYPE) => {
  return new Promise<Record<string, any>>((resolve) => {
    apiClient
      .translationFindLocale({ locale })
      .then((response: TranslationFindLocaleResponse) => {
        resolve(response.translations);
      })
      .catch((err: Error) => {
        resolve({});
        console.log(
          "cannot load translations for locale: ",
          locale,
          "ERR: ",
          err,
        );
      });
  });
};
export const translationList = (locale: SUPPORTE_LOCALES_TYPE) => {
  return new Promise<Record<string, any>>((resolve) => {
    translationListApi(locale).then((response) => resolve(response));
  });
};

export async function setLanguage(locale: SUPPORTE_LOCALES_TYPE) {
  const cachedTranslations = await cacheHelper.getLocaleTranslations(locale);
  if (cachedTranslations) {
    i18n.global.locale = locale;
    i18n.global.setLocaleMessage(locale, cachedTranslations);
    return cachedTranslations;
  }
  console.log("setting langia", locale);
  const messages = await translationList(locale);
  console.log("setting langia", locale, messages);
  cacheHelper.setLocaleTranslations(locale, messages);
  // register under the locale key
  i18n.global.setLocaleMessage(locale, messages);
  // switch the active locale
}
export const i18n = createI18n({
  locale: "en",
  fallbackLocale: "en",
});
