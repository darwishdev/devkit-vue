import { FilesHandler } from "@devkitvue/config";
import { type App, type Plugin } from "vue";
export * from "./app/filemanager";
export type DevkitFilemanagerConfig<TApi extends Record<string, Function>> = {
  apiClient: TApi;
  filesHandler?: FilesHandler<TApi>;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const DevkitFilemanagerPlugin: Plugin<DevkitFilemanagerConfig<any>> = {
  install<TApi extends Record<string, Function>>(
    app: App,
    { apiClient, filesHandler }: DevkitFilemanagerConfig<TApi>,
  ) {
    app.provide("apiClient", apiClient);
    if (filesHandler) app.provide("filesHandler", filesHandler);
  },
};
export default DevkitFilemanagerPlugin;
