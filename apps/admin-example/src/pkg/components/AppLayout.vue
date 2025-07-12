<script lang="ts" setup>
import { setLanguage } from "../plugins/i18n.config";
import { setupI18n } from "@devkitvue/base-components";
import { ref } from "vue";
import { type SUPPORTE_LOCALES_TYPE } from "../plugins/i18n.config";
import { AdminHeader, AdminMenu } from "@devkitvue/admin";
import { useI18n } from "vue-i18n";
const init = async () => {
  return new Promise(async (r) => {
    const locale = await setupI18n<SUPPORTE_LOCALES_TYPE>();
    await setLanguage(locale);
    setTimeout(async () => {
      r(null);
    }, 30);
  });
};
await init();

const isSidebarHiddenRef = ref(false);
const adminMenuElemenetRef = ref();
const toggleSidebar = () => {
  if (adminMenuElemenetRef.value) {
    adminMenuElemenetRef.value.toggleSidebar();
    isSidebarHiddenRef.value = !isSidebarHiddenRef.value;
  }
};

const isSearchingRef = ref(false);
const toggleIsSearching = () => {
  isSearchingRef.value = !isSearchingRef.value;
};
const { t } = useI18n();
</script>
<template>
  <div
    :class="{
      'hidden-sidebar': isSidebarHiddenRef,
      searching: isSearchingRef,
    }"
  >
    <AdminMenu ref="adminMenuElemenetRef" />
    <div class="page-content p-2">
      <AdminHeader
        :setLanguage="setLanguage"
        @searchToggled="toggleIsSearching"
        @sidebarToggled="toggleSidebar"
      />
      <div class="p-4 min-h-[80vh]">
        <RouterView />
      </div>
      <footer class="p-4 rounded text-center glass m-2">
        <h2>{{ t("footer.copyright") }}</h2>
      </footer>
    </div>
  </div>
</template>
<style>
.page-content {
  @media (min-width: 570px) {
    margin-inline-start: var(--menu-width);
  }
  transition: var(--transition) margin;
}
</style>
