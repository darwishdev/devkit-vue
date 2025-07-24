<script
  lang="ts"
  setup
  generic="TApi extends Record<string, Function>, TLocales extends string"
>
import AutoComplete, {
  type AutoCompleteCompleteEvent,
  type AutoCompleteOptionSelectEvent,
} from "primevue/autocomplete";
import {
  AppBreadcrumb,
  AppBtn,
  AppIcon,
  AppLocaleToggler,
  AppThemeToggler,
} from "@devkitvue/base-components";
import { CommandPallete } from "@devkitvue/config";
import { useRouter } from "vue-router";
import Menu from "primevue/menu";

import { setupI18n } from "@devkitvue/base-components";
import { inject, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { AppHeaderEmits, AppHeaderProps, AppHeaderSlots } from "@/types";
const globalSearchValueRef = ref();
const globalSearchSuggestionsRef = ref<CommandPallete[]>([]);
const autoCompleteElementRef = ref<any>(null);

const { setLanguage } = defineProps<AppHeaderProps<TLocales>>();
const apiClient = inject<TApi>("apiClient");
const emit = defineEmits<AppHeaderEmits<TLocales>>();
defineSlots<AppHeaderSlots>();
const init = async () => {
  return new Promise(async (r) => {
    const locale = await setupI18n<TLocales>();
    if (setLanguage) {
      await setLanguage(locale);
    }

    emit("localeChanged", locale);
    setTimeout(async () => {
      r(null);
    }, 30);
  });
};
await init();
onMounted(() => {
  const onKeydown = async (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key.toLowerCase() === "g") {
      e.preventDefault();
      isSearchingRef.value = true; // make the <AutoComplete> appear
      await nextTick(); // wait for it to render
      // PrimeVue AutoComplete doesn’t expose focus(),
      // so grab its inner <input> and call focus():
      const inputEl = autoCompleteElementRef.value?.$el.querySelector("input");
      if (inputEl) {
        inputEl.focus();
      }
    }
  };
  document.addEventListener("keydown", onKeydown);
  onBeforeUnmount(() => {
    document.removeEventListener("keydown", onKeydown);
  });
});
const router = useRouter();
const globalSearchOnSelect = (event: AutoCompleteOptionSelectEvent) => {
  if (event.value.route) router.push(event.value.route);
  globalSearchValueRef.value = null;
  globalSearchSuggestionsRef.value = [];
};
const globalSearchOntype = (event: AutoCompleteCompleteEvent) => {
  if (!apiClient) return;
  console.log("event is", event);
  apiClient
    .commandPalleteSearch({ query: event.query })
    .then((resp: { hits: CommandPallete[] }) => {
      console.log("resp is", resp);
      globalSearchSuggestionsRef.value = resp.hits;
    });
};
const { push } = useRouter();
const logout = () => {
  if (!apiClient) return;
  localStorage.removeItem("token");
  localStorage.removeItem("access_token");
  localStorage.removeItem("sidebar");
  apiClient.authLogout({}).finally(() => {
    emit("loggedOut");
    push("/auth/login");
  });
};
const profileMenuElementRef = ref();
const profileMenuToggle = (event?: Event) => {
  profileMenuElementRef.value.toggle(event);
};
const profileMenuItems = ref([
  {
    label: "profile",
    items: [
      {
        label: "Profile",
        icon: "user-settings-line",
      },
      {
        label: "Logout",
        icon: "logout-circle-line",
        command: logout,
      },
    ],
  },
]);
const localeToggled = async (locale: string) => {
  const typedLocale = locale as TLocales;
  if (setLanguage) {
    setLanguage(typedLocale);
  }
  emit("localeChanged", typedLocale);
};
const isSearchingRef = ref(false);
const toggleSearching = () => {
  emit("searchToggled");
  isSearchingRef.value = !isSearchingRef.value;
};

const toggleSidebar = () => {
  emit("sidebarToggled");
};
</script>
<template>
  <header class="app-header flex gap-2 flex-wrap items-center mb-8">
    <slot name="logo">
      <AppBtn
        icon="d-logo"
        key="d-logo"
        class="app-logo-icon md:hidden"
        :fluid="true"
        variant="text"
        action="/dashboard"
      />
    </slot>

    <slot name="sidebar-toggler" :toggle="toggleSidebar">
      <div class="">
        <AppBtn
          icon="menu-2-line"
          key="menu-2-line"
          variant="text"
          class="color-text desktop--toggler justify-start"
          @click="toggleSidebar"
        />
      </div>
    </slot>
    <div class="grow md:order-4"></div>

    <slot
      name="search"
      :isSearching="isSearchingRef"
      :toggle="toggleSearching"
      :suggestions="globalSearchSuggestionsRef"
    >
      <div class="search-box md:order-5">
        <AppBtn
          size="small"
          :action="toggleSearching"
          icon="menu-search-line"
          class="glass searching-btn"
        />
        <AutoComplete
          v-if="isSearchingRef"
          ref="autoCompleteElementRef"
          placeholder="search"
          :pt="{ InputText: 'rounded-lg ' }"
          size="lg"
          class="rounded-lg ms-3"
          @complete="globalSearchOntype"
          @optionSelect="globalSearchOnSelect"
          v-model="globalSearchValueRef"
          :suggestions="globalSearchSuggestionsRef"
        >
          <template #option="slotProps">
            <div class="flex items-center">
              <AppIcon :icon="slotProps.option.icon" />
              <div>{{ slotProps.option.label }}</div>
            </div>
          </template>
        </AutoComplete>
      </div>
    </slot>
    <slot name="theme-toggler">
      <AppThemeToggler
        size="small"
        dark-icon="sun-line"
        light-icon="moon-line"
        class="md:order-5 glass color-text hidden md:flex"
      />
    </slot>

    <slot name="locale-toggler" :toggle="localeToggled">
      <AppLocaleToggler
        size="small"
        :callBack="localeToggled"
        icon="global-line"
        class="color-text hidden md:flex glass md:order-6"
      />
    </slot>
    <slot
      name="profile-menu"
      :toggle="profileMenuToggle"
      :items="profileMenuItems"
    >
      <div class="profile-menu md:order-7">
        <AppBtn
          size="small"
          type="button"
          variant="text"
          icon="user-3-line"
          class="color-text glass"
          :action="profileMenuToggle"
          aria-haspopup="true"
          aria-controls="overlay_menu"
        />
        <Menu
          ref="profileMenuElementRef"
          id="profile_overlay_menu"
          :pt="{ root: 'glass' }"
          :model="profileMenuItems"
          :popup="true"
        >
          <template #itemicon="{ item }">
            <AppIcon :icon="item.icon || ''" />
          </template>
          <template #start>
            <ul>
              <li class="p-menu-submenu-label">theme</li>

              <li>
                <AppThemeToggler
                  label="toggle_theme"
                  :callBack="() => profileMenuToggle()"
                  class="color-text"
                />
              </li>
              <li>
                <AppLocaleToggler
                  label="toggle_locale"
                  :callBack="() => profileMenuToggle()"
                  class="color-text"
                />
              </li>
            </ul>
          </template>
        </Menu>
      </div>
    </slot>
    <slot name="breadcrumb">
      <AppBreadcrumb />
    </slot>
  </header>
</template>
<style>
.app-header {
  z-index: 5;
  background-color: var(--glass);
  backdrop-filter: blur(10px);
  position: sticky;
  border-radius: 0.5rem;
  top: 0;
  padding: 0.5rem;
}
.p-panelmenu-panel {
  --tw-border-opacity: 0;
  background-color: transparent;
  border-left: 8px solid transparent;
}
.p-panelmenu-header {
  border-radius: 0.5rem;
}
.search-box {
  position: relative;
}
.searching {
  .searching-btn {
    position: absolute;
    z-index: 2;
    left: 20px;
    height: 80%;
    top: 10%;
  }
  .p-autocomplete input {
    padding-inline-start: 60px;
  }
}
.p-breadcrumb-list {
  flex-wrap: wrap;
}
</style>
