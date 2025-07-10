---
title: Base Components
---

# Installing `@devkitvue/base-components`

The `@devkitvue/base-components` plugin provides common UI components and utilities, including:

- **AppBtn**, **AppIcon**, **AppImage**, **AppThemeToggler**, **AppLocaleToggler**, **AppSection**, **AppDialog**, **AppBreadcrumb**, **AppMenu**  
- Helpers: `cacheHelper`, `iconHelper` and `setupI18nSync()` for locale persistence  
- Provides `apiClient`, `baseImageUrl`, `noImageUrl` and optional `iconFindApi` via Vue’s provide/inject  

---

## 1. Install Peer Dependencies

```bash
pnpm add @devkitvue/base-components @devkitvue/apiclient dexie primevue tailwindcss tailwindcss-primeui vue-i18n
````

<aside>
💡 You only need to install Vue and Vue Router once for your app—omit them here if already present.
</aside>

---

## 2. Register the Plugin

In your main entry (e.g. `main.ts`):

```ts
import { createApp } from 'vue'
import DevkitBaseComponentsPlugin, { DevkitBaseConfig } from '@devkitvue/base-components'
import { apiClient } from '@/pkg/apiClient'  // adjust path as needed

const app = createApp(App)

const baseConfig: DevkitBaseConfig<typeof apiClient> = {
  apiClient,
  locales: ['en', 'ar'],
  baseImageUrl: 'http://localhost:54321/storage/v1/object/public/',
  noImageUrl: 'http://localhost:54321/storage/v1/object/public/images/noimg.webp',
  iconFindApi: 'iconFind', // Endpoint name for icon search
}

app.use(DevkitBaseComponentsPlugin, baseConfig)
app.mount('#app')
```

---

## 3. Creating a Custom `apiClient`

You’re not tied to a gRPC client—you can wrap any REST API. Just expose methods whose names match your endpoint keys:

```ts
import axios, { AxiosInstance } from 'axios'
import type { IconFindRequest, IconFindResponse } from '@/pkg/types/api_types'

export class RestApiClient {
  private http: AxiosInstance

  constructor(baseURL: string) {
    this.http = axios.create({ baseURL })
  }

  // name must match your key, e.g. "iconFind"
  async iconFind(params: IconFindRequest): Promise<IconFindResponse> {
    const { data } = await this.http.get<IconFindResponse>('/icons', { params })
    return data
  }

  // add more endpoint methods...
}

// then in main.ts:
const apiClient = new RestApiClient('https://api.example.com')
app.use(DevkitBaseComponentsPlugin, { 
  apiClient, locales: ['en','ar'], baseImageUrl: '…', noImageUrl: '…', iconFindApi: 'iconFind' 
})
```

---

## 4. Understanding the `ApiEndpoint` Type

The plugin accepts any of these as `iconFindApi`:

```ts
export type ApiEndpoint<
  TApi extends Record<string, Function>,
  TReq extends Record<string, unknown> = {},
  TResp extends Record<string, unknown> = {}
> = keyof TApi
  | EndpointFunction<TReq, TResp>
  | Promise<TResp>
```

* **`'iconFind'`** — pass the key name
* **`apiClient.iconFind`** — pass the method directly
* **`apiClient.iconFind()`** — pass a promise (e.g. for prefetching)

---

## 5. Utilities

* **`cacheHelper`**: Dexie-based cache for storing data (e.g. locale)
* **`iconHelper`**: Helper for caching and retrieving icons
* **`setupI18nSync()`**: Call inside a component’s `setup()` to sync stored locale with `vue-i18n` on load

---

## 6. Usage Example

Once registered, import and use any component:

```vue
<template>
  <AppBtn type="primary">Click Me</AppBtn>
</template>

<script setup lang="ts">
import { AppBtn } from '@devkitvue/base-components'
</script>
```

