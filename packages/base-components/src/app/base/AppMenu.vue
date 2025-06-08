<script setup lang="ts">
import PanelMenu from "primevue/panelmenu";
import { Menubar } from "primevue";
import { AppMenuProps, AppMenuSlots, MenuItemScope } from "@/pkg/types/types";
import { h, ref } from "vue";

import Drawer from "primevue/drawer";
import AppIcon from "./AppIcon.vue";
import AppImage from "./AppImage.vue";
import AppBtn from "./AppBtn.vue";
const {
  items,
  isVertical,
  drawerProps = {},
  useDrawerOnMobile,
  breakpoint = 570,
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
                        icon:scope.item.icon,
                        style:scope.item.style,
                        label: scope.item.label as string,
                        variant: "text",
                        class: "w-full",
                      },
                      {
                        end: () =>
                          scope.hasSubmenu
                            ? h("span", {
                                class: "pi pi-fw pi-angle-down",
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
  console.log("menu is toggling");
  isMobileMenuVisibleRef.value = !isMobileMenuVisibleRef.value;
};
const renderAppMenu = () => {
  if (windowWidth > breakpoint || !useDrawerOnMobile) {
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
        : h(AppBtn, {
            icon: "menu",
            label: "toggle",
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
};
</script>
<template>
  <component :is="renderAppMenu" />
</template>
<style>
.menu-item {
  flex: 1;
}
</style>
