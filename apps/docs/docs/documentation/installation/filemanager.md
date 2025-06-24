---
title: File Manager
---
# Installing `@devkit/filemanager`

The `@devkit/filemanager` plugin provides a file management UI component and integrates with your API client and file handler configuration.

---

## 1. Install Peer Dependencies

```base
pnpm add @devkit/filemanager&#x20;
@devkit/apiclient&#x20;
@devkit/datalist&#x20;
@devkit/form&#x20;
@devkit/config&#x20;
@devkit/base-components&#x20;
@formkit/core @formkit/vue&#x20;
@tanstack/query-persist-client-core @tanstack/vue-query&#x20;
@vueuse/core dexie pinia primevue&#x20;
tailwindcss tailwindcss-primeui vue-i18n
```
---

## 2. Register the Plugin

In your main entry (e.g. `main.ts`), register with your API client and optional `filesHandler`:
```ts
import { createApp } from 'vue'
import DevkitFilemanagerPlugin, { DevkitFilemanagerConfig } from '@devkit/filemanager'
import { apiClient } from '@/pkg/apiClient'  // adjust to your path

const app = createApp(App)

const filemanagerConfig: DevkitFilemanagerConfig<typeof apiClient> = {
apiClient,
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

app.use(DevkitFilemanagerPlugin, filemanagerConfig)
app.mount('#app')
```
---

## 3. Configuration Options

| Option         | Type                              | Description                               |
| -------------- | --------------------------------- | ----------------------------------------- |
| `apiClient`    | `TApi`                            | Your API client instance (gRPC or custom) |
| `filesHandler` | `FilesHandler<TApi>` *(optional)* | Endpoints for bucket and file operations  |

---

## 4. Usage Example

Once registered, import and use the `<FileManager>` component to browse, upload, preview, and manage files:
```vue
<template>  
  <FileManager />  
</template>  

<script setup lang="ts">  
import { FileManager } from '@devkit/filemanager'  
</script>  
```
The `<FileManager>` UI will hook into your configured `filesHandler` endpoints to list buckets, upload files, show previews, and perform batch actions.
