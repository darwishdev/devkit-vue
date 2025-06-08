<script setup lang="ts">
import Menubar from "primevue/menubar";
import AppBtn from "./AppBtn.vue";
import type { AppHeaderProps } from "@/pkg/types/types";
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import AppImage from "./AppImage.vue";
import AppIcon from "./AppIcon.vue";
import type { MenuItem } from "primevue/menuitem";
import AppLocaleToggler from "./AppLocaleToggler.vue";
const i18n = useI18n();
const { items, hideLocalSwitch, logo } = defineProps<AppHeaderProps>();
const itemLabelKey = computed(() => {
  return i18n.locale.value == "ar" ? "labelAr" : "label";
});

const processItem = (item: MenuItem & { labelAr?: string }): MenuItem => {
  const newItem = { ...item };
  if (item.items) {
    if (item.items.length) {
      newItem.route = "";
      newItem.items = item.items.map(processItem);
      return newItem;
    }
  }
  newItem.items = undefined;
  return newItem;
};
const processedItems = items.map(processItem);
const logoVariant = computed(() => {
  if (!logo) return;
  const logoSrc = typeof logo == "string" ? logo : logo.src;
  if (typeof logo == "string" || logo.type != "icon")
    return { component: AppImage, props: { src: logoSrc } };
  return {
    component: AppIcon,
    props: { icon: logoSrc, size: logo.size, useReset: !logo.size },
  };
});
</script>

<template>
  <header class="header-section top-0 sticky z-10 shadow-sm">
    <div class="wrapper">
      <Menubar
        :model="processedItems"
        breakpoint="960px"
        :pt="{
          root: 'px-0 rounded-none  header-menu-bar border-hidden',
          rootList: 'justify-end flex-1',
        }"
      >
        <!-- Forward all slots passed to the wrapper to the Menubar -->
        <template #start v-if="logoVariant">
          <slot name="logo">
            <AppBtn size="small" action="/" label="logo">
              <component
                :is="logoVariant.component"
                v-bind="logoVariant.props"
              />
            </AppBtn>
          </slot>
        </template>
        <template #item="{ item, hasSubmenu }">
          <AppBtn
            v-bind="item"
            :label="item.label as string"
            variant="text"
            class="w-full"
          >
            <template #end>
              <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down"></span>
            </template>
          </AppBtn>
        </template>
        <template #end v-if="!hideLocalSwitch">
          <AppLocaleToggler>
            <template #default="{ toggleLocale }">
              <slot name="language-toggler" :toggle-locale="toggleLocale" />
            </template>
          </AppLocaleToggler>
        </template>
      </Menubar>
    </div>
  </header>
</template>
