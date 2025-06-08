<script setup lang="ts">
import { computed, h, inject, ref } from "vue";
import { iconHelper } from "@/index";
import type { AppIconProps, AppIconSlots } from "@/pkg/types/types";

import { ApiEndpoint, resolveApiEndpoint } from "@devkit/apiclient";
import type { IconFindRequest, IconFindResponse } from "@/pkg/types/api_types";
const {
  icon,
  size,
  iconType,
  color,
  useReset = true,
} = defineProps<AppIconProps>();
const apiClient = inject("apiClient");
const iconFindApi =
  inject<ApiEndpoint<any, IconFindRequest, IconFindResponse>>("iconFindApi");
const { top: topSlot, bottom: bottomSlot } = defineSlots<AppIconSlots>();
const sizes = {
  small: "1.5rem",
  medium: "2.25rem",
  large: "3rem",
};
const modifySvgAttributes = computed(() => {
  if (svgIconContent.value == "default" || svgIconContent.value == "")
    return svgIconContent.value;
  try {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(
      svgIconContent.value,
      "image/svg+xml",
    );
    const svgElement = svgDoc.querySelector("svg");
    if (svgElement) {
      if (useReset) {
        svgElement.setAttribute("width", sizes.medium);
        svgElement.setAttribute("height", sizes.medium);
        svgElement.setAttribute("fill", "var(--p-primary-contrast-color)");
        svgElement.setAttribute("stroke", color || "currentColor");
      }
      const defaulColor = "var(--p-primary-contrast-color)";
      const defaulSize = "medium";
      const targetSize = useReset ? defaulSize : size;
      const targetColor = useReset ? defaulColor : color;
      if (targetSize) {
        svgElement.setAttribute("width", sizes[targetSize]);
        svgElement.setAttribute("height", sizes[targetSize]);
      }
      if (targetColor) {
        svgElement.setAttribute("fill", targetColor);
        svgElement.setAttribute("stroke", targetColor || "currentColor");
      }
      return svgElement.outerHTML;
    }
    return svgIconContent.value;
  } catch (error) {
    return svgIconContent.value;
  }
});
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
      style: {
        fontSize: size ? sizes[size] : "",
        key: icon,
        color: color || "currentColor",
      },
    });
  }
  getIconFromDb();
  return h("span", {
    class: `app-icon ${size}`,
    attrs: color,
    key: icon,
    innerHTML: modifySvgAttributes.value,
  });
};
const renderIcon = () => {
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
