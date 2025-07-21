<script setup lang="ts">
import { computed, h } from "vue";
import type { AppBtnProps } from "@devkitvue/config";
import type { AppBtnSlots } from "@/pkg/types/types";
import { Button } from "primevue";
import { RouterLink } from "vue-router";
import AppIcon from "./AppIcon.vue";
import { useI18n } from "vue-i18n";
const slots = defineSlots<AppBtnSlots>();
const props = defineProps<AppBtnProps>();
const { locale } = useI18n();
const {
  action: passedAction,
  label,
  labelAr,
  route,
  to,
  justify = "center",
  icon,
  size,
  command,
  color,
  iconType,
} = props;
const renderAppBtnChildren = () => {
  if (slots.default) return slots.default();
  const children = [
    slots.icon
      ? slots.icon()
      : !icon
        ? undefined
        : h(AppIcon, { key: icon, icon, size, color, iconType }),
    slots.label
      ? slots.label()
      : h("span", locale.value == "ar" ? labelAr || label : label),
  ];
  if (!slots.end) {
    return children;
  }
  return [
    h(
      "div",
      {
        class: "flex grow items-center button-wrapper gap-2 start",
      },
      children,
    ),
    slots.end(),
  ];
};
const renderAppBtn = computed(() => {
  const children = renderAppBtnChildren();
  const action = passedAction || command || route || to;
  const className = `flex justify-${justify} items-center gap-2`;
  if (route) {
    return h(RouterLink, { to: route, class: className }, children);
  }
  if (!action) {
    return h(Button, { ...props, action: undefined }, children);
  }
  if (typeof action == "function") {
    return h(
      Button,
      { ...props, action: undefined, onClick: action as (e: Event) => void },
      children,
    );
  }
  if (typeof action == "string") {
    if (action.startsWith("http")) {
      return h("a", { href: action }, children);
    }
  }
  const routeLink = route || to || action;
  return h(RouterLink, { to: routeLink, class: className }, children);
});
</script>
<template>
  <component :is="renderAppBtn" />
</template>
<style>
.p-button-icon-only {
  justify-content: center;
}
</style>
