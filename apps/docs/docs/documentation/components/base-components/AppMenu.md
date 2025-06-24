---
title: AppMenu
---
# `<AppMenu>`

A responsive, flexible navigation component for building both horizontal and vertical menus. Built using PrimeVue’s `Menubar`, `PanelMenu`, and `Drawer`, it adapts seamlessly between desktop and mobile layouts.

Key features include:

* **Automatic mobile toggling** via a breakpoint
* **Horizontal (`Menubar`) or vertical (`PanelMenu`) modes**
* **Custom logo support** (image or icon)
* **Slot-driven content overrides** for full flexibility
* **Optional Drawer behavior on small screens**

## Props

| Prop               | Type                                                                 | Description                                                                                      | Default |
|--------------------|----------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|---------|
| `items`            | `Array<MenuItem & { labelAr?: string }>`                             | List of navigation items with optional Arabic label support                                      | —       |
| `isVertical`       | `boolean`                                                            | Whether to render the menu as vertical (`PanelMenu`) or horizontal (`Menubar`)                   | —       |
| `isCollabsable`    | `boolean`                                                            | (Reserved) Enables future collapsibility feature                                                 | —       |
| `useDrawerOnMobile`| `boolean`                                                            | If `true`, renders the menu inside a drawer on mobile viewports                                  | —       |
| `drawerProps`      | `DrawerProps`                                                        | Props forwarded to the `Drawer` component when in mobile mode                                    | `{}`    |
| `breakpoint`       | `number`                                                             | Window width (in px) below which the mobile version (drawer) is used                             | `570`   |
| `logo`             | `string` \| `{ src: string, type?: 'image' \| 'icon', size?: string }`| Logo config object or direct image path (supports icons with sizes)                              | —       |

## Slots

* `logo` — Custom logo content (replaces default logo logic)
* `item(scope)` — Custom render for each menu item
* `end` — Content to be rendered at the end of the menu (e.g. avatar, logout)
* `mobileToggler(scope)` — Custom trigger element for toggling the mobile drawer
* `collabseToggler(scope)` — (Reserved) Toggle button for collapsible mode

## Examples

### 1. Vertical Menu with Drawer on Mobile

```vue

<script setup lang="ts">
const menuItems = [
  {
    label: 'Dashboard',
    icon: 'home', // Name of the icon for AppIcon
    command: () => {
      console.log('Navigating to Dashboard');
      // router.push('/dashboard');
    }
  },
  {
    label: 'Settings',
    icon: 'settings',
    // The 'items' property creates a submenu
    items: [
      {
        label: 'Profile',
        icon: 'user',
        command: () => {
          console.log('Navigating to Profile Settings');
        }
      },
      {
        label: 'Billing',
        icon: 'credit-card',
        command: () => {
          console.log('Navigating to Billing');
        }
      }
    ]
  },
  {
    label: 'Help Center',
    icon: 'help',
    // The 'url' property can be used for external links
    url: 'https://example.com/help',
    target: '_blank' // Opens the link in a new tab
  },
  {
    label: 'Logout',
    icon: 'logout',
    command: () => {
      console.log('User logged out');
    }
  }
];

</script>

<template>
  <AppMenu
    :items="menuItems"
    :isVertical="true"
    :useDrawerOnMobile="true"
    :logo="{ src: 'logo.svg', type: 'image' }"
  />
</template>
````

<script setup lang="ts">
const menuItems = [
  {
    label: 'Dashboard',
    icon: 'home', // Name of the icon for AppIcon
    command: () => {
      console.log('Navigating to Dashboard');
      // router.push('/dashboard');
    }
  },
  {
    label: 'Settings',
    icon: 'settings',
    // The 'items' property creates a submenu
    items: [
      {
        label: 'Profile',
        icon: 'user',
        command: () => {
          console.log('Navigating to Profile Settings');
        }
      },
      {
        label: 'Billing',
        icon: 'credit-card',
        command: () => {
          console.log('Navigating to Billing');
        }
      }
    ]
  },
  {
    label: 'Help Center',
    icon: 'help',
    // The 'url' property can be used for external links
    url: 'https://example.com/help',
    target: '_blank' // Opens the link in a new tab
  },
  {
    label: 'Logout',
    icon: 'logout',
    command: () => {
      console.log('User logged out');
    }
  }
];

</script>

<AppMenu
:items="menuItems"
:isVertical="true"
:useDrawerOnMobile="true"
:logo="{ src: 'logo.svg', type: 'image' }"
/>

### 2. Horizontal Menu with Custom Logo Slot

```vue

<script setup lang="ts">
const menuItems = [
  {
    label: 'Dashboard',
    icon: 'home', // Name of the icon for AppIcon
    command: () => {
      console.log('Navigating to Dashboard');
      // router.push('/dashboard');
    }
  },
  {
    label: 'Settings',
    icon: 'settings',
    // The 'items' property creates a submenu
    items: [
      {
        label: 'Profile',
        icon: 'user',
        command: () => {
          console.log('Navigating to Profile Settings');
        }
      },
      {
        label: 'Billing',
        icon: 'credit-card',
        command: () => {
          console.log('Navigating to Billing');
        }
      }
    ]
  },
  {
    label: 'Help Center',
    icon: 'help',
    // The 'url' property can be used for external links
    url: 'https://example.com/help',
    target: '_blank' // Opens the link in a new tab
  },
  {
    label: 'Logout',
    icon: 'logout',
    command: () => {
      console.log('User logged out');
    }
  }
];

</script>

<template>
  <AppMenu :items="menuItems">
    <template #logo>
      <span class="text-xl font-bold">MyBrand</span>
    </template>
  </AppMenu>
</template>
```

<AppMenu :items="menuItems">
  <template #logo>
    <span class="text-xl font-bold">MyBrand</span>
  </template>
</AppMenu>

### 3. Mobile Drawer Toggler Slot

```vue

<script setup lang="ts">
const menuItems = [
  {
    label: 'Dashboard',
    icon: 'home', // Name of the icon for AppIcon
    command: () => {
      console.log('Navigating to Dashboard');
      // router.push('/dashboard');
    }
  },
  {
    label: 'Settings',
    icon: 'settings',
    // The 'items' property creates a submenu
    items: [
      {
        label: 'Profile',
        icon: 'user',
        command: () => {
          console.log('Navigating to Profile Settings');
        }
      },
      {
        label: 'Billing',
        icon: 'credit-card',
        command: () => {
          console.log('Navigating to Billing');
        }
      }
    ]
  },
  {
    label: 'Help Center',
    icon: 'help',
    // The 'url' property can be used for external links
    url: 'https://example.com/help',
    target: '_blank' // Opens the link in a new tab
  },
  {
    label: 'Logout',
    icon: 'logout',
    command: () => {
      console.log('User logged out');
    }
  }
];

</script>

<template>
  <AppMenu :items="menuItems" :useDrawerOnMobile="true">
    <template #mobileToggler="{ toggle }">
      <AppBtn icon="menu" label="Open Menu" :action="toggle" />
    </template>
  </AppMenu>
</template>
```

<AppMenu :items="menuItems" :useDrawerOnMobile="true">
  <template #mobileToggler="{ toggle }">
    <AppBtn icon="menu" label="Open Menu" :action="toggle" />
  </template>
</AppMenu>

### 4. Custom Menu Item Template

```vue


<script setup lang="ts">
const menuItems = [
  {
    label: 'Dashboard',
    icon: 'home', // Name of the icon for AppIcon
    command: () => {
      console.log('Navigating to Dashboard');
      // router.push('/dashboard');
    }
  },
  {
    label: 'Settings',
    icon: 'settings',
    // The 'items' property creates a submenu
    items: [
      {
        label: 'Profile',
        icon: 'user',
        command: () => {
          console.log('Navigating to Profile Settings');
        }
      },
      {
        label: 'Billing',
        icon: 'credit-card',
        command: () => {
          console.log('Navigating to Billing');
        }
      }
    ]
  },
  {
    label: 'Help Center',
    icon: 'help',
    // The 'url' property can be used for external links
    url: 'https://example.com/help',
    target: '_blank' // Opens the link in a new tab
  },
  {
    label: 'Logout',
    icon: 'logout',
    command: () => {
      console.log('User logged out');
    }
  }
];

</script>

<template>
  <AppMenu :items="menuItems">
    <template #item="{ item }">
      <AppBtn :label="item.label" :icon="item.icon" variant="outlined" />
    </template>
  </AppMenu>
</template>
```


<AppMenu :items="menuItems">
  <template #item="{ item }">
    <AppBtn :label="item.label" :icon="item.icon" variant="outlined" />
  </template>
</AppMenu>
