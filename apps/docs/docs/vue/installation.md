---
title: Installation & Setup
---

# Installation & Setup

DevKit is split into three major components:

1. The **CLI** – for scaffolding full-stack projects and features
2. The **Backend API** – a Go application with gRPC, Buf, and SQLC
3. The **Frontend UI** – Vue packages for admin and front-office apps

This guide walks you through setting up the CLI on your platform, installing required dependencies, and linking internal Vue packages for usage in your project.

---

## 🧰 Install the DevKit CLI

The `devkit` CLI helps you quickly generate projects, domains, features, and endpoints.

### macOS / Linux

```bash
curl -sSL https://raw.githubusercontent.com/darwishdev/devkit-cli/main/install.sh | bash
```

> ✅ Installs the CLI globally at `/usr/local/bin/devkit`

### Windows

Use PowerShell:

```powershell
irm https://raw.githubusercontent.com/darwishdev/devkit-cli/main/install.ps1 | iex
```

> You may need to approve script execution:
> `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`

---

## 📦 Install System Dependencies

Before using DevKit CLI or building the backend/frontend, install the following tools:

| Tool             | Purpose                                 | Install Docs                                         |
| ---------------- | --------------------------------------- | ---------------------------------------------------- |
| **Go**           | Backend language (1.20+)                | [golang.org/dl](https://golang.org/dl/)              |
| **Node.js**      | Frontend tooling (18+ recommended)      | [nodejs.org](https://nodejs.org)                     |
| **Buf**          | Protobuf registry + code generation     | [buf.build](https://docs.buf.build/installation)     |
| **SQLC**         | Generate Go code from SQL queries       | [sqlc.dev](https://docs.sqlc.dev/overview/install)   |
| **Docker**       | Run PostgreSQL, Redis, Supabase locally | [docker.com](https://docs.docker.com/get-docker/)    |
| **Supabase CLI** | Manage Supabase locally                 | [supabase.com](https://supabase.com/docs/guides/cli) |
| **PNPM**         | Monorepo package manager                | [pnpm.io](https://pnpm.io/installation)              |

Optional tools (used in DevKit but not required to start):

- **Weaviate** – [weaviate.io](https://weaviate.io/developers/installation)
- **Ollama** – [ollama.ai](https://ollama.ai/download)

---

## 🚀 Create a New Project

Once the CLI is installed and your environment is ready:

### Create a new API project

```bash
devkit new api my-backend
cd my-backend
```

### Create a new Admin panel

```bash
devkit new admin my-admin
cd my-admin
```

Each project will guide you through setting up your environment and dependencies.

---

## 📦 Install Vue Packages

DevKit Vue is modular. You can install the full admin UI or individual packages.

### Recommended: Full Admin Install

```bash
pnpm add @devkitvue/admin
```

Or follow the internal guide: [@devkit/admin](/vue/admin)

### Individual Packages

| Package                      | Purpose                               | Install                       |
| ---------------------------- | ------------------------------------- | ----------------------------- |
| `@devkitvue/form`            | Schema-driven forms                   | [Guide](/vue/form)            |
| `@devkitvue/datalist`        | Typed datatables with filters/actions | [Guide](/vue/datalist)        |
| `@devkitvue/filemanager`     | Bucket-based file management          | [Guide](/vue/filemanager)     |
| `@devkitvue/base-components` | Shared UI primitives                  | [Guide](/vue/base-components) |
| `@devkitvue/api-client`      | Typed API integration (Buf + Connect) | [Guide](/vue/api-client-pkg)  |
| `@devkitvue/config`          | Shared Tailwind + TS config           | [Guide](/vue/config)          |

---

## 🧪 Verify Installation

To run the backend API for development:

```bash
make initial_setup
make dev
```

### What `make initial_setup` does:

- Starts Supabase locally (`supabase start`)
- Runs SQLC to generate query implementations
- Runs Buf to generate gRPC and Connect code
- Seeds the database with default users, tenants, etc.

After setup:

- `make dev` runs `go run main.go`
- API should be available at `http://localhost:8080`

### To run the Vue Admin panel:

```bash
pnpm install
pnpm dev
```

The admin will launch at `http://localhost:5173`.

---

→ [Next: Folder Conventions](./conventions.md)
