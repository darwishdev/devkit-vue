
# Utilities & Types

## `cacheHelper`

- `.getLocale(): Promise<string>`  
- `.setLocale(lng: string): Promise<void>`

## `iconHelper`

- `.find(name: string): Promise<SVGElement>`

## `setupI18nSync()`

Call inside any component’s `setup()` to auto-toggle to Arabic if the saved locale is `'ar'`:

```ts
import { setupI18nSync } from '@devkit/base-components'

export default {
  setup() {
    setupI18nSync()
  }
}
