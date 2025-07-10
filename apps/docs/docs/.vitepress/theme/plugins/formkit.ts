// apps/docs-site/.vitepress/theme/plugins/formkit.ts
import { App } from "vue";
import { plugin as FormKitPlugin } from "@formkit/vue";
import { formKitConfig } from "@devkit/form";
import { rootClasses } from "../formkit.theme.ts";
export function registerFormKit(app: App) {
  app.use(FormKitPlugin, formKitConfig({ config: { rootClasses } }));
}
