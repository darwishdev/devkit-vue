<script setup lang="ts">
import { h, inject, ref } from "vue";
import { iconHelper } from "@/index";
import type { AppIconProps } from "@devkit/config";
import type { AppIconSlots } from "@/pkg/types/types";
import { ApiEndpoint, resolveApiEndpoint } from "@devkit/apiclient";
import type { IconFindRequest, IconFindResponse } from "@/pkg/types/api_types";
const { icon, iconType } = defineProps<AppIconProps>();
const apiClient = inject("apiClient");
const iconFindApi =
  inject<ApiEndpoint<any, IconFindRequest, IconFindResponse>>("iconFindApi");
const { top: topSlot, bottom: bottomSlot } = defineSlots<AppIconSlots>();
const sizes = {
  small: "1rem",
  medium: "1.5rem",
  large: "3rem",
};
const svgIconContent = ref("🆖");
const getIconFromApi = () => {
  if (!iconFindApi) {
    return;
  }
  resolveApiEndpoint<any, IconFindRequest, IconFindResponse>(
    iconFindApi,
    apiClient,
    { iconName: icon },
  ).then(({ icon }) => {
    if (icon) {
      svgIconContent.value = icon.iconContent;
      iconHelper.iconCreate(icon.iconName, icon.iconContent);
    }
  });
};
const getIconFromDb = () => {
  iconHelper
    .iconFind(icon)
    .then((iconContent) => {
      if (!iconContent) {
        getIconFromApi();
        return;
      }
      svgIconContent.value = iconContent;
    })
    .catch(() => {
      getIconFromApi();
    });
};
const renderInnerIcon = () => {
  if (iconType == "primevue") {
    return h("span", {
      key: icon,
      class: `pi pi-${icon}`,
    });
  }
  getIconFromDb();
  return h("svg", {
    key: icon,
    innerHTML: svgIconContent.value,
  });
};
const renderIcon = () => {
  if (!topSlot && !bottomSlot) return renderInnerIcon();
  return h("span", { class: "icon-wrapper relative" }, [
    topSlot ? topSlot() : undefined,
    renderInnerIcon(),
    bottomSlot ? bottomSlot() : undefined,
  ]);
};
</script>
<template>
  <component :is="renderIcon" />
</template>
