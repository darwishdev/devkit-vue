To document your `api-client` index file in VitePress, you’ll:

1. **Create a new Markdown page** under your docs-site (e.g. `apps/docs-site/docs/api-client.md`).
2. **Add front-matter** for VitePress (title, sidebar order, etc.).
3. **Write sections** for installation, basic usage, and detail each export with a signature and description.
4. **Hook it into your sidebar** in `.vitepress/config.js` (or `sidebar.ts`).

---

### 1. Create `api-client.md`

In `apps/docs-site/docs/api-client.md`:

````md
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

---

### 3. Verify & Serve

```bash
cd apps/docs-site
pnpm install
pnpm docs:dev
```

Now your `@devkit/api-client` docs will show up in your VitePress site sidebar, complete with usage examples and detailed API reference.
