---
title: AppThemeToggler
---
# `<AppThemeToggler>`

A theme toggle component that switches a CSS class (e.g. `"dark"`) on the `<body>` element and swaps its icon. Useful for light/dark mode buttons.

## Props

| Prop        | Type                               | Description                                                    | Default  |
| ----------- | ---------------------------------- | -------------------------------------------------------------- | -------- |
| `className` | `string`                           | CSS class to toggle on `<body>`                                | `"dark"` |
| `darkIcon`  | `string`                           | Icon name to display when the `className` is present           | `"sun"`  |
| `lightIcon` | `string`                           | Icon name to display when the `className` is absent            | `"moon"` |
| `callBack`  | `(mode: "dark" \| "light") ⇒ void` | Optional callback invoked after toggle, receiving the new mode | —        |

## How It Works

* Toggles the given `className` on `document.body`.
* Tracks the current mode and updates `iconName`.
* Emits `callBack(mode)` if provided, with `"dark"` or `"light"`.

---

## Examples

### Basic Usage

```vue
<template>
  <AppThemeToggler />
</template>
```

<AppThemeToggler />


<template>
    <div class="card flex justify-center">
        <Listbox v-model="selectedCity" :options="cities" optionLabel="name" class="w-full md:w-56" />
    </div>
</template>

<script setup>
import { ref } from "vue";

const selectedCity = ref();
const cities = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
</script>
---

### Custom Class & Icons

```vue
<template>
  <AppThemeToggler
    className="dark-mode"
    darkIcon="moon"
    lightIcon="sun"
  />
</template>
```

<AppThemeToggler className="dark-mode" darkIcon="moon" lightIcon="sun" />

---

### With Callback

```vue
<template>
  <AppThemeToggler
    :callBack="mode => console.log('Switched to', mode)"
  />
</template>
```

<AppThemeToggler :callBack="mode => console.log('Switched to', mode)" />
