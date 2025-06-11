
import { App } from "vue";
import DevkitBaseComponentsPlugin, {
  DevkitBaseConfig
} from "@devkit/base-components";
import { DevkitAdminConfig } from "..";
export function registerDevkitBase<TApi extends Record<string, Function>>(app: App , {apiClient , locales , baseImageUrl , noImageUrl , iconFindApi}: DevkitAdminConfig<TApi>) {
  const baseConfig: DevkitBaseConfig<TApi> = {
    apiClient,
    locales,
    noImageUrl,
    baseImageUrl,
    iconFindApi,
  };
  app.use(DevkitBaseComponentsPlugin, baseConfig);
}
