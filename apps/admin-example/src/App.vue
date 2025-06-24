<script setup lang="ts">
import { setupDarkTheme, setupI18n} from "@devkit/base-components";
import Toast from "primevue/toast";
import DynamicDialog from "primevue/dynamicdialog";
import { RouterView } from "vue-router";
import { setLanguage, type SUPPORTE_LOCALES_TYPE } from "./pkg/plugins/i18n.config";
setupI18n<SUPPORTE_LOCALES_TYPE>((local : SUPPORTE_LOCALES_TYPE) => {
  console.log("callback from local")
  setLanguage(local)
});
setupDarkTheme();
</script>

<template>
  <DynamicDialog />
  <Toast />
  <div class="layout-wrapper">
      <RouterView />
  </div>
</template>
