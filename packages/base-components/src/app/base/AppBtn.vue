<script setup lang="ts">
import { h, useAttrs } from "vue";
import type { AppBtnProps, AppBtnSlots } from "@/pkg/types/types";
import { Button } from "primevue";
import { RouterLink } from "vue-router";
import AppIcon from "./AppIcon.vue";
import { useI18n } from "vue-i18n";
const slots = defineSlots<AppBtnSlots>();
const props = defineProps<AppBtnProps>();
const { locale } = useI18n();
const {
  action,
  label,
  labelAr,
  route,
  icon,
  useReset = true,
  size,
  color,
  iconType,
} = props;
const attrs = useAttrs();
const renderAppBtn = () => {
  const baseProps = {
    ...props,
    ...attrs,
    class: "flex",
  };
  const children = slots.default
    ? slots.default()
    : [
        h(
          "div",
          {
            class: "flex items-center gap-2 start",
          },
          [
            slots.icon
              ? slots.icon()
              : !icon
                ? undefined
                : h(AppIcon, { icon, size, color, useReset, iconType }),
            slots.label
              ? slots.label()
              : h("span", locale.value == "ar" ? labelAr : label),
          ],
        ),
        slots.end ? slots.end() : undefined,
      ];
  const childrenWrapper = h("div", { class: "flex justify-between" }, children);

  if (route) {
    return h(RouterLink, { ...attrs, to: route }, childrenWrapper);
  }
  if (typeof action == "undefined") {
    return h(Button, { ...baseProps }, children);
  }
  if (typeof action == "function") {
    return h(Button, { ...baseProps, onClick: (e) => action(e) }, children);
  }
  if (action.startsWith("http")) {
    return h("a", { href: action }, childrenWrapper);
  }
  return h(RouterLink, { ...attrs, to: action }, childrenWrapper);
};
</script>
<template>
  <component class="flex" :is="renderAppBtn" />
</template>
