/// <reference path="../../../../tsconfig.json" />
import { App } from "vue";
import DevkitFormPlugin, {
  DevkitFormConfig,
  LoginForm,
  AppForm,
} from "@devkitvue/form";
import { apiClient } from "../../../../src/apiClient";
export function registerDevkitForm(app: App) {
  const baseConfig: DevkitFormConfig<typeof apiClient> = {
    apiClient,
    authHandler: {
      login: "authLogin",
      allowedProviders: ["google"],
    },
    filesHandler: {
      fileDelete: "fileDelete",
      galleryListEndpoint: "galleryList",
      fileUploadUrlFind: "fileUploadUrlFind",
      bucketList: "bucketList",
      fileDeleteByBucket: "fileDeleteByBucket",
      bucketCreateUpdate: "bucketCreateUpdate",
    },
  };
  app.use(DevkitFormPlugin, baseConfig);
  app.component("AppForm", AppForm);
  app.component("LoginForm", LoginForm);
}
