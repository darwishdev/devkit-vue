---
title: Admin Panel
---
# Installing `@devkit/admin`

The `@devkit/admin` plugin bundles all DevKit Vue packages into a single plugin, wiring up Base Components, Forms, Datalist, and File Manager with one configuration.

---

## 1. Install Peer Dependencies

```bash
pnpm add @devkit/admin \
  @devkit/apiclient \
  @devkit/base-components \
  @devkit/form \
  @devkit/datalist \
  @devkit/filemanager \
  @devkit/config \
  @formkit/core @formkit/vue \
  @tanstack/query-persist-client-core @tanstack/vue-query \
  @vueuse/core dexie pinia primevue \
  tailwindcss tailwindcss-primeui vue-i18n
```

💡 You only need to install `vue` and `vue-router` once per app—omit them here if already present.

---

## 2. Register the Plugin

In your main entry (e.g. `main.ts`), import and configure:

```ts
import { createApp } from 'vue'
import DevkitAdminPlugin, { DevkitAdminConfig } from '@devkit/admin'
import { apiClient } from '@/pkg/apiClient'  // adjust path as needed

const app = createApp(App)

const adminConfig: DevkitAdminConfig<typeof apiClient> = {
  apiClient,
  locales: ['en', 'ar'],
  baseImageUrl: 'https://cdn.example.com/images/',
  authHandler: {
    login: 'authLogin',
    allowedProviders: ['google'],
    providerLogin: 'authLoginProvider',
    providerLoginCallback: 'authLoginProviderCallback',
    resetPasswordEmail: 'authResetPasswordEmail',
    resetPassword: 'authResetPassword'
  },
  filesHandler: {
    bucketList: 'bucketList',
    fileUploadUrlFind: 'fileUploadUrlFind',
    galleryListEndpoint: 'galleryList',
    bucketCreateUpdate: 'bucketCreateUpdate',
    fileDelete: 'fileDelete',
    fileDeleteByBucket: 'fileDeleteByBucket',
    bucketDelete: 'bucketDelete'
  },
  iconFindApi: 'iconFind'
}

app.use(DevkitAdminPlugin, adminConfig)
app.mount('#app')
```

---

## 3. `DevkitAdminConfig` Options

| Option         | Type                                                                | Description                                                     |
| -------------- | ------------------------------------------------------------------- | --------------------------------------------------------------- |
| `apiClient`    | `TApi`                                                              | Your API client instance (gRPC or custom REST)                  |
| `locales`      | `string[]`                                                          | Supported locale codes                                          |
| `baseImageUrl` | `string` *(optional)*                                               | Base URL for resolving image paths                              |
| `authHandler`  | `AuthHandler<TApi>`                                                 | Authentication endpoints for `<LoginForm>` and protected forms  |
| `filesHandler` | `FilesHandler<TApi>` *(optional)*                                   | File and bucket endpoints for `<FileManager>` and upload inputs |
| `iconFindApi`  | `ApiEndpoint<TApi, IconFindRequest, IconFindResponse>` *(optional)* | Endpoint for searching icons                                    |

---

With this setup, you have a complete admin UI powered by DevKit Vue.
