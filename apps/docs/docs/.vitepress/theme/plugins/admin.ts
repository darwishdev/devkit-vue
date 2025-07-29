// apps/docs-site/.vitepress/theme/plugins/devkit-base.ts
/// <reference path="../../../../tsconfig.json" />
import { App } from "vue";
import DevkitAdminPlugin, { DevkitAdminConfig } from "@devkitvue/admin";
import { FileManager } from "@devkitvue/filemanager";
import {
  AppBtn,
  AppIcon,
  AppImage,
  AppThemeToggler,
  AppLocaleToggler,
  AppSection,
  AppDialog,
  AppBreadcrumb,
  AppMenu,
} from "@devkitvue/base-components";
import { apiClient } from "../../../../src/apiClient";
import { DataList } from "@devkitvue/datalist";
import { AppForm, LoginForm } from "@devkitvue/form";
import DatalistExample from "../../../../src/DatalistExample.vue";
export function registerDevkitAdmin(app: App) {
  const baseConfig: DevkitAdminConfig<typeof apiClient> = {
    apiClient,
    locales: ["en", "ar"],
    baseImageUrl: "http://192.168.100.40:54321/storage/v1/object/public/",
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
    iconFindApi: "iconFind",
  };
  app.use(DevkitAdminPlugin, baseConfig);
  app.component("AppBtn", AppBtn);
  app.component("AppIcon", AppIcon);
  app.component("AppImage", AppImage);
  app.component("AppThemeToggler", AppThemeToggler);
  app.component("AppLocaleToggler", AppLocaleToggler);
  app.component("AppSection", AppSection);
  app.component("AppDialog", AppDialog);
  app.component("DataList", DataList);
  app.component("AppForm", AppForm);
  app.component("LoginForm", LoginForm);
  app.component("FileManager", FileManager);
  app.component("AppBreadcrumb", AppBreadcrumb);
  app.component("AppMenu", AppMenu);
  app.component("DatalistExample", DatalistExample);
}
