<script lang="ts" setup>
import { AppLocaleToggler, AppThemeToggler } from "@devkitvue/base-components";
import { setLanguage } from "../plugins/i18n.config";
import { type SUPPORTE_LOCALES_TYPE } from "../plugins/i18n.config";
const localeToggled = async (locale: string) => {
  setLanguage(locale as SUPPORTE_LOCALES_TYPE);
};
</script>
<template>
  <Suspense>
    <template #default>
      <div class="auth-layout flex">
        <AppImage src="images/login.webp" class="max-h-dvh" />
        <div
          class="auth-content flex-col flex items-center flex-grow justify-center p-4"
        >
          <div class="togglers flex gap-4">
            <AppThemeToggler
              size="small"
              dark-icon="sun-line"
              light-icon="moon-line"
              class="md:order-5 glass color-text"
            />
            <AppLocaleToggler
              size="small"
              :callBack="localeToggled"
              icon="global-line"
              class="color-text glass md:order-6"
            />
          </div>
          <div class="min-w-96">
            <RouterView />
          </div>
        </div>
      </div>
    </template>
    <template #fallback>
      <div>Loading from auth layoututttsss...</div>
    </template>
  </Suspense>
</template>
<style>
.max-h-dvh img {
  max-height: 100dvh;
}
</style>
