
// apps/docs-site/.vitepress/theme/plugins/formkit.ts
import { App } from 'vue'
import { plugin as FormKitPlugin, defaultConfig } from '@formkit/vue'

export function registerFormKit(app: App) {
	app.use(FormKitPlugin, defaultConfig({
		locale: 'en',  // your default locale
	}))
}
