
// apps/docs-site/.vitepress/config.ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/',
  title: 'DevKit Documentation',
  description: 'Documentation for all DevKit Vue packages',

  themeConfig: {
    nav: [
      { text: 'Home',           link: '/' },
      { text: 'API Client',     link: '/api-client/' },
      { text: 'Base Components', link: '/base-components/' },
      { text: 'Config',         link: '/config/' },
      { text: 'Form',           link: '/form/' },
      { text: 'Data List',      link: '/datalist/' },
    ],
    sidebar: {
      '/api-client/': [
        { text: 'Overview',       link: '/api-client/' },
        { text: 'API Client',     link: '/api-client/api-client' },
        { text: 'Object Utils',   link: '/api-client/object-utils' },
        { text: 'Type Utils',     link: '/api-client/type-utils' },
        { text: 'API Interceptors', link: '/api-client/api-interceptors' },
        { text: 'API Types',      link: '/api-client/api-types' },
      ],
      '/base-components/': [
        { text: 'Overview',      link: '/base-components/' },
        { text: 'Installation',  link: '/base-components/installation' },
        { text: 'Configuration', link: '/base-components/configuration' },
        { text: 'Components',    link: '/base-components/components' },
        { text: 'Utilities',     link: '/base-components/utils' },
      ],
      '/config/': [
        { text: 'Overview',      link: '/config/' },
      ],
      '/form/': [
        { text: 'Overview',      link: '/form/' },
      ],
      '/datalist/': [
        { text: 'Overview',      link: '/datalist/' },
      ],
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

