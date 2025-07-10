
import { App } from "vue";
import DevkitBaseComponentsPlugin, {
  DevkitBaseConfig
} from "@devkitvue/base-components";
import { DevkitAdminConfig } from "..";
export function registerDevkitBase<TApi extends Record<string, Function>>(app: App , {apiClient , locales , baseImageUrl , fallbackImageUrl, fallbackImageSvg , iconFindApi}: DevkitAdminConfig<TApi>) {
  const baseConfig: DevkitBaseConfig<TApi> = {
    apiClient,
    locales,
    fallbackImageSvg,
    fallbackImageUrl,
    baseImageUrl,
    iconFindApi,
  };
  app.use(DevkitBaseComponentsPlugin, baseConfig);
}
