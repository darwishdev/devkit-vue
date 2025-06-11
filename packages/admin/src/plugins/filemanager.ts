import { App } from "vue";
import DevkitFilemanagerPlugin, {
  DevkitFilemanagerConfig
} from "@devkit/filemanager";
import { DevkitAdminConfig } from "..";

export function registerDevkitFilemanager<TApi extends Record<string, Function>>(app: App , {apiClient  ,filesHandler}: DevkitAdminConfig<TApi>) {
  const baseConfig: DevkitFilemanagerConfig<typeof apiClient> = {
    apiClient,
    filesHandler
 };
  app.use(DevkitFilemanagerPlugin, baseConfig);
}

