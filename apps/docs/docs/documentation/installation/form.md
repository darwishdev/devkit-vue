---
title: Form
---

# Installing `@devkit/form`

The `@devkit/form` plugin wraps FormKit and integrates with your API client, providing:

- `<AppForm>` – dynamic form renderer  
- `<LoginForm>` – built-in authentication form  
- `Datepicker` input and other FormKit inputs  
- `db` helper for client-side storage  

---

## 1. Install Peer Dependencies

```bash
pnpm add @devkit/form @devkit/apiclient @devkit/base-components \
  @formkit/core @formkit/vue \
  @tanstack/query-persist-client-core @tanstack/vue-query \
  @vueuse/core dexie pinia primevue \
  tailwindcss tailwindcss-primeui vue-i18n
````


---

## 2. Register the Plugin

In your main entry (e.g. `main.ts`):

```ts
import { createApp } from 'vue'
import DevkitFormPlugin, { DevkitFormConfig, formKitConfig, LoginForm, AppForm } from '@devkit/form'
import { apiClient } from '@/pkg/apiClient'  // adjust path

const app = createApp(App)

const formConfig: DevkitFormConfig<typeof apiClient> = {
  apiClient,
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
  }
}

app.use(DevkitFormPlugin, formConfig)
app.mount('#app')
```

---

## 3. `AuthHandler` & `FilesHandler` Types

### `AuthHandler<TApi>`

Controls all authentication flows; required for `<LoginForm>`:

```ts
export type AuthHandler<TApi extends Record<string, Function>> = {
  login: ApiEndpoint<TApi, AuthLoginRequest, AuthLoginResponse>;
  allowedProviders?: string[];
  providerLogin?: ApiEndpoint<TApi, AuthLoginProviderRequest, AuthLoginProviderResponse>;
  redirectRoute?: string;
  providerLoginCallback?: ApiEndpoint<TApi, AuthLoginProviderCallbackRequest, AuthLoginResponse>;
  resetPasswordEmail?: ApiEndpoint<TApi, AuthResetPasswordEmailRequest, AuthResetPasswordEmailResponse>;
  resetPassword?: ApiEndpoint<TApi, AuthResetPasswordRequest, AuthResetPasswordResponse>;
}
```

> **Note:** `<LoginForm>` won’t render unless `authHandler` is provided.

### `FilesHandler<TApi>`

Handles all file-upload endpoints, used by the built-in upload inputs:

```ts
export type FilesHandler<TApi extends Record<string, Function>> = {
  bucketList: ApiEndpoint<TApi, BucketListRequest, BucketListResponse>;
  fileUploadUrlFind: ApiEndpoint<TApi, FileUploadUrlFindRequest, FileUploadUrlFindResponse>;
  galleryListEndpoint: ApiEndpoint<TApi, GalleryListRequest, GalleryListResponse>;
  defauleBucketName?: string;
  bucketCreateUpdate?: ApiEndpoint<TApi, BucketCreateUpdateRequest, BucketCreateUpdateResponse>;
  fileDelete?: ApiEndpoint<TApi, DeleteRequest<'records', string, 'bulk'>, any>;
  fileDeleteByBucket?: ApiEndpoint<TApi, { records: string[]; bucketName: string }, any>;
  bucketDelete?: ApiEndpoint<TApi, DeleteRequest<'records', string, 'bulk'>, any>;
}
```

These handlers are provided via Vue’s `provide` and injected into custom FormKit inputs for seamless file uploads.

---

## 4. Usage Example

### Dynamic Form

```vue
<template>
  <AppForm :sections="userFormSections" @submit="onSubmit" />
</template>

<script setup lang="ts">
import { AppForm } from '@devkit/form'
import type { AppFormSections } from '@devkit/form'

// define your form schema...
const userFormSections: AppFormSections = [ /* … */ ]

function onSubmit(values: Record<string, unknown>) {
  console.log('submitted', values)
}
</script>
```

### Login Form

```vue
<template>
  <LoginForm />
</template>

<script setup lang="ts">
import { LoginForm } from '@devkit/form'
</script>
```

Once configured, all auth flows and file-upload inputs will hook directly into your API endpoints.

