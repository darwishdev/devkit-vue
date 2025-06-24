import { createApp } from "vue";
import "@/pkg/style/style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import { rootClasses } from "../formkit.theme";
import { i18n } from "./pkg/plugins/i18n.config";
import "primeicons/primeicons.css";
import router from "@/pkg/router";
import DevkitAdminPlugin, { type DevkitAdminConfig } from "@devkit/admin";
import PrimeVue from "primevue/config";
import { ToastService, DialogService } from "primevue";
import { plugin as FormkitPlugin } from "@formkit/vue";
import { formKitConfig } from "@devkit/form";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";

import { apiClient } from "./pkg/api/apiClient";
import { AppBtn, AppIcon, AppImage } from "@devkit/base-components";
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

app.use(FormkitPlugin, formKitConfig({ config: { rootClasses } }));
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
  baseImageUrl: "http://192.168.100.40:54321/storage/v1/object/public/",
  fallbackImageUrl:
    "http://192.168.100.40:54321/storage/v1/object/public/images/noimg.webp",
  fallbackImageSvg: "camera-off-line",
  authHandler: {
    login: "authLogin",
    allowedProviders: ["google"],
    providerLogin: "authLoginProvider",
    providerLoginCallback: "authLoginProviderCallback",
    resetPasswordEmail: "authResetPasswordEmail",
    resetPassword: "authResetPassword",
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
