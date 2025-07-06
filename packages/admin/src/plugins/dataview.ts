import { App } from "vue";
import DevkitDataViewPlugin, {
  type DevkitDataViewConfig,
} from "@devkit/dataview";
import { DevkitAdminConfig } from "..";

export function registerDevkitDataView<TApi extends Record<string, Function>>(
  app: App,
  { apiClient }: DevkitAdminConfig<TApi>,
) {
  const baseConfig: DevkitDataViewConfig<TApi> = {
    apiClient,
  };
  app.use(DevkitDataViewPlugin, baseConfig);
}
