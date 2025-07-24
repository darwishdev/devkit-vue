<script setup lang="ts">
import { h, inject, ref } from "vue";
import { iconHelper } from "@/index";
import type { AppIconProps } from "@devkitvue/config";
import type { AppIconSlots } from "@/pkg/types/types";
import { ApiEndpoint, resolveApiEndpoint } from "@devkitvue/apiclient";
import type { IconFindRequest, IconFindResponse } from "@/pkg/types/api_types";
const { icon, iconType } = defineProps<AppIconProps>();
const apiClient = inject("apiClient");
const iconFindApi =
  inject<ApiEndpoint<any, IconFindRequest, IconFindResponse>>("iconFindApi");
const { top: topSlot, bottom: bottomSlot } = defineSlots<AppIconSlots>();

const svgIconContent = ref("🆖");
const getIconFromApi = () => {
  if (!iconFindApi || !icon) {
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
<style>
.fallback-icon svg {
  width: 100%;
}

svg {
  width: inherit;
  height: inherit;
}

.app-logo {
  svg {
    width: 3rem;
    height: 3rem;
  }
}

.app-logo-icon {
  svg {
    width: 2rem;
    height: 2rem;
  }
}
.bg-gray {
  background-color: var(--gray-bg);
}
.p-button-icon-only {
  justify-content: center;
}

/* :not(.custom-icon) svg:not(.custom-icon) { */
/*   --icon-width: 1.5rem; */
/*   width: var(--icon-width); */
/*   height: var(--icon-width); */
/* } */

.app-logo:hover {
  background: transparent !important;
}
/* .uppy-Root .uppy-Dashboard .uppy-Dashboard-AddFiles { */
/*   border-color: var(--glass); */
/* } */
/* .uppy-Root .uppy-Dashboard .uppy-Dashboard-inner { */
/*   background: transparent; */
/*   border-color: var(--color-glass); */
/* } */
/**/
/* .uppy-DashboardTab-inner, */
/* .uppy-DashboardTab-btn:hover { */
/*   background: var(--glass); */
/* } */
/* [data-uppy-drag-drop-supported="true"] .uppy-Dashboard-AddFiles { */
/*   border-color: var(--glass); */
/* } */
/* .uppy-Dashboard-AddFiles-title { */
/*   color: var(--color-text); */
/* } */
/**/
.fallback-icon svg {
  width: 100%;
}

svg {
  width: inherit;
  height: inherit;
}
.app-logo-icon {
  svg {
    width: 2rem;
    height: 2rem;
  }
}
.app-logo {
  svg {
    width: 3rem;
    height: 3rem;
  }
}
:not(.custom-icon) svg:not(.custom-icon) {
  --icon-width: 1.5rem;
  width: var(--icon-width);
  height: var(--icon-width);
}
</style>
