---
title: AppForm
---

# `<AppForm>`

A powerful, highly-configurable form component built on **FormKit** and designed for deep API integration. `<AppForm>` supports advanced behaviors like auto-filling from API, syncing with route/localStorage, pre-upload logic, and success/error handling — all driven by a dynamic schema.

Key features include:

* **Generic API integration** with type-safe handlers
* **FormKit-based schema** rendering
* **Auto-fetch with `findHandler`**, conditional on route
* **URL syncing and localStorage persistence**
* **Advanced submission flow** including file uploads, error parsing, and toast feedback
* **Scoped reset, clear, persist buttons**
* **Form state management via Pinia store**

## Props

| Prop      | Type                      | Description                                                                                   | Default |
| --------- | ------------------------- | --------------------------------------------------------------------------------------------- | ------- |
| `context` | `AppFormProps['context']` | Core configuration object for the form. Includes section schema, handlers, and behavior flags | —       |

### `context` Structure

| Key                       | Type                     | Description                                                            |
| ------------------------- | ------------------------ | ---------------------------------------------------------------------- |
| `title`                   | `string`                 | Form title (for display/use in modal headers, etc.)                    |
| `formKey`                 | `string`                 | Unique key used to bind FormKit form and manage state                  |
| `useClear`                | `boolean`                | Whether to show "Clear" button                                         |
| `usePresist`              | `boolean`                | Enables save-to-localStorage behavior                                  |
| `useReset`                | `boolean`                | Whether to show "Reset" button                                         |
| `resetOnSuccess`          | `boolean`                | If true, clears form after successful submission                       |
| `syncWithUrl`             | `boolean`                | Enables automatic form state syncing with route query                  |
| `isLazy`                  | `boolean`                | (Reserved) Lazy-loads API values                                       |
| `invalidateCaches`        | `string[]`               | Vue Query keys to invalidate after success                             |
| `invalidateCachesOnChage` | `string[]`               | Vue Query keys to invalidate when input changes                        |
| `options`                 | `AppFormOptions`         | Optional toast messages & form behavior                                |
| `submitHandler`           | `SubmitHandler`          | Object defining submit endpoint, mapping, callback, and redirect route |
| `findHandler`             | `FindHandler` (optional) | If set, fetches initial values based on route param or custom value    |
| `sections`                | `AppFormSections`        | FormKit schema layout grouped by section keys                          |

## Slots

* None — this component uses schema-driven rendering only.

## Examples

### 1. Minimal Form with Manual Sections

```vue
<script setup lang="ts">
import type { AppFormProps } from '@devkit/form'
import { MyApiClient } from '@/api'

const props: AppFormProps<typeof MyApiClient> = {
  context: {
    formKey: 'user-form',
    title: 'User Form',
    submitHandler: {
      endpoint: 'userCreate'
    },
    sections: {
      main: [
        { $formkit: 'text', name: 'username', label: 'Username' },
        { $formkit: 'email', name: 'email', label: 'Email' }
      ]
    }
  }
}
</script>

<template>
  <AppForm v-bind="props" />
</template>
```
<script setup lang="ts">
import type { AppFormProps } from '@devkit/form'
import { MyApiClient } from '@/api'

const props: AppFormProps<typeof MyApiClient> = {
  context: {
    formKey: 'user-form',
    title: 'User Form',
    submitHandler: {
      endpoint: 'userCreate'
    },
    sections: {
      main: [
        { $formkit: 'text', name: 'username', label: 'Username' },
        { $formkit: 'email', name: 'email', label: 'Email' }
      ]
    }
  }
}
</script>


<AppForm v-bind="props" />

### 2. Form with FindHandler (Auto Load by ID)

```ts
// router.ts
{
  path: '/users/:id/edit',
  component: UserEdit,
  meta: { requiresAuth: true }
}
```

```vue
<script setup lang="ts">
const props = {
  context: {
    formKey: 'edit-user',
    title: 'Edit User',
    submitHandler: {
      endpoint: 'updateUser'
    },
    findHandler: {
      endpoint: 'getUserById',
      requestPropertyName: 'recordId',
      responsePropertyName: 'request',
      routerParamName: 'id'
    },
    sections: {
      profile: [
        { $formkit: 'text', name: 'name', label: 'Full Name' },
        { $formkit: 'text', name: 'role', label: 'Role' }
      ]
    }
  }
}
</script>

<template>
  <AppForm v-bind="props" />
</template>
```

<AppForm v-bind="props" />

### 3. Form with LocalStorage Persistence and URL Sync

```vue
<AppForm
  :context="{
    title: 'Search Users',
    formKey: 'user-search',
    usePresist: true,
    syncWithUrl: true,
    submitHandler: {
      endpoint: 'searchUsers'
    },
    sections: {
      filters: [
        { $formkit: 'text', name: 'name', label: 'Name' },
        { $formkit: 'select', name: 'role', label: 'Role', options: ['admin', 'user'] }
      ]
    }
  }"
/>
```

<AppForm
:context="{
 title: 'Search Users',
 formKey: 'user-search',
 usePresist: true,
 syncWithUrl: true,
 submitHandler: {
   endpoint: 'searchUsers'
 },
 sections: {
   filters: [
     { $formkit: 'text', name: 'name', label: 'Name' },
     { $formkit: 'select', name: 'role', label: 'Role', options: ['admin', 'user'] }
   ]
 }
}"
/>

```
```
