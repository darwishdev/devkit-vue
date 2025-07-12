# DevKit Vue

**Composable Vue 3 UI & admin framework** built for rapid full-stack development, tightly integrated with a gRPC backend — but flexible enough to work with any API SDK.

> Powered by Vite, PNPM, FormKit, PrimeVue, and a modular monorepo architecture.

---

## ✨ Overview

DevKit Vue is a modular, production-ready development kit designed to accelerate the creation of **admin panels**, **front-office apps**, and **internal tools**.

It consists of multiple Vue packages and utilities that work seamlessly together inside a [Turborepo](https://turbo.build/repo)-powered monorepo.

---

## 📦 Packages

This monorepo contains the following internal packages:

| Package | Description |
|--------|-------------|
| [`@devkitvue/admin`](./packages/admin) | Ready-made admin panel template built from all internal packages |
| [`@devkitvue/form`](./packages/form) | FormKit-based wrapper with custom inputs & smart form handling |
| [`@devkitvue/datalist`](./packages/datalist) | Powerful datatable wrapper with actions, filters, and layouts |
| [`@devkitvue/filemanager`](./packages/filemanager) | Bucket-based file manager with upload/delete/rename support |
| [`@devkitvue/base-components`](./packages/base-components) | Common UI components like `APPBtn`, `APPImage`, etc. |
| [`@devkitvue/api-client`](./packages/api-client) | Typed gRPC API client helpers, like `resolveApiEndpoint` |
| [`@devkitvue/config`](./packages/config) | Shared TS configs, styles, and aliases across all packages |

---

## 🏗️ Architecture

- **Monorepo** managed with **Turborepo**  
- **PNPM workspaces** for efficient dependency management  
- **Vue 3 + Vite** for fast development and builds  
- **FormKit** for declarative, extendable form rendering  
- **PrimeVue** for UI primitives  
- **Flexible API client support**:  
  DevKit is **deeply optimized for gRPC APIs** using the included `@devkitvue/api-client`, but you can also integrate it with any custom REST or HTTP API.  
  Simply create your own API SDK that wraps your API calls and pass it as the `apiClient` option during app/plugin setup — everything will work seamlessly.

---

## 📂 Directory Structure

```

apps/
docs/                # VitePress documentation site

packages/
admin/               # Full admin panel wrapper
base-components/     # Shared UI elements
config/              # TS config, Tailwind config, PostCSS etc.
datalist/            # Smart data table component
filemanager/         # File upload & management
form/                # FormKit abstraction layer
api-client/          # API call helpers & types

````

---

## 🚀 Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/darwishdev/devkit-vue.git
cd devkit-vue
````

2. **Install all dependencies**

```bash
pnpm setup-deps
```

> This installs all dependencies across all apps and packages using PNPM Workspaces.

3. **Build all internal packages**

```bash
pnpm build
```

4. **Start the documentation site**

```bash
pnpm dev
```

> This launches the **VitePress docs site** from `apps/docs`, where you can explore usage, features, and examples.

---

## 🔌 API Integration

DevKit supports any API SDK:

```ts
import { createApp } from 'vue'
import AdminApp from '@devkitvue/admin'
import myCustomApiClient from './my-rest-api-sdk' // your REST wrapper

createApp(App)
  .use(AdminApp, {
    apiClient: myCustomApiClient, // gRPC or REST
    baseImageUrl: '',
    noImageUrl: '',
    locales: [],
  })
  .mount('#app')
```

> You are not limited to gRPC — DevKit works with **any structured API SDK**, as long as it exposes predictable functions.

---

## 📖 Documentation

Visit the [Docs Site](./apps/docs) for:

* Package usage & examples
* Table & form schemas
* API client integration
* Theming & customization

---

## 🧱 Features

* 🧩 **Composable packages** — use only what you need
* ⚡ **Fast builds** with Vite and Turbo
* 🎛️ **FormKit-driven forms** with validation, notifications, and logic
* 🧮 **Datalist** with CRUD, filters, layouts, and schema config
* 🗃️ **File manager** for Supabase/GCS-compatible buckets
* 🧠 **Smart API client** for gRPC or custom SDKs
* 🎨 **Beautiful components** with theme support

---

## 🛠️ Tooling

| Tool          | Purpose                                 |
| ------------- | --------------------------------------- |
| **Turborepo** | Orchestrates tasks across packages      |
| **PNPM**      | Fast, disk-efficient dependency manager |
| **Vite**      | Lightning-fast build and dev            |
| **FormKit**   | Declarative forms                       |
| **PrimeVue**  | UI toolkit                              |
| **VitePress** | Project documentation                   |

---

## 🧪 Testing

Each package can contain its own tests using Vitest:

```bash
pnpm --filter @devkitvue/form test
```

---

## 📦 Publishing

DevKit uses [Changesets](https://github.com/changesets/changesets) for versioning and publishing:

```bash
# Create a changeset
pnpm changeset

# Apply version bumps
pnpm changeset version

# Publish all updated packages
pnpm publish -r --access public
```

---

## 🤝 Contributing

1. Fork the repo
2. Create your branch (`git checkout -b feature/my-feature`)
3. Make changes and test locally
4. Commit (`pnpm changeset`)
5. Push and create a PR

---

## 📄 License

MIT License © \[DARWISHDEV]

---

## 🌐 Links

* GitHub: [github.com/darwishdev/devkit-vue](https://github.com/darwishdev/devkit-vue)
* Documentation: `/apps/docs`
* Backend API (gRPC): [devkit-api](https://github.com/darwishdev/devkit-api)

---
