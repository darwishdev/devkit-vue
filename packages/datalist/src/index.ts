import { FilesHandler, AuthHandler } from "@devkit/config";
import { type App, type Plugin } from "vue";
export * from "./app/datalist";
export type DevkitDatalistConfig<TApi extends Record<string, Function>> = {
  apiClient: TApi;
  filesHandler?: FilesHandler<TApi>;
  authHandler?: AuthHandler<TApi>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DevkitDatalistPlugin: Plugin<DevkitDatalistConfig<any>> = {
  install<TApi extends Record<string, Function>>(
    app: App,
    { apiClient, authHandler, filesHandler }: DevkitDatalistConfig<TApi>,
  ) {
    app.provide("apiClient", apiClient);
    if (filesHandler) app.provide("filesHandler", filesHandler);
    if (authHandler) app.provide("authHandler", authHandler);
  },
};
export default DevkitDatalistPlugin;
