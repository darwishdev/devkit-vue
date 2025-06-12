
// apps/docs-site/.vitepress/config.ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'DevKit Vue',
  description: 'Build admin panels and front-office apps with Vue, FormKit, and gRPC.',
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }]
  ],
  themeConfig: {
    siteTitle: 'DEVKIT',
    logo: 'https://otsrbanqbblnausaspta.supabase.co/storage/v1/object/public/abchotels/D-logo.png',
    nav: [
      { text: 'Documentation', link: '/documentation/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: 'GitHub', link: 'https://github.com/your-org/devkit-vue' }
    ]
  }
})
