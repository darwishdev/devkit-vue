---
title: AppIcon
---
# `<AppIcon>`

A flexible icon component that can render:

* **PrimeVue icons** via the `pi pi-*` class
* **SVG icons** fetched from cache or via your API
* Optional **caching** of SVG content in IndexedDB
* **Slot hooks** to decorate above or below the icon

---

## Props

| Prop       | Type                             | Description                                                                                                            | Default |
| ---------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------- |
| `icon`     | `string`                         | Name of the icon (e.g. `"user"`, `"home"`, `"custom-logo"`)                                                            | —       |
| `size`     | `"small" \| "medium" \| "large"` | Size key, mapped to CSS dimensions (`1.5rem`, `2.25rem`, `3rem`)                                                       | —       |
| `iconType` | `"primevue" \| "svg"`            | Source type: `"primevue"` uses `<i class="pi pi-{icon}">`; `"svg"` loads an SVG from cache or API                      | —       |
| `useReset` | `boolean`                        | If `true`, resets SVG width/height/fill/stroke on each render to defaults before applying `size` and `color` overrides | `true`  |
| `color`    | `string`                         | CSS color value or CSS variable name for SVG `fill`/`stroke`                                                           | —       |

---

## Slots

* `top` — render content above the icon (e.g. badge)
* `bottom` — render content below the icon (e.g. label)

---

## How It Works

1. **Cache lookup**: tries `iconHelper.iconFind(icon)` from Dexie DB
2. **API fetch**: if not cached, calls the injected `iconFindApi` endpoint via `resolveApiEndpoint`
3. **SVG injection**: parses and adjusts the SVG Element’s attributes (size, color)
4. **PrimeVue fallback**: if `iconType === "primevue"`, renders `<i class="pi pi-{icon}">`

---

## Examples

### 1. PrimeVue Icon

```vue
<AppIcon icon="check" iconType="primevue" size="small" />
```

Renders `<i class="pi pi-check">` at 1.5 rem.

### 2. SVG Icon from Backend

```vue
<AppIcon icon="admin" iconType="svg" />
```
<AppIcon icon="admin" iconType="svg" />
Looks up `"admin"` in cache, otherwise fetches from `iconFindApi`, then renders the SVG.

### 3. Custom Size & Color

```vue
<AppIcon icon="trash"  iconType="svg" size="large" color="#e53e3e" />
```
<AppIcon icon="trash"  iconType="svg" size="large" color="red" />
Overrides default fill/stroke to red and dimensions to 3 rem.

### 4. Decorating with Slots

```vue
<AppIcon icon="message" iconType="svg">
  <template #top>
    <span class="badge">New</span>
  </template>
  <template #bottom>
    <small>Messages</small>
  </template>
</AppIcon>
```
<AppIcon icon="admin" iconType="svg">
  <template #top>
    <span class="badge">New</span>
  </template>
  <template #bottom>
    <small>Messages</small>
  </template>
</AppIcon>
Adds a badge above and a label below the icon.

---

## Injected Services

The component uses two provided values:

* `apiClient` — your API client instance
* `iconFindApi` — an `ApiEndpoint` for fetching icon SVGs

Ensure you pass these when registering the plugin so that `<AppIcon>` can fetch and cache icons.
