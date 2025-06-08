---
sidebarPosition: 2
---

# `@devkit/api-client`

A JavaScript client for your DevKit gRPC API, with utility functions and interceptors.

## Installation

```bash
pnpm add @devkit/api-client
````

## Basic Usage

```ts
import {
  resolveApiEndpoint,
  AuthInterceptor,
  AssertIsDefined,
  deepMerge,
  ObjectKeys,
  subtractRecords
} from '@devkit/api-client';

// configure your client
const apiUrl = resolveApiEndpoint('getUser', { baseUrl: 'https://api.example.com' });

// use interceptor
const client = new SomeGrpcClient(apiUrl, {
  interceptors: [new AuthInterceptor(token)]
});
```

## Exports

### `resolveApiEndpoint(name, opts)`

* **Signature:**

  ```ts
  resolveApiEndpoint<TApi, TFn extends EndpointFunction<TApi, any, any>>(
    endpoint: TFn,
    options: { baseUrl: string }
  ): string
  ```
* **Description:** Builds the full URL for a given API endpoint.

---

### `isKeyOfApi(value)`

* **Signature:**

  ```ts
  function isKeyOfApi<TApi extends Record<string, Function>>(
    value: ApiEndpoint<TApi, any, any>
  ): value is keyof TApi
  ```
* **Description:** Type-guard that asserts whether a string is a key of your API client interface.

---

### `AuthInterceptor`

* **Type:** Class
* **Description:** A gRPC Connect interceptor that attaches an Authorization header to every request.

```ts
import { AuthInterceptor } from '@devkit/api-client';

const auth = new AuthInterceptor(() => getToken());
```

---

> *Continue similarly for* `AssertIsDefined`, `deepMerge`, `ObjectKeys`, `subtractRecords`, etc.

````

---

### 2. Register in Sidebar

In `apps/docs-site/.vitepress/config.js` (or `.ts`):

```js
import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'DevKit Documentation',
  themeConfig: {
    sidebar: [
      { text: 'Introduction', link: '/' },
      { text: 'API Client',   link: '/api-client' },
      // …other package docs
    ]
  }
});
````

