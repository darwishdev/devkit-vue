

---

## 4. `configuration.md`

```md
# Configuration & Setup

Import and register the plugin in your app entry (e.g. VitePress’ `enhanceApp`):

```ts
// apps/docs-site/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import DevkitBaseComponents from '@devkit/base-components'
import { myApiClient, ICON_FIND_ENDPOINT } from './myApiSetup'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(DevkitBaseComponents, {
      apiClient: myApiClient,
      baseImageUrl: 'https://cdn.example.com/',
      noImageUrl: '/fallback.png',
      locales: ['en', 'ar'],
      iconFindApi: ICON_FIND_ENDPOINT,
    })
  }
}
