---
title: AppLocaleToggler
---
# `<AppLocaleToggler>`

A locale switcher that toggles between languages by updating `vue-i18n` locale and persisting the choice via `cacheHelper`.

---

## Props

| Prop   | Type     | Description                                  | Default   |
| ------ | -------- | -------------------------------------------- | --------- |
| `icon` | `string` | Name of the icon to display (via `<AppBtn>`) | `"globe"` |

---

## How It Works

* Uses `toggleLocale({ i18n, cacheHelper })` to switch between locales and save the choice.
* Renders an `<AppBtn>` with the provided `icon`.
* Exposes a `toggle` function via the default slot scope.

---

## Examples

### Default Usage

```vue
<template>
  <AppLocaleToggler />
</template>
```

<AppLocaleToggler />

---

### Custom Icon

```vue
<template>
  <AppLocaleToggler icon="language" />
</template>
```

<AppLocaleToggler icon="language" />

---

### Using Slot Scope

You can grab the `toggle` function for custom UI:

```vue
<template>
  <AppLocaleToggler v-slot="{ toggleLocale }">
    <button @click="toggleLocale" class="px-4 py-2 bg-gray-200 rounded">
      Switch Language
    </button>
  </AppLocaleToggler>
</template>
```

  <AppLocaleToggler v-slot="{ toggleLocale }">
    <button @click="toggleLocale" class="px-4 py-2 bg-gray-200 rounded">
      Switch Language
    </button>
  </AppLocaleToggler>

