<script setup lang="ts">
import { setupDarkTheme, setupI18n } from "@devkitvue/base-components";
import Toast from "primevue/toast";
import DynamicDialog from "primevue/dynamicdialog";
import { RouterView } from "vue-router";
import {
  setLanguage,
  type SUPPORTE_LOCALES_TYPE,
} from "./pkg/plugins/i18n.config";
import { Suspense } from "vue";
import Skeleton from "primevue/skeleton";

setupDarkTheme();
</script>

<template>
  <DynamicDialog />
  <Toast />
  <div class="layout-wrapper">
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <Suspense>
          <component :is="Component" />
          <template #fallback>
            <AdminLoading />
          </template>
        </Suspense>
      </template>
    </RouterView>
  </div>
</template>
