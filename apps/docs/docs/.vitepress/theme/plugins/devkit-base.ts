// apps/docs-site/.vitepress/theme/plugins/devkit-base.ts
/// <reference path="../../../../tsconfig.json" />
import { App } from "vue";
import DevkitBaseComponentsPlugin, {
  AppBtn,
  AppIcon,
  AppImage,
  AppThemeToggler,
  AppLocaleToggler,
  AppSection,
  AppDialog,
  AppBreadcrumb,
  AppMenu,
  DevkitBaseConfig,
} from "@devkitvue/base-components";
import { apiClient } from "../../../../src/apiClient";
export function registerDevkitBase(app: App) {
  const baseConfig: DevkitBaseConfig<typeof apiClient> = {
    apiClient,
    locales: ["en", "ar"],
    baseImageUrl: "http://localhost:54321/storage/v1/object/public/",
    iconFindApi: "iconFind",
  };
  app.use(DevkitBaseComponentsPlugin, baseConfig);
  app.component("AppBtn", AppBtn);
  app.component("AppIcon", AppIcon);
  app.component("AppImage", AppImage);
  app.component("AppThemeToggler", AppThemeToggler);
  app.component("AppLocaleToggler", AppLocaleToggler);
  app.component("AppSection", AppSection);
  app.component("AppDialog", AppDialog);
  app.component("AppBreadcrumb", AppBreadcrumb);
  app.component("AppMenu", AppMenu);
}
