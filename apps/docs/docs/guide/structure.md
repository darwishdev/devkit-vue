---
title: Project Structure
---

# Project Structure

DevKit follows a clean, layered architecture designed for rapid development, full-stack type safety, and long-term maintainability. This guide explains the structure of both the **Go-based API** and the **Vue-based Admin Panel**, including how they connect through Buf-powered gRPC and shared schema logic.

## 🧱 Backend: `devkit-api` (Go + gRPC)

The backend follows a strict **Clean Architecture** pattern. Each domain (like `accounts`, `public`, or `tenant`) is broken into three layers: `adapter`, `usecase`, and `repo`.

### Top-Level Structure

```
devkit-api/
├── api/             # gRPC transport layer (Connect)
├── app/             # Clean architecture logic grouped by domain
├── config/          # Environment variables and config loading
├── db/              # SQLC-generated queries + transaction helpers
├── pkg/             # Internal packages (auth, redis, resend, etc.)
├── proto/           # Protobuf source files (Buf-compatible)
├── proto_gen/       # Generated gRPC stubs and connect wrappers
├── seeds/           # Seed assets and data
├── Dockerfile       # Container entrypoint
├── main.go          # App entry point
└── docker-compose.yml
```

### Domain Example: `app/accounts`

```
app/accounts/
├── adapter/         # Maps usecase <-> transport (e.g. gRPC)
├── usecase/         # Business logic with strong interfaces
├── repo/            # Implementation of storage with SQLC
```

Each domain also exposes features like `user`, `role`, `auth`, and implements its own logic through these layers.

### gRPC API & Interceptors

The `api/` directory contains:

- gRPC server logic (Connect-compatible)
- Middleware interceptors (logging, validation, authentication, authorization)
- RPC handlers organized by domain (e.g. `accounts_user_rpc.go`, `public_icon_rpc.go`)

### Protobuf + Buf Integration

```
proto/
└── devkit/v1/
    ├── accounts_user.proto
    ├── public_icon.proto
    └── ...
```

Used with Buf to:

- Generate client types (`proto_gen/`)
- Maintain consistent request/response types
- Allow frontend projects to pull versions using `buf registery`

---

## 🎨 Frontend: `admin-example` (Vue 3 + Vite + Tailwind)

The frontend follows a **modular domain/feature layout** that mirrors the backend structure. It's built using Vite, TailwindCSS, FormKit, and PrimeVue.

### Top-Level Structure

```
admin-example/
├── public/              # Static assets
├── src/
│   ├── app/             # Feature modules grouped by domain
│   ├── pkg/             # Shared components, plugins, utils
│   ├── assets/          # Static Vue assets
│   ├── components/      # Global components
│   ├── main.ts          # App entry
│   └── router/          # Router definition
├── tailwind.config.js
├── vite.config.ts
└── tsconfig*.json
```

### Feature Module Example: `app/accounts`

```
app/accounts/
├── constants/           # Route names, keys, filters
├── user/views/          # `UserListView.vue`, `UserCreateView.vue`, etc.
├── role/views/          # Same for roles
├── session/views/       # Session list, etc.
└── routes.ts            # Feature routes
```

### Shared Packages in `pkg/`

```
pkg/
├── api/                 # Typed API client (Buf + Connect)
├── components/          # Layouts, toggle controls, DataList
├── plugins/             # i18n, global plugin hooks
├── router/              # Base router config
├── style/               # PrimeVue overrides + Tailwind
├── utils/               # Utilities
└── views/               # Common views like Login, NotFound, Dashboard
```

---

## 🔗 API ↔ Admin Integration

The admin project uses the generated TypeScript API client from Buf:

```ts
import { apiClient } from "@/pkg/api/apiClient";
```

Then passed into components like `<AppForm>`, `<DataList>`, and feature views, enabling:

- Strongly typed forms and tables
- Reusable schemas
- Safe refactoring when backend contracts change

---

## 🧠 Summary

| Layer      | Backend (`devkit-api`)               | Frontend (`admin-example`)            |
| ---------- | ------------------------------------ | ------------------------------------- |
| Transport  | gRPC via Connect                     | Buf + Connect client                  |
| Core Logic | Usecases                             | Feature views + layout templates      |
| Storage    | SQLC-generated PostgreSQL queries    | IndexedDB (Dexie) or live calls       |
| Schema     | Protobuf definitions (`proto/`)      | Reused via generated TS client        |
| Separation | Clean Architecture (adapter/usecase) | Modular app/features/routes/constants |

DevKit’s structure makes it easy to add new features to both frontend and backend using the CLI — ensuring consistency across projects and teams.

→ [Next: Installation & Setup](./installation.md)
