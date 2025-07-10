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
      { text: "Documentation", link: "/documentation/" },
      { text: "Guide", link: "/guide/" },
      { text: "API", link: "/api/" },
      { text: "GitHub", link: "https://github.com/your-org/devkit-vue" },
    ],
    sidebar: {
      "/documentation/": [
        {
          collapsed: false,
          text: "Getting Started",
          items: [
            {
              text: "Introduction",
              link: "/documentation/",
            },
            {
              text: "Setup",
              link: "/documentation/setup",
            },
            {
              text: "Play Ground",
              link: "/documentation/playground",
            },
          ],
        },
        {
          text: "Installation",
          collapsed: false,
          items: [
            {
              text: "Base Components",
              link: "/documentation/installation/base-components",
            },
            { text: "Form", link: "/documentation/installation/form" },
            { text: "Datalist ", link: "/documentation/installation/datalist" },
            {
              text: "File Manager",
              link: "/documentation/installation/filemanager",
            },
            { text: "Admin Panel", link: "/documentation/installation/admin" },
          ],
        },
        {
          text: "Components",
          collapsed: false,
          items: [
            {
              text: "Base Components",
              items: [
                {
                  text: "AppBtn",
                  link: "/documentation/components/base-components/AppBtn",
                },
                {
                  text: "AppIcon",
                  link: "/documentation/components/base-components/AppIcon",
                },
                {
                  text: "AppImage",
                  link: "/documentation/components/base-components/AppImage",
                },
                {
                  text: "AppThemeToggler",
                  link: "/documentation/components/base-components/AppThemeToggler",
                },
                {
                  text: "AppLocaleToggler",
                  link: "/documentation/components/base-components/AppLocaleToggler",
                },
                {
                  text: "AppSection",
                  link: "/documentation/components/base-components/AppSection",
                },
                {
                  text: "AppDialog",
                  link: "/documentation/components/base-components/AppDialog",
                },
                {
                  text: "AppBreadcrumb",
                  link: "/documentation/components/base-components/AppBreadcrumb",
                },
                {
                  text: "AppMenu",
                  link: "/documentation/components/base-components/AppMenu",
                },
              ],
            },
            {
              text: "Form Components",
              items: [
                {
                  text: "AppForm",
                  link: "/documentation/components/form/AppForm",
                },
                {
                  text: "LoginForm",
                  link: "/documentation/components/form/LoginForm",
                },
                {
                  text: "Inputs",
                  items: [
                    {
                      text: "DatePicker",
                      link: "/documentation/components/form/inputs/DatePicker",
                    },
                    {
                      text: "Dropdown",
                      link: "/documentation/components/form/inputs/Dropdown",
                    },
                    {
                      text: "Upload",
                      link: "/documentation/components/form/inputs/Upload",
                    },
                  ],
                },
              ],
            },
            {
              text: "Data Tables",
              items: [
                {
                  text: "Datalist",
                  link: "/documentation/components/datalist/Datalist",
                },
                {
                  text: "ColumnBase",
                  link: "/documentation/components/datalist/ColumnBase",
                },
                {
                  text: "ColumnText",
                  link: "/documentation/components/datalist/ColumnText",
                },
                {
                  text: "ColumnDate",
                  link: "/documentation/components/datalist/ColumnDate",
                },
                {
                  text: "ColumnImage",
                  link: "/documentation/components/datalist/ColumnImage",
                },
              ],
            },
            {
              text: "File Manager",
              items: [
                {
                  text: "FileManager",
                  link: "/documentation/components/filemanager/FileManager",
                },
              ],
            },
          ],
        },
      ],
    },
  },
});
