<script
  lang="ts"
  setup
  generic="TApi extends Record<string, Function>, TLocales extends string"
>
import { AppBtn, AppMenu, type AppMenuItem } from "@devkitvue/base-components";
import { ref } from "vue";
const navigationBar: AppMenuItem[] = JSON.parse(
  localStorage.getItem("sidebar")!,
);
const isSidebarHiddenRef = ref(false);
const appMenuElementRef = ref<InstanceType<typeof AppMenu> | null>();
const toggleSidebar = () => {
  const breakpointNumber = 570;
  const windowWidth = window.innerWidth;

  if (windowWidth > breakpointNumber) {
    isSidebarHiddenRef.value = !isSidebarHiddenRef.value;
  }
  if (appMenuElementRef.value) {
    appMenuElementRef.value.toggleMobileMenu();
  }
};
defineExpose({
  toggleSidebar,
});
</script>
<template>
  <aside class="sidebar">
    <AppMenu
      ref="appMenuElementRef"
      class="main-menu"
      :hide-drawer-toggler="true"
      :isVertical="true"
      :use-drawer-on-mobile="true"
      :items="navigationBar"
    >
      <template #logo>
        <AppBtn
          label="DEVKIT"
          icon="d-logo"
          :fluid="true"
          class="app-logo"
          variant="text"
          action="/dashboard"
        />
      </template>
    </AppMenu>
  </aside>
</template>

<style>
.transparent {
  background-color: transparent;
}
:root {
  --top-radius: var(--border-radius) var(--border-radius) 0 0;
  --bottom-radius: 0 0 var(--border-radius);
}
.hidden-sidebar {
  --menu-width: 0;
  .sidebar {
    opacity: 0;
  }
}
.sidebar {
  --block-padding: 0.2rem;
  --submenu-padding: 2.25rem;
  --active-menu-border: 0.5rem;
  background-color: var(--glass);
  backdrop-filter: blur(10px);

  @media (min-width: 570px) {
    z-index: 3;
    transition: width 0.2s;
    top: 0;
    inline-start: 0;
    height: 100vh;
    width: var(--menu-width);
    overflow-x: hidden;
    overflow-y: scroll;
    border-right: 1px solid var(--menu-border-color);

    padding: var(--content-padding);
    position: fixed;
    border-radius: 0 15px 15px 0;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.main-menu,
.p-drawer {
  button.p-button:hover,
  a:hover {
    color: var(--text-color);
    border-inline-start-color: var(--primary-color);
    background-color: var(--root-menu-item-hover-bg);
  }
  svg {
    width: 1.25rem;
  }
  .p-panelmenu {
    margin-top: 1rem;
    gap: 0;
  }
  .p-panelmenu-header {
    button,
    a {
      border-inline-start: var(--active-menu-border) solid transparent;
    }
  }
  .p-menubar-item {
    button,
    a {
      border: none;
    }
  }
  .p-panelmenu-header,
  .p-menubar-item {
    border-radius: var(--top-radius);
    button,
    a {
      display: flex;
      padding-block: var(--block-padding);
      border-radius: var(--border-radius);
      padding-inline: 0.75rem;
    }
  }

  .submenu-arrow-icon {
    transition: var(--transition);
  }
  .p-panelmenu-header-active {
    background: var(--root-menu-item-hover-bg);

    button,
    a {
      border-inline-start-color: var(--primary-color);
    }
    .submenu-arrow-icon {
      transform: rotate(180deg);
    }
  }
  .p-panelmenu-submenu {
    padding-inline-start: 0rem;
    background-color: var(--root-menu-content-hover-bg);
    border-radius: var(--bottom-radius);
    .p-panelmenu-item .p-panelmenu-item-content {
      a {
        display: block;
        border-radius: var(--border-radius);
        padding-block: var(--block-padding);
        border-inline-start: var(--active-menu-border) solid transparent;
        padding-inline-start: var(--submenu-padding);
      }
      a.router-link-active.router-link-exact-active {
        background-color: var(--root-menu-content-hover-bg);
        border-inline-start-color: var(--primary-color);
      }
    }
  }
}
</style>
