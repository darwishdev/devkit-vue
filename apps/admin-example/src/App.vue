<script setup lang="ts">
import { setupDarkTheme, setupI18n } from "@devkit/base-components";
import Toast from "primevue/toast";
import DynamicDialog from "primevue/dynamicdialog";
import { RouterView } from "vue-router";
import {
  setLanguage,
  type SUPPORTE_LOCALES_TYPE,
} from "./pkg/plugins/i18n.config";
import { Suspense } from "vue";

setupDarkTheme();
</script>

<template>
  <DynamicDialog />
  <Toast />
  <div class="layout-wrapper">
    <RouterView v-slot="{ Component }">
      <!-- 👇 THIS Suspense controls the route component, so fallback shows -->
      <Suspense>
        <component :is="Component" />

        <template #fallback>
          <div class="flex items-center justify-center h-full">
            <h2>Loading from app…</h2>
          </div>
        </template>
      </Suspense>
    </RouterView>
    <!-- <Suspense> -->
    <!--   <template #default> -->
    <!--     <RouterView /> -->
    <!--   </template> -->
    <!--   <template #fallback> -->
    <!--     <div><h2>Loading from app...</h2></div> -->
    <!--   </template> -->
    <!-- </Suspense> -->
  </div>
</template>
