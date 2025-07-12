<script setup lang="ts">
import PanelMenu from "primevue/panelmenu";
import { Menubar } from "primevue";
import { AppMenuProps, AppMenuSlots, MenuItemScope } from "@/pkg/types/types";
import { computed, h, ref } from "vue";

import Drawer from "primevue/drawer";
import AppImage from "./AppImage.vue";
import AppBtn from "./AppBtn.vue";
import AppIcon from "./AppIcon.vue";
const breakpointNumber = 570;
const {
  items,
  isVertical,
  drawerProps = {},
  hideDrawerToggler = false,
  useDrawerOnMobile,
  breakpoint = `${breakpointNumber}px`,
  logo,
} = defineProps<AppMenuProps>();
const slots = defineSlots<AppMenuSlots>();

const windowWidth = window.innerWidth;
const componentInUse = isVertical ? PanelMenu : Menubar;
const logoVariant = () => {
  if (!logo) return;
  const logoSrc = typeof logo == "string" ? logo : logo.src;
  if (typeof logo == "string" || logo.type != "icon") {
    return h(AppImage, { src: logoSrc });
  }
  return h(AppIcon, { icon: logoSrc, useReset: !logo.size, size: logo.size });
};

const renderMenu = () =>
  h(
    "div",
    {
      class: "app-menu",
    },
    [
      h(
        "div",
        {
          class: "start",
        },
        [
          slots.logo ? slots.logo() : logoVariant(),
          h(
            componentInUse,
            {
              model: items,
              breakpoint: useDrawerOnMobile ? 0 : breakpoint,
              class: "app-navigation",
              pt: {
                root: "transparent border-none",
                panel: "transparent w-full rounded-md",
                content: "glass rounded-md",
                header: "rounded-md",
                headerContent: "glass-hover",
                itemContent: "glass-hover",
              },
            },
            {
              item: (scope: MenuItemScope) =>
                slots.item
                  ? slots.item(scope)
                  : h(
                      AppBtn,
                      {
                        icon: scope.item.icon,
                        style: scope.item.style,
                        class: scope.item.active ? "" : "color-text",
                        action: scope.item.route,
                        label: scope.item.label as string,
                        labelAr: scope.item.labelAr,
                        fluid: true,
                        variant: "text",
                      },
                      {
                        end: () =>
                          scope.hasSubmenu
                            ? h(AppIcon, {
                                icon: "arrow-down-s-line",
                                class: "submenu-arrow-icon",
                              })
                            : undefined,
                      },
                    ),
            },
          ),
        ],
      ),
      h(
        "div",
        {
          class: "end",
        },
        slots.end ? slots.end() : undefined,
      ),
    ],
  );
const isMobileMenuVisibleRef = ref(false);
const toggleMobileMenu = () => {
  isMobileMenuVisibleRef.value = !isMobileMenuVisibleRef.value;
};
defineExpose({
  toggleMobileMenu,
});
const renderAppMenu = computed(() => {
  if (windowWidth > breakpointNumber || !useDrawerOnMobile) {
    return renderMenu();
  }
  return h(
    "div",
    {
      class: "mobile-menu",
    },
    [
      slots.mobileToggler
        ? slots.mobileToggler({ toggle: toggleMobileMenu })
        : hideDrawerToggler
          ? undefined
          : h(AppBtn, {
              icon: "menu-line",
              "v-once": true,
              action: () => toggleMobileMenu(),
            }),
      h(
        Drawer,
        {
          ...drawerProps,
          visible: isMobileMenuVisibleRef.value,
          "onUpdate:visible": (val: boolean) =>
            (isMobileMenuVisibleRef.value = val),
        },
        {
          default: renderMenu,
        },
      ),
    ],
  );
});
</script>
<template>
  <component :is="renderAppMenu" />
</template>
<style>
.menu-item {
  flex: 1;
}
</style>
