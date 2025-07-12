import { App } from "vue";
import DevkitFormPlugin, { DevkitFormConfig } from "@devkitvue/form";
import { DevkitAdminConfig } from "..";

export function registerDevkitForm<TApi extends Record<string, Function>>(
  app: App,
  { apiClient, authHandler, filesHandler }: DevkitAdminConfig<TApi>,
) {
  const baseConfig: DevkitFormConfig<TApi> = {
    apiClient,
    authHandler,
    filesHandler,
  };
  app.use(DevkitFormPlugin, baseConfig);
}
