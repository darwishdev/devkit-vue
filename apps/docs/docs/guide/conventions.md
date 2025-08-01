---
title: Folder Conventions
---

# Folder Conventions

DevKit promotes consistency and maintainability through a clear folder structure across both the **API** and **Admin** projects. This guide explains how to organize your files, write scalable code, and locate functionality at a glance.

---

## 🧱 API Project Structure

Each DevKit API project follows a **modular domain-based structure**:

```
my-backend/
├── app/
│   └── accounts/             # Domain name
│       ├── adapter/          # Request/response mapping (API ⇄ usecase ⇄ DB)
│       ├── repo/             # Query logic and interfaces
│       ├── usecase/          # Core business logic
├── api/                      # gRPC server bindings and endpoint wiring
├── proto/                    # Protobuf service & message definitions
├── supabase/
│   ├── init/                 # Supabase seed scripts
│   ├── queries/              # SQLc queries for each feature
│   └── migration/            # SQL migrations
├── testdata/                 # Test fixtures and sample payloads
├── internal/                 # Internal tools/utilities
└── main.go                   # Entry point
```

**Domain Layering**

Each domain (e.g. `accounts`) follows a clean architecture pattern:

- `adapter/`: Transforms incoming gRPC/REST requests into internal structs (e.g. SQL params), and maps DB/query results back into API responses.
- `repo/`: Interface + implementation for data access
- `usecase/`: Core business rules and logic. The usecase layer acts as the orchestration layer — from here, you invoke the adapter to prepare inputs and parse outputs, and call the repo layer to execute queries or persistence operations

The CLI auto-generates this structure when running `devkit new domain`.

## 🧩 Admin Panel Structure

Admin panels scaffolded with DevKit follow a structured layout to promote separation of concerns:

```
my-admin/
├── src/
│   ├── app/
│   │   ├── accounts/
│   │   │   ├── constants/                # Field and route metadata
│   │   │   ├── user/views/               # Views: List, Create, Update, etc.
│   │   │   ├── role/views/
│   │   │   └── session/views/
│   │   └── public/                       # Public features like files
│   │       └── file/views/
│   ├── pkg/
│   │   ├── api/                          # API client (Connect + Buf)
│   │   ├── components/                   # Layouts and base components
│   │   ├── plugins/                      # i18n, toast, formkit config
│   │   ├── router/                       # App routes
│   │   ├── style/                        # Tailwind + PrimeVue overrides
│   │   ├── types/                        # Shared type declarations
│   │   └── utils/                        # Utility functions
│   ├── views/                            # Entry views like login, dashboard
│   └── main.ts                           # App entrypoint
```

**Key Folder Purposes**

- `app/`: Feature modules organized by domain
- `pkg/`: Shared plugins, layouts, and logic
- `views/`: Top-level public views (Login, NotFound, etc.)

Each feature folder (`user`, `role`, etc.) contains Vue views following the CRUD model:

- `FeatureListView.vue`
- `FeatureCreateView.vue`
- `FeatureUpdateView.vue`
- `FeatureFindView.vue`

These are auto-generated with `devkit new feature`.

---

## 💡 Tips

- Keep your logic per domain, even shared logic (don’t centralize prematurely)
- Use CLI commands to scaffold domains, features, and endpoints consistently
- Avoid creating new base layers unless absolutely necessary — rely on DevKit structure

---

→ [Next: API vs Admin Projects](./api-vs-admin.md)
