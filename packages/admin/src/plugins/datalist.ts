import { App } from "vue";
import DevkitDatalistPlugin, {
  DevkitDatalistConfig
} from "@devkit/datalist";
import { DevkitAdminConfig } from "..";

export function registerDevkitDatalist<TApi extends Record<string , Function>>(app: App , {apiClient , authHandler , filesHandler} : DevkitAdminConfig<TApi>) {
  const baseConfig: DevkitDatalistConfig<TApi> = {
    apiClient,
   authHandler,
	filesHandler
 };
  app.use(DevkitDatalistPlugin , baseConfig);
}

