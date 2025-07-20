import { type App, type Plugin } from "vue";
import type { DevkitFormConfig } from "@devkitvue/config";
// import * as adminTypes from "./pkg/types/types";
export * from "./app/appform";
export * from "@/pkg/utils/DateUtils";
export type { DevkitFormConfig };
import DevkitFormDB from "./pkg/database/DB";

const db = new DevkitFormDB();

export { db };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DevkitFormPlugin: Plugin<DevkitFormConfig<any>> = {
  install<TApi extends Record<string, Function>>(
    app: App,
    { apiClient, authHandler, filesHandler }: DevkitFormConfig<TApi>,
  ) {
    app.provide("apiClient", apiClient);
    if (filesHandler) app.provide("filesHandler", filesHandler);
    if (authHandler) app.provide("authHandler", authHandler);
  },
};
export default DevkitFormPlugin;
