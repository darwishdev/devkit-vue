---
title: AppBreadcrumb
---
# `<AppBreadcrumb>`

A flexible breadcrumb navigation component built on PrimeVue’s `<Breadcrumb>`. It supports both explicit item props and automatic breadcrumb generation from Vue Router’s route metadata.

Key features include:

* **Supports manual or auto-derived breadcrumbs**
* **Custom item rendering** with icon and label
* **Localization support** using `vue-i18n`
* **Router-aware navigation** with `@click.prevent`

## Props

| Prop    | Type         | Description                                                                               | Default |
| ------- | ------------ | ----------------------------------------------------------------------------------------- | ------- |
| `items` | `MenuItem[]` | Optional manual breadcrumb items. If not provided, falls back to `route.meta.breadcrumbs` | —       |

## Slots

* `item` — Custom template for rendering each breadcrumb item. Default template includes icon and localized label with router support.

## Examples

### 1. Manual Breadcrumbs with Icons

```vue
<template>
  <AppBreadcrumb :items="[
    { label: 'Settings', icon: 'cog', to: '/settings' },
    { label: 'Profile', icon: 'user' }
  ]" />
</template>
```

<AppBreadcrumb :items="[
{ label: 'Settings', icon: 'cog', to: '/settings' },
{ label: 'Profile', icon: 'user' }
]" />

### 2. Automatic Breadcrumbs via Route Meta

```ts
// In your router config
{
  path: '/settings/profile',
  component: ProfileView,
  meta: {
    breadcrumbs: [
      { label: 'Settings', icon: 'cog', to: '/settings' },
      { label: 'Profile', icon: 'user' }
    ]
  }
}
```

```vue
<template>
  <AppBreadcrumb />
</template>
```
<AppBreadcrumb :items="[
{ label: 'Settings', icon: 'cog', to: '/settings' },
{ label: 'Profile', icon: 'user' }
]" />
