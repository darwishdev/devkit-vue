/* eslint-disable @typescript-eslint/no-explicit-any */
import { InjectionKey, type App, type Plugin } from "vue";
export * from "./app/dataview";

export const ApiClientKey: InjectionKey<Record<string, Function>> =
  Symbol("apiClient");
export type DevkitDataViewConfig<TApi extends Record<string, Function>> = {
  apiClient: TApi;
};

const DevkitDataViewPlugin: Plugin<DevkitDataViewConfig<any>> = {
  install<TApi extends Record<string, Function>>(
    app: App,
    { apiClient }: DevkitDataViewConfig<TApi>,
  ) {
    const provides = (app as any)._context?.provides as Record<
      InjectionKey<unknown> | string,
      unknown
    >;
    if (!provides || !(ApiClientKey in provides)) {
      app.provide(ApiClientKey, apiClient);
    }
  },
};
export default DevkitDataViewPlugin;
