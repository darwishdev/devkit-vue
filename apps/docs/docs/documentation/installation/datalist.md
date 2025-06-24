---
title: Datalist
---
# Installing `@devkit/datalist`

The `@devkit/datalist` plugin provides a PrimeVue-based datatable wrapper with built-in integration for API calls, server-side filtering, sorting, pagination, and optional auth/file handlers.

---

## 1. Install Peer Dependencies

```bash
pnpm add @devkit/datalist \
  @devkit/apiclient \
  @devkit/form \
  @devkit/config \
  @devkit/base-components \
  @formkit/core @formkit/vue \
  @tanstack/query-persist-client-core @tanstack/vue-query \
  @vueuse/core dexie pinia primevue \
  tailwindcss tailwindcss-primeui vue-i18n
```


---

## 2. Register the Plugin

In your main entry (e.g. `main.ts`), register with your generated API client and optional handlers:

```ts
import { createApp } from 'vue'
import DevkitDatalistPlugin, { DevkitDatalistConfig } from '@devkit/datalist'
import { apiClient } from '@/pkg/apiClient'  // adjust to your path

const app = createApp(App)

const datalistConfig: DevkitDatalistConfig<typeof apiClient> = {
  apiClient,
  authHandler: {
    login: 'authLogin',
    allowedProviders: ['google'],
    providerLogin: 'authLoginProvider',
    providerLoginCallback: 'authLoginProviderCallback',
    resetPasswordEmail: 'authResetPasswordEmail',
    resetPassword: 'authResetPassword',
  },
  filesHandler: {
    bucketList: 'bucketList',
    fileUploadUrlFind: 'fileUploadUrlFind',
    galleryListEndpoint: 'galleryList',
    bucketCreateUpdate: 'bucketCreateUpdate',
    fileDelete: 'fileDelete',
    fileDeleteByBucket: 'fileDeleteByBucket',
    bucketDelete: 'bucketDelete',
  },
}

app.use(DevkitDatalistPlugin, datalistConfig)
app.mount('#app')
```

---

## 3. Configuration Options

| Option         | Type                              | Description                                       |
| -------------- | --------------------------------- | ------------------------------------------------- |
| `apiClient`    | `TApi`                            | Your API client instance (gRPC or custom REST)    |
| `authHandler`  | `AuthHandler<TApi>` *(optional)*  | Endpoints for login, OAuth providers, reset flows |
| `filesHandler` | `FilesHandler<TApi>` *(optional)* | Endpoints for upload URLs, bucket and file ops    |

---

with this setup, `<Datalist>` will handle sorting, filtering, and pagination through your API client and optional handlers.
