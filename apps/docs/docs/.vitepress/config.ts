
// apps/docs-site/.vitepress/config.ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/',
  title: 'DevKit Documentation',
  description: 'Documentation for all DevKit Vue packages',

  themeConfig: {
    nav: [
      { text: 'Home',       link: '/' },
      { text: 'Base Components', link: '/base-components/' },
      { text: 'Form', link: '/form/' },
      { text: 'Data List', link: '/datalist/' },
      { text: 'Admin', link: '/admin/' },
      { text: 'Front Office', link: '/front-office/' },
      // add other top‐level sections here…
    ],
    sidebar: {
      '/base-components/': [
        { text: 'Overview',      link: '/base-components/' },
        { text: 'Installation',  link: '/base-components/installation' },
        { text: 'Configuration', link: '/base-components/configuration' },
        { text: 'Components',    link: '/base-components/components' },
        { text: 'Utilities',     link: '/base-components/utils' },
      ],
      // sidebar entries for other sections…
    }
  },

  // — your DevKit base‐config gets injected as a global at build‐time
  vite: {
    define: {
      'process.env': {
        VITE_API_URL: JSON.stringify('https://api.example.com')
      }
    },
    plugins: [
          ]
  }
})

