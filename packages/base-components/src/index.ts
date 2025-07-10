import DevkitBaseDB from "@/pkg/database/DB";
import { type App, type Plugin } from "vue";
import { useI18n } from "vue-i18n";
import { toggleLocale } from "@/pkg/utils/LocaleUtils";
import { ApiEndpoint } from "@devkitvue/apiclient";
import {
  IconFindRequest,
  IconFindResponse,
  TranslationFindLocaleRequest,
  TranslationFindLocaleResponse,
} from "@/pkg/types/api_types";
import { toggleDarkTheme } from "@/pkg/utils/ThemeUtils";

export * from "@/pkg/types/types";
export * from "@/pkg/types/api_types";
export * from "@/app/base/index";
export * from "@/pkg/utils/LocaleUtils";
export * from "@/pkg/utils/GridUtils";
export * from "@/pkg/utils/ThemeUtils";

export type DevkitBaseConfig<TApi extends Record<string, Function>> = {
  apiClient: TApi;
  baseImageUrl?: string;
  fallbackImageUrl?: string;
  fallbackImageSvg?: string;
  locales: string[];
  iconFindApi?: ApiEndpoint<TApi, IconFindRequest, IconFindResponse>;
  translationLocaleFindApi?: ApiEndpoint<
    TApi,
    TranslationFindLocaleRequest,
    TranslationFindLocaleResponse
  >;
};
const db = new DevkitBaseDB();
export const cacheHelper = db.cache;
export const iconHelper = db.iconHelper;
// Function to sync i18n locale inside setup()
export async function setupI18n<T = string>() {
  const i18n = useI18n(); // Must be inside setup()
  const locale = await cacheHelper.getLocale();
  if (locale === "ar") {
    await toggleLocale({ i18n, cacheHelper });
  }
  return locale as T;
}

export function setupDarkTheme(className: string = "dark") {
  cacheHelper.getIsDark().then((isDark: boolean) => {
    if (isDark) {
      toggleDarkTheme({ className, cacheHelper });
    }
  });
}
const DevkitBaseComponentsPlugin: Plugin<DevkitBaseConfig<any>> = {
  install<TApi extends Record<string, Function>>(
    app: App,
    {
      baseImageUrl,
      fallbackImageSvg,
      fallbackImageUrl,
      apiClient,
      iconFindApi,
      translationLocaleFindApi,
    }: DevkitBaseConfig<TApi>,
  ) {
    app.provide("apiClient", apiClient);
    app.provide("baseImageUrl", baseImageUrl);
    if (fallbackImageSvg) app.provide("fallbackImageSvg", fallbackImageSvg);
    if (fallbackImageUrl) app.provide("fallbackImageUrl", fallbackImageUrl);
    if (iconFindApi) {
      app.provide<ApiEndpoint<TApi, IconFindRequest, IconFindResponse>>(
        "iconFindApi",
        iconFindApi,
      );
    }
    if (translationLocaleFindApi) {
      app.provide<
        ApiEndpoint<
          TApi,
          TranslationFindLocaleRequest,
          TranslationFindLocaleResponse
        >
      >("translationLocaleFindApi", translationLocaleFindApi);
    }
  },
};

export default DevkitBaseComponentsPlugin;
