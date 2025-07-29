// apps/docs-site/.vitepress/config.ts

import { defineConfig } from "vitepress";

export default defineConfig({
  title: "DevKit Vue",
  description:
    "Build admin panels and front-office apps with Vue, FormKit, and gRPC.",
  head: [["link", { rel: "icon", href: "/logo.svg" }]],
  themeConfig: {
    siteTitle: "DEVKIT",
    logo: "https://otsrbanqbblnausaspta.supabase.co/storage/v1/object/public/abchotels/D-logo.png",
    nav: [
      { text: "Guide", link: "/guide/" },
      { text: "CLI", link: "/cli/" },
      { text: "API", link: "/api/" },
      { text: "Vue Packages", link: "/vue/" },
      { text: "Admin Example", link: "/admin-example/" },
      { text: "Cookbook", link: "/cookbook/" },
      { text: "Reference", link: "/reference/" },
      {
        text: "GitHub",
        link: "https://github.com/darwishdev/devkit",
      },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [
            { text: "Introduction", link: "/guide/" },
            { text: "Philosophy & Goals", link: "/guide/philosophy" },
            { text: "Project Structure", link: "/guide/structure" },
            { text: "Installation & Setup", link: "/guide/installation" },
            { text: "Folder Conventions", link: "/guide/conventions" },
            { text: "API vs Admin Projects", link: "/guide/api-vs-admin" },
          ],
        },
      ],
      "/cli/": [
        {
          text: "DevKit CLI",
          items: [
            { text: "Overview", link: "/cli/" },
            { text: "Create API Project", link: "/cli/new-api" },
            { text: "Create Admin Project", link: "/cli/new-admin" },
            { text: "Add Domain", link: "/cli/new-domain" },
            { text: "Add Feature", link: "/cli/new-feature" },
            { text: "Add Endpoint", link: "/cli/new-endpoint" },
            { text: "Upgrade CLI Projects", link: "/cli/upgrade" },
          ],
        },
      ],
      "/api/": [
        {
          text: "DevKit API",
          items: [
            { text: "Overview", link: "/api/" },
            { text: "Architecture", link: "/api/architecture" },
            { text: "Supabase Integration", link: "/api/supabase" },
            { text: "Redis Setup", link: "/api/redis" },
            { text: "Docker & Compose", link: "/api/docker" },
          ],
        },
        {
          text: "Accounts Domain",
          items: [
            { text: "Users", link: "/api/accounts/users" },
            { text: "Roles", link: "/api/accounts/roles" },
            { text: "Permissions", link: "/api/accounts/permissions" },
            { text: "Auth Flow", link: "/api/accounts/auth" },
          ],
        },
        {
          text: "Development Guide",
          items: [
            { text: "Add a New Domain", link: "/api/domains" },
            { text: "Use SQLC & Migrations", link: "/api/sqlc" },
            { text: "gRPC + Connect + Buf", link: "/api/grpc" },
          ],
        },
      ],
      "/vue/": [
        {
          text: "Vue Packages",
          items: [
            { text: "Overview", link: "/vue/" },
            { text: "Installation", link: "/vue/installation" },
            { text: "Theming & Localization", link: "/vue/theming" },
            { text: "API Client Setup", link: "/vue/api-client" },
          ],
        },
        {
          text: "Core Packages",
          items: [
            { text: "@devkit/admin", link: "/vue/admin" },
            { text: "@devkit/form", link: "/vue/form" },
            { text: "@devkit/datalist", link: "/vue/datalist" },
            { text: "@devkit/filemanager", link: "/vue/filemanager" },
            { text: "@devkit/base-components", link: "/vue/base-components" },
            { text: "@devkit/api-client", link: "/vue/api-client-pkg" },
            { text: "@devkit/config", link: "/vue/config" },
          ],
        },
      ],
      "/admin-example/": [
        {
          text: "Admin Example",
          items: [
            { text: "Overview", link: "/admin-example/" },
            { text: "Connecting to API", link: "/admin-example/connect-api" },
            { text: "Routing & Layouts", link: "/admin-example/routing" },
            { text: "Auth Setup", link: "/admin-example/auth" },
            { text: "Extending Features", link: "/admin-example/extensions" },
          ],
        },
      ],
      "/cookbook/": [
        {
          text: "Cookbook",
          items: [
            { text: "Layout Patterns", link: "/cookbook/layouts" },
            { text: "Table + Form Integration", link: "/cookbook/table-form" },
            { text: "Auth Pages", link: "/cookbook/auth-pages" },
            { text: "Custom Inputs", link: "/cookbook/custom-inputs" },
            { text: "Sidebar Customization", link: "/cookbook/sidebar" },
          ],
        },
      ],
      "/reference/": [
        {
          text: "Reference",
          items: [
            { text: "<AppBtn>", link: "/reference/app-btn" },
            { text: "<AppIcon>", link: "/reference/app-icon" },
            { text: "FormKit Inputs", link: "/reference/formkit-inputs" },
            { text: "Datalist Props", link: "/reference/datalist" },
            {
              text: "AdminApp Plugin Options",
              link: "/reference/admin-plugin",
            },
            { text: "API Client Utils", link: "/reference/api-utils" },
          ],
        },
      ],
    },
  },
});
