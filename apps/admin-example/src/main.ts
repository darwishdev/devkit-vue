import { createApp } from "vue";
import "@/pkg/style/style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import { rootClasses } from "../formkit.theme";
import { i18n } from "./pkg/plugins/i18n.config";
import "primeicons/primeicons.css";
import router from "@/pkg/router";
import DevkitAdminPlugin, { type DevkitAdminConfig } from "@devkitvue/admin";
import PrimeVue from "primevue/config";
import { ToastService, DialogService } from "primevue";
import { createInput, plugin as FormkitPlugin } from "@formkit/vue";
import { formKitConfig } from "@devkitvue/form";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";

import { apiClient } from "./pkg/api/apiClient";
import { AppBtn, AppIcon, AppImage } from "@devkitvue/base-components";
import translateI18nPlugin from "./pkg/plugins/translateI18nPlugin";
const app = createApp(App);

app.use(router);
const pinia = createPinia();
app.use(pinia);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

app.use(
  FormkitPlugin,
  formKitConfig({
    config: { rootClasses },
    plugins: [translateI18nPlugin],
  }),
);
app.use(PrimeVue, {
  theme: "none", // or your chosen PrimeVue theme
});

app.use(i18n);
// Install any PrimeVue services you need:
app.use(ToastService);
app.use(DialogService);
app.use(VueQueryPlugin, { queryClient });

const baseConfig: DevkitAdminConfig<typeof apiClient> = {
  apiClient,
  locales: ["en", "ar"],
  baseImageUrl: import.meta.env.VITE_BASE_IMAGE_URL,
  fallbackImageUrl: import.meta.env.VITE_FALLBACK_IMAGE_URL,
  fallbackImageSvg: "camera-off-line",
  authHandler: {
    login: "authLogin",
    allowedProviders: ["google"],
    redirectRoute: "/",
    providerLogin: {
      endpoint: "authLoginProvider",
      callbackEndpoint: "authLoginProviderCallback",
      callbackRoute: import.meta.env.VITE_PROVIDER_CALLBACK,
    },
    resetPassword: {
      endpoint: "authResetPassword",
      emailEndpoint: "authResetPasswordEmail",
      route: "/auth/reset-password",
      emailRedirectRoute: "/auth/login",
      emailRoute: "/auth/reset-password-email",
    },
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
app.mount("#app");
