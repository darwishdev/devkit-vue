---
title: AppImage
---
# `<AppImage>`

A wrapper around PrimeVue’s `<Image>` component that automatically prefixes relative paths with your `baseImageUrl`, falls back to a `noImageUrl` on load error, and exposes all of PrimeVue `<Image>`’s props and slots.

## Props

| Prop              | Type                                   | Description                                                                  |
| ----------------- | -------------------------------------- | ---------------------------------------------------------------------------- |
| `src`             | `string`                               | Image URL or relative path. Relative paths are prefixed with `baseImageUrl`. |
| `preview`         | `boolean`                              | Enable image preview.                                                        |
| `imageStyle`      | `any`                                  | Inline style object applied to the `<img>`.                                  |
| `imageClass`      | `any`                                  | CSS classes applied to the `<img>`.                                          |
| `previewIcon`     | `string`                               | Custom preview indicator icon (replaces deprecated `indicatorIcon`).         |
| `indicatorIcon`   | `string` *(deprecated)*                | Legacy custom indicator icon—use `previewIcon` instead.                      |
| `zoomInDisabled`  | `boolean`                              | Disable the zoom-in button.                                                  |
| `zoomOutDisabled` | `boolean`                              | Disable the zoom-out button.                                                 |
| `dt`              | `DesignToken<any>`                     | Scoped CSS variables for theming.                                            |
| `pt`              | `PassThrough<ImagePassThroughOptions>` | Pass-through props to inner DOM elements.                                    |
| `ptOptions`       | `PassThroughOptions`                   | Configuration for pass-through options.                                      |
| `unstyled`        | `boolean`                              | Remove the component’s core styles.                                          |

## Slots

| Slot          | Description                                                                           |
| ------------- | ------------------------------------------------------------------------------------- |
| `previewicon` | Custom preview indicator template.                                                    |
| `refresh`     | Custom refresh button template.                                                       |
| `undo`        | Custom undo button template.                                                          |
| `zoomout`     | Custom zoom-out button template.                                                      |
| `zoomin`      | Custom zoom-in button template.                                                       |
| `close`       | Custom close button template.                                                         |
| `image`       | Fully override the inner image rendering. Receives `{ class, style, errorCallback }`. |
| `original`    | Override the original preview. Receives `{ class, style, previewCallback }`.          |

## Injected Values

* **`baseImageUrl`** (or `VITE_BASE_IMAGE_URL`) — prefix for relative `src`
* **`noImageUrl`** (or `VITE_FALLBACK_IMAGE_URL`) — fallback when an image fails to load

## Usage Examples

### 1. Relative Path

Uses `baseImageUrl` prefix, then falls back on error:

```vue
<template>
  <AppImage src="users/avatar.png" />
</template>
```

### 2. Absolute URL & Preview

Bypasses prefix and enables preview:

```vue
<template>
  <AppImage src="https://example.com/photo.jpg" preview />
</template>
```

### 3. Custom Preview Icon

Override the default indicator:

```vue
<template>
  <AppImage src="gallery/item.png" preview>
    <template #previewicon>
      <i class="pi pi-search-plus" />
    </template>
  </AppImage>
</template>
```

### 4. Inline Styling & Classes

```vue
<template>
  <AppImage
    src="logo.svg"
    :imageStyle="{ borderRadius: '8px' }"
    imageClass="shadow-lg"
  />
</template>
```

### 5. Full Image Slot Override

Handle `onError` yourself:

```vue
<template>
  <AppImage src="product.png">
    <template #image="{ class: cls, style: sty, errorCallback }">
      <div :class="cls" :style="sty">
        <img
          src="fallback.png"
          @error="errorCallback"
          alt="Custom fallback"
        />
      </div>
    </template>
  </AppImage>
</template>
```
<AppImage src="abchotels/01.webp" />
With these options, `<AppImage>` fits seamlessly into any DevKit Vue setup for robust, themable image handling.
