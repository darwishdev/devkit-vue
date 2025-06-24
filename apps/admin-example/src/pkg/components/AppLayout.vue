<script lang="ts" setup>

import AutoComplete, { type AutoCompleteCompleteEvent, type AutoCompleteOptionSelectEvent } from 'primevue/autocomplete';
import { AppBreadcrumb,AppBtn,AppIcon,AppLocaleToggler, AppMenu, AppThemeToggler, type AppMenuItem } from "@devkit/base-components";
import { useRouter } from "vue-router";
import { i18n, setLanguage } from '../plugins/i18n.config'
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Menu from 'primevue/menu';
import { apiClient } from "../api/apiClient";
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import type { CommandPallete } from '@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/command_pallete_pb';
import { translationList, type SUPPORTE_LOCALES_TYPE } from '../plugins/i18n.config';
const globalSearchValueRef = ref()
const globalSearchSuggestionsRef = ref<CommandPallete[]>([])
const autoCompleteElementRef = ref<any>(null)
 onMounted(() => {
   const onKeydown = async (e: KeyboardEvent) => {
     if (e.ctrlKey && e.key.toLowerCase() === 'g') {
       e.preventDefault()
       isSearchingRef.value = true                 // make the <AutoComplete> appear
       await nextTick()                             // wait for it to render
       // PrimeVue AutoComplete doesn’t expose focus(),
       // so grab its inner <input> and call focus():
       const inputEl = autoCompleteElementRef.value?.$el.querySelector('input')
      if(inputEl) {
        inputEl.focus()
      }
     }
   }
   document.addEventListener('keydown', onKeydown)
   onBeforeUnmount(() => {
     document.removeEventListener('keydown', onKeydown)
   })
 })
const router = useRouter()
const globalSearchOnSelect = (event : AutoCompleteOptionSelectEvent) => {
  if(event.value.route) router.push(event.value.route)
  globalSearchValueRef.value = null
  globalSearchSuggestionsRef.value = []
}
const globalSearchOntype = (event : AutoCompleteCompleteEvent) => {
  console.log("event is" , event)
  apiClient.commandPalleteSearch({query: event.query}).then((resp) => {
    console.log("resp is" , resp)
    globalSearchSuggestionsRef.value = resp.hits
  })
}

const tenantSidebar: AppMenuItem[] = [
{
    label: 'Dashboard',
    icon: 'dashboard-line',
    route: '/dashboard'
  },

  {
    label: 'Property',
    icon: 'map-pin-2-line',
    items: [
      { label: 'Cities',    icon: 'map-pin-2-line',    route: '/property/cities'    },
      { label: 'Locations', icon: 'map-pin-user-line', route: '/property/locations' }
    ]
  },
  {
    label: 'Content',
    icon: 'file-line',
    items: [
      { label: 'Pages',    icon: 'file-line',    route: '/tenant/pages'    },
      { label: 'Sections', icon: 'grid-line',    route: '/tenant/sections' },
      { label: 'Partials', icon: 'ball-pen-line', route: '/tenant/partials' }
    ]
  },
  {
    label: 'Media',
    icon: 'multi-image-line',
    items: [
      { label: 'Buckets',   icon: 'safe-line',         route: '/public/buckets'   },
      { label: 'Files',     icon: 'file-line',         route: '/public/files'     },
    ]
  }]

const navigationBar: AppMenuItem[] = JSON.parse(
  localStorage.getItem("sidebar")!,
);
// const navigationBar: AppMenuItem[] =  [
//
//   {
//     label: 'Dashboard',
//     icon: 'dashboard-line',
//     route: '/dashboard'
//   },
//   {
//     label: 'Accounts',
//     icon: 'profile-line',
//     items: [
//       { label: 'Roles',    icon: 'award-line',        route: '/accounts/roles'    },
//       { label: 'Users',    icon: 'user-line',         route: '/accounts/users'    },
//       { label: 'Sessions', icon: 'timer-2-line',      route: '/accounts/sessions' }
//     ]
//   },
//   {
//     label: 'Tenants',
//     icon: 'building-line',
//     items: [
//       { label: 'Tenants', icon: 'building-line', route: '/tenants' }
//     ]
//   },
//   {
//     label: 'Public',
//     icon: 'planet-line',
//     items: [
//       { label: 'Icons',        icon: 'multi-image-line', route: '/public/icons'        },
//       { label: 'Buckets',      icon: 'safe-line',         route: '/public/buckets'      },
//       { label: 'Files',        icon: 'file-line',         route: '/public/files'        },
//       { label: 'Translations', icon: 'translate',     route: '/public/translations' }
//     ]
//   },
//   {
//     label: 'Property',
//     icon: 'map-pin-2-line',
//     items: [
//       { label: 'Cities',    icon: 'map-pin-2-line',    route: '/property/cities'    },
//       { label: 'Locations', icon: 'map-pin-user-line', route: '/property/locations' }
//     ]
//   },
//   {
//     label: 'Content',
//     icon: 'file-line',
//     items: [
//       { label: 'Pages',    icon: 'file-line',    route: '/tenant/pages'    },
//       { label: 'Sections', icon: 'grid-line',    route: '/tenant/sections' },
//       { label: 'Partials', icon: 'ball-pen-line', route: '/tenant/partials' }
//     ]
//   }
// ]
const { push } = useRouter();
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("access_token");
  localStorage.removeItem("sidebar");
  apiClient.authLogout({}).finally(() => {
    push("/login");
  })
};
const profileMenuElementRef = ref()
const profileMenuToggle = (event : Event) => {
    profileMenuElementRef.value.toggle(event);
}
const profileMenuItems = ref([
    {
        label: 'profile',
        items: [
            {
                label: 'Profile',
                icon: 'pi pi-user'
            },
            {
                label: 'Logoiut',
                icon: 'pi pi-sign-out',
        command: logout
            }
        ]
    }
])
const isSidebarHiddenRef = ref(false);
const appMenuElementRef = ref<InstanceType<typeof AppMenu> | null>()
const toggleSidebar = () => {

const breakpointNumber = 570
const windowWidth = window.innerWidth;

  if (windowWidth > breakpointNumber ) {
  isSidebarHiddenRef.value = !isSidebarHiddenRef.value
  }
  if(appMenuElementRef.value) {
    appMenuElementRef.value.toggleMobileMenu()
  }
}
const localeToggled = async (locale : string) => {
setLanguage(locale as SUPPORTE_LOCALES_TYPE)
}
const isSearchingRef = ref(false)
const toggleSearching  = () => {
  isSearchingRef.value = !isSearchingRef.value
}

</script>
<template>

  <Suspense>
    <template #default>
      <div :class="{ 'hidden-sidebar' : isSidebarHiddenRef }">
        <aside class="sidebar" >
          <AppMenu
            ref="appMenuElementRef"
            class="main-menu"
            :hide-drawer-toggler="true"
            :isVertical="true"
            :use-drawer-on-mobile="true"
            :items="navigationBar"
          >
            <template #logo>
              <AppBtn label="DEVKIT" icon='d-logo' :fluid="true" class="app-logo" variant="text" action="/dashboard" />
            </template>
          </AppMenu>
        </aside>
        <div class="page-content p-2">
          <div class="app-header flex gap-2 flex-wrap items-center mb-8">
            <AppBtn  icon='d-logo' key="d-logo" class="app-logo-icon md:hidden" :fluid="true"  variant="text" action="/dashboard" />
            <AppBtn icon="menu-2-line" key="menu-2-line" variant="text" class="color-text grow desktop--toggler justify-start md:grow-0" @click="toggleSidebar" />
            <AppThemeToggler size="small" dark-icon="sun-line" light-icon="moon-line" class="md:order-5 glass color-text"/>
            <AppLocaleToggler size="small" :callBack="localeToggled" icon="global-line" class="color-text glass md:order-6" />
            <div class="profile-menu md:order-7">
              <AppBtn size="small" type="button" variant="text" icon="user-3-line" class="color-text glass"  :action="profileMenuToggle" aria-haspopup="true" aria-controls="overlay_menu" />
              <Menu ref="profileMenuElementRef" id="profile_overlay_menu" :model="profileMenuItems" :popup="true" />
            </div>
            <AppBreadcrumb  class="grow"/>
            <AppBtn size="small" :action="toggleSearching" icon="menu-search-line" class="glass" />
            <AutoComplete  
              v-if="isSearchingRef"
              ref="autoCompleteElementRef"
              placeholder='search'
              :pt="{InputText : 'rounded-lg '}" 
              size="lg"
              class="rounded-lg ms-3" @complete="globalSearchOntype" 
              @optionSelect="globalSearchOnSelect" v-model="globalSearchValueRef" 
              :suggestions="globalSearchSuggestionsRef" >
              <template #option="slotProps">
                <div class="flex items-center">
                  <AppIcon :icon="slotProps.option.icon"  />
                  <div>{{ slotProps.option.label }}</div>
                </div>
              </template>
            </AutoComplete>
          </div>
          <div class="p-4">
            <RouterView />
          </div>
        </div>
      </div>
    </template>
    <template #fallback>
      <div>Loading from layoututttsss...</div>
    </template>
  </Suspense>
</template>
<style>

.page-content {
  @media (min-width: 570px) {
    margin-inline-start: var(--menu-width);
  }
  transition:  var(--transition) margin;
}
.p-panelmenu-panel{
  --tw-border-opacity: 0;
  background-color: transparent;
  border-left: 8px solid transparent;
}
.p-panelmenu-header{
  border-radius: .5rem;
}
</style>
