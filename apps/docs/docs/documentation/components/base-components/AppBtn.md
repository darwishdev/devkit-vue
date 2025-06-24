---
title: AppBtn
---
# `<AppBtn>`

A versatile button component built on PrimeVue’s `<Button>`, with built-in support for:

* **Icons** (SVG via `AppIcon` or any slot content)
* **Routing** (`route` prop)
* **External links** (`action` starting with “http”)
* **Click handlers** (function passed to `action`)
* **Localization** (`label` / `labelAr`)
* **Size**, **color**, and **iconType** customization

## Props

| Prop       | Type                    | Description                                                                          | Default |
| ---------- | ----------------------- | ------------------------------------------------------------------------------------ | ------- |
| `label`    | `string`                | Primary button text                                                                  | —       |
| `labelAr`  | `string`                | Arabic fallback text when locale is `"ar"`                                           | —       |
| `icon`     | `string`                | Name of the icon to load from backend via `AppIcon`                                  | —       |
| `iconType` | `string`                | Type of icon (e.g. `"svg"`, `"font"`), forwarded to `AppIcon`                        | —       |
| `size`     | `string`                | Button size (e.g. `"sm"`, `"md"`, `"lg"`)                                            | —       |
| `color`    | `string`                | Theme color variant (e.g. `"primary"`, `"secondary"`)                                | —       |
| `route`    | `string`                | Vue Router path; renders a `<RouterLink>`                                            | —       |
| `action`   | `() ⇒ void` \| `string` | Click handler function or navigation URL; if starting with `"http"` renders an `<a>` | —       |
| `useReset` | `boolean`               | Whether to reset icon colors on each render                                          | `true`  |

## Slots

* `default` — override both icon and label
* `icon` — custom icon content
* `label` — custom label content
* `end` — content rendered at the end (e.g. spinner, badge)

## Examples

### 1. Default Button

```vue
<template>
    <AppBtn label="Click Me" />
</template>
```
<AppBtn label="Click Me" />

### 2. SVG Icon from Backend

```vue
<template>
    <AppBtn label="Admin" icon="admin" />
</template>
```
<AppBtn label="Admin" icon="admin" />
### 3. PrimeVue Icon via Slot

```vue
<template>
    <AppBtn label="check" icon="check" iconType="primevue" />
</template>
```
<AppBtn label="check" icon="check" iconType="primevue" />

### 4. Router Navigation

```vue
<template>
    <AppBtn label="Go Home" action="/home" />
</template>
```
<AppBtn label="Go Home" action="/home" />
### 5. External Link

```vue
<template>
    <AppBtn label="Visit Site" action="https://example.com" />
</template>
```
<AppBtn label="Visit Site" action="https://example.com" />

### 6. Click Handler

```vue
<template>
    <AppBtn label="Function" :action="() => console.log('clicked')" />
</template>
```
<AppBtn label="Function" :action="() => console.log('clicked')" />

### 7. Localization

```vue
<template>
    <AppBtn label="Submit" labelAr="إرسال" />
</template>
```
<AppLocaleToggler />

<AppBtn label="Submit" labelAr="إرسال" />
### 8. Custom Size & Color

```vue
<template>
    <AppBtn class="mb-4"  label="Info" size="small" severity="info"   />
    <AppBtn label="Warn" size="medium" severity="warn" />
    <AppBtn label="Danger" size="large" severity="danger" />
</template>
```    
<div class="mb-4">
<AppBtn class="mb-4"  label="Info" size="small" severity="info"   />
</div>

<div class="mb-4">
    <AppBtn label="Warn" size="medium" severity="warn" />

</div>
<div class="mb-4">
    <AppBtn label="Danger" size="large" severity="danger" />

</div>
